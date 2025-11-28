import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import PostCard from '../components/PostCard';
import { Image, Send, Sparkles, X, Video } from 'lucide-react';
import { polishContent, generateImageDescription } from '../services/geminiService';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { posts, createPost } = useData();
  const [newPostText, setNewPostText] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postVideo, setPostVideo] = useState<string | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);

  // Sort posts by date desc
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPostImage(base64);
        
        // Optional: Use Gemini to auto-caption the image if text is empty
        if (!newPostText) {
            const rawBase64 = base64.split(',')[1];
            setIsPolishing(true);
            const caption = await generateImageDescription(rawBase64);
            setNewPostText(caption);
            setIsPolishing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostVideo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePolish = async () => {
    if (!newPostText) return;
    setIsPolishing(true);
    const polished = await polishContent(newPostText);
    setNewPostText(polished);
    setIsPolishing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!newPostText.trim() && !postImage && !postVideo)) return;
    createPost(user.id, newPostText, postImage || undefined, postVideo || undefined);
    setNewPostText('');
    setPostImage(null);
    setPostVideo(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-start space-x-4">
          <img 
            src={user?.avatar} 
            alt="My Avatar" 
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
          />
          <div className="flex-1">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What's happening?"
              className="w-full bg-transparent border-none text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 resize-none h-24 p-0"
            />
            
            {postImage && (
              <div className="relative mb-4 inline-block mr-2">
                <img src={postImage} alt="Preview" className="h-40 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                <button 
                  onClick={() => setPostImage(null)}
                  className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 hover:bg-black transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {postVideo && (
              <div className="relative mb-4 inline-block">
                <video src={postVideo} className="h-40 rounded-lg object-cover border border-gray-200 dark:border-gray-700 bg-black" />
                <button 
                  onClick={() => setPostVideo(null)}
                  className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 hover:bg-black transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex space-x-2">
                <label className="p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg cursor-pointer transition-colors" title="Upload Image">
                  <Image size={20} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <label className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg cursor-pointer transition-colors" title="Upload Video">
                  <Video size={20} />
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </label>
                <button 
                    type="button"
                    onClick={handlePolish}
                    disabled={!newPostText || isPolishing}
                    className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-1"
                    title="Enhance with AI"
                >
                  <Sparkles size={20} className={isPolishing ? 'animate-spin' : ''} />
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">AI Polish</span>
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={(!newPostText.trim() && !postImage && !postVideo)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-600/20"
              >
                <span>Post</span>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {sortedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {sortedPosts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                No posts yet. Be the first to share something!
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;