import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Post, Comment, Notification } from '../types';
import { MOCK_USERS, MOCK_POSTS, MOCK_COMMENTS, MOCK_NOTIFICATIONS } from '../constants';

interface DataContextType {
  users: User[];
  posts: Post[];
  comments: Comment[];
  notifications: Notification[];
  createPost: (userId: string, text: string, image?: string, video?: string) => void;
  updatePost: (postId: string, newText: string) => void;
  createComment: (userId: string, postId: string, text: string) => void;
  toggleLike: (userId: string, postId: string) => void;
  toggleFollow: (currentUserId: string, targetUserId: string) => void;
  markNotificationsAsRead: (userId: string) => void;
  getUser: (id: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // Helper to get user
  const getUser = useCallback((id: string) => users.find(u => u.id === id), [users]);

  // Simulate Real-time interactions
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      
      // 10% chance to generate a random like from a bot/other user
      if (Math.random() > 0.9 && randomUser && randomPost) {
        // Just purely visual update to show "live" feeling, not persisting heavily
        setPosts(prev => prev.map(p => {
          if (p.id === randomPost.id && !p.likes.includes(randomUser.id)) {
            return { ...p, likes: [...p.likes, randomUser.id] };
          }
          return p;
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [posts, users]);

  const createPost = (userId: string, text: string, image?: string, video?: string) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId,
      text,
      image,
      video,
      likes: [],
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (postId: string, newText: string) => {
    setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, text: newText } : p
    ));
  };

  const createComment = (userId: string, postId: string, text: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId,
      postId,
      text,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);

    // Notify post owner
    const post = posts.find(p => p.id === postId);
    if (post && post.userId !== userId) {
        const notif: Notification = {
            id: `n${Date.now()}`,
            userId: post.userId,
            sourceUserId: userId,
            type: 'comment',
            postId: postId,
            read: false,
            createdAt: new Date().toISOString()
        };
        setNotifications(prev => [notif, ...prev]);
    }
  };

  const toggleLike = (userId: string, postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(userId);
        const newLikes = isLiked 
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];
        
        // Notify if liking
        if (!isLiked && post.userId !== userId) {
             const notif: Notification = {
                id: `n${Date.now()}`,
                userId: post.userId,
                sourceUserId: userId,
                type: 'like',
                postId: postId,
                read: false,
                createdAt: new Date().toISOString()
            };
            setNotifications(prevNotifications => [notif, ...prevNotifications]);
        }

        return { ...post, likes: newLikes };
      }
      return post;
    }));
  };

  const toggleFollow = (currentUserId: string, targetUserId: string) => {
      setUsers(prevUsers => prevUsers.map(u => {
          if (u.id === currentUserId) {
              const isFollowing = u.following.includes(targetUserId);
              return {
                  ...u,
                  following: isFollowing ? u.following.filter(id => id !== targetUserId) : [...u.following, targetUserId]
              };
          }
          if (u.id === targetUserId) {
              const isFollowedBy = u.followers.includes(currentUserId);
              
              if (!isFollowedBy) {
                  // Notify target user
                  const notif: Notification = {
                    id: `n${Date.now()}`,
                    userId: targetUserId,
                    sourceUserId: currentUserId,
                    type: 'follow',
                    read: false,
                    createdAt: new Date().toISOString()
                  };
                  setNotifications(prev => [notif, ...prev]);
              }

              return {
                  ...u,
                  followers: isFollowedBy ? u.followers.filter(id => id !== currentUserId) : [...u.followers, currentUserId]
              };
          }
          return u;
      }));
  };

  const markNotificationsAsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    ));
  };

  return (
    <DataContext.Provider value={{
      users,
      posts,
      comments,
      notifications,
      createPost,
      updatePost,
      createComment,
      toggleLike,
      toggleFollow,
      markNotificationsAsRead,
      getUser
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};