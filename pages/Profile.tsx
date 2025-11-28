import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { MapPin, Link as LinkIcon, Calendar, UserPlus, UserCheck, Mail } from 'lucide-react';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { users, posts, toggleFollow } = useData();
  const { user: currentUser } = useAuth();

  const profileUser = users.find(u => u.id === id);
  const userPosts = posts
    .filter(p => p.userId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!profileUser) return <div className="p-8 text-center text-gray-500">User not found</div>;

  const isFollowing = currentUser ? currentUser.following.includes(profileUser.id) : false;
  const isMe = currentUser?.id === profileUser.id;

  const handleFollow = () => {
      if (currentUser) {
          toggleFollow(currentUser.id, profileUser.id);
      }
  };

  const handleMessage = () => {
      alert(`Message feature to ${profileUser.username} coming soon!`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-brand-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <img 
                src={profileUser.avatar} 
                alt={profileUser.username} 
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
            />
            
            {!isMe && (
                <div className="flex space-x-3 mb-2">
                    <button 
                        onClick={handleFollow}
                        className={`px-6 py-2 font-semibold rounded-full transition-colors shadow-lg flex items-center space-x-2 ${
                            isFollowing 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600' 
                                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-600/20'
                        }`}
                    >
                        {isFollowing ? <><UserCheck size={18} /><span>Following</span></> : <><UserPlus size={18} /><span>Follow</span></>}
                    </button>
                    <button 
                        onClick={handleMessage}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                        <Mail size={18} />
                        <span>Message</span>
                    </button>
                </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{profileUser.username}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">@{profileUser.username}</p>
            <p className="text-gray-800 dark:text-gray-200 text-lg mb-6 max-w-2xl leading-relaxed">
              {profileUser.bio || "No bio yet."}
            </p>
            
            <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 text-sm mb-6">
                <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-1">
                    <LinkIcon size={16} />
                    <a href="#" className="hover:text-brand-600 hover:underline">website.com</a>
                </div>
                <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Joined September 2023</span>
                </div>
            </div>

            <div className="flex space-x-8 border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="text-center">
                <span className="block font-bold text-xl text-gray-900 dark:text-white">{userPosts.length}</span>
                <span className="text-gray-500 text-sm">Posts</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-xl text-gray-900 dark:text-white">{profileUser.followers.length}</span>
                <span className="text-gray-500 text-sm">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-xl text-gray-900 dark:text-white">{profileUser.following.length}</span>
                <span className="text-gray-500 text-sm">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white px-2">Recent Posts</h2>
        {userPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {userPosts.length === 0 && (
            <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl">
                No posts yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;