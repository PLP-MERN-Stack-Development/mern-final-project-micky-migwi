import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit2, X, Check, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { users, toggleLike, comments, updatePost } = useData();
  const { user } = useAuth();
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.text);
  const [showMenu, setShowMenu] = useState(false);

  const author = users.find(u => u.id === post.userId);
  const isLiked = user ? post.likes.includes(user.id) : false;
  const postComments = comments.filter(c => c.postId === post.id);
  const isAuthor = user?.id === post.userId;

  const handleLike = () => {
    if (!user) return;
    toggleLike(user.id, post.id);
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  const handleSaveEdit = () => {
      if (editContent.trim()) {
          updatePost(post.id, editContent);
          setIsEditing(false);
          setShowMenu(false);
      }
  };

  const handleCancelEdit = () => {
      setEditContent(post.text);
      setIsEditing(false);
      setShowMenu(false);
  };

  if (!author) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-4 relative">
          <Link to={`/profile/${author.id}`} className="flex items-center space-x-3 group">
            <img 
                src={author.avatar} 
                alt={author.username} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand-500 transition-all" 
            />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                {author.username}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </Link>
          
          {isAuthor && (
              <div className="relative">
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <MoreHorizontal size={20} />
                </button>
                
                {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-100 dark:border-gray-600 z-10 overflow-hidden">
                        <button 
                            onClick={() => { setIsEditing(true); setShowMenu(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
                        >
                            <Edit2 size={14} />
                            <span>Edit Post</span>
                        </button>
                    </div>
                )}
              </div>
          )}
        </div>

        {isEditing ? (
            <div className="mb-4">
                <textarea 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none min-h-[100px]"
                />
                <div className="flex justify-end space-x-2 mt-2">
                    <button 
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveEdit}
                        className="px-3 py-1.5 text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 rounded-lg flex items-center space-x-1"
                    >
                        <Save size={14} />
                        <span>Save</span>
                    </button>
                </div>
            </div>
        ) : (
            <Link to={`/post/${post.id}`} className="block">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed mb-4 text-base">
                {post.text}
            </p>
            
            {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-900">
                <img src={post.image} alt="Post attachment" className="w-full h-auto object-cover max-h-96" />
                </div>
            )}
            
            {post.video && (
                <div className="mb-4 rounded-xl overflow-hidden shadow-inner bg-black">
                    <video 
                        src={post.video} 
                        controls 
                        className="w-full h-auto max-h-96 mx-auto"
                        poster={post.image} 
                    />
                </div>
            )}
            </Link>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-6">
            <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                    isLiked ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500'
                }`}
            >
              <div className={`${isLikeAnimating ? 'animate-bounce' : ''}`}>
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </div>
              <span className="font-medium">{post.likes.length}</span>
            </button>

            <Link 
                to={`/post/${post.id}`}
                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors"
            >
              <MessageCircle size={20} />
              <span className="font-medium">{postComments.length}</span>
            </Link>
          </div>
          
          <button className="text-gray-400 hover:text-brand-500 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;