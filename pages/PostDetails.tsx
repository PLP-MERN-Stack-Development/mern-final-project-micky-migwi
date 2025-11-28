import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import PostCard from '../components/PostCard';
import { ArrowLeft, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, comments, users, createComment } = useData();
  const [commentText, setCommentText] = useState('');

  const post = posts.find(p => p.id === id);
  const postComments = comments
    .filter(c => c.postId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Post not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-brand-600 hover:underline">Go Home</button>
      </div>
    );
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    createComment(user.id, post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center space-x-2 text-gray-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <PostCard post={post} />

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Comments ({postComments.length})</h3>

        {/* Add Comment */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex space-x-4">
             <img 
                src={user?.avatar} 
                className="w-10 h-10 rounded-full object-cover" 
                alt="user"
             />
             <form onSubmit={handleComment} className="flex-1 relative">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
                <button 
                    type="submit"
                    disabled={!commentText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-600 p-1.5 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <Send size={18} />
                </button>
             </form>
        </div>

        {/* Comment List */}
        <div className="space-y-4">
          {postComments.map(comment => {
            const author = users.find(u => u.id === comment.userId);
            if (!author) return null;
            return (
              <div key={comment.id} className="flex space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <img 
                    src={author.avatar} 
                    alt={author.username} 
                    className="w-10 h-10 rounded-full object-cover" 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{author.username}</span>
                    <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
