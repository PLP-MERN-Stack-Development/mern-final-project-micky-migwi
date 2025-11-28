import React, { useState } from 'react';
import { Film, Upload, Sparkles, AlertCircle, Save, Check, Settings } from 'lucide-react';
import { generateVideo } from '../services/geminiService';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const { createPost } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
        setError("Please enter a prompt describing the video.");
        return;
    }
    setLoading(true);
    setError('');
    setGeneratedVideoUrl(null);

    const rawImage = image ? image.split(',')[1] : undefined;

    try {
        const videoUrl = await generateVideo(prompt, rawImage);
        setGeneratedVideoUrl(videoUrl);
    } catch (err: any) {
        if (err.message === 'API_KEY_REQUIRED') {
            try {
                // Open dialog
                await (window as any).aistudio.openSelectKey();
                // Retry immediately assuming success (skip check to mitigate race condition)
                const videoUrl = await generateVideo(prompt, rawImage, true);
                setGeneratedVideoUrl(videoUrl);
            } catch (retryErr: any) {
                // If the second attempt fails, it might be a real error or the user cancelled
                setError("Generation failed. Please ensure you've selected a valid API Key.");
            }
        } else if (err.message && err.message.includes("Requested entity was not found")) {
            // Handle stale key / invalid project
             try {
                 await (window as any).aistudio.openSelectKey();
                 const videoUrl = await generateVideo(prompt, rawImage, true);
                 setGeneratedVideoUrl(videoUrl);
             } catch (e) {
                 setError("Please ensure you selected a valid project with billing enabled.");
             }
        } else {
            setError(err.message || "Failed to generate video.");
        }
    } finally {
        setLoading(false);
    }
  };

  const handlePostVideo = () => {
      if (!user || !generatedVideoUrl) return;
      createPost(user.id, prompt, image || undefined, generatedVideoUrl);
      navigate('/');
  };

  const openKeyManager = async () => {
      try {
          await (window as any).aistudio.openSelectKey();
      } catch (e) {
          console.error(e);
      }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Film className="mr-3 text-brand-600" size={32} />
                Video Studio
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                Bring images to life with Veo 3. Create dynamic video ads or animate characters.
            </p>
        </div>
        <button 
            onClick={openKeyManager}
            className="flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-brand-600 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
        >
            <Settings size={14} />
            <span>API Key</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    1. Upload Reference Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {image ? (
                        <div className="relative">
                            <img src={image} alt="Reference" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                            <div className="mt-2 text-xs text-green-600 font-medium">Image loaded</div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <Upload size={32} className="mb-2" />
                            <span>Click to upload image</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    2. Describe the video
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., A cinematic shot of this product rotating in a neon environment..."
                    className="w-full h-32 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                />
            </div>
            
            {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full py-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Generating (this may take a minute)...</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        <span>Generate with Veo</span>
                    </>
                )}
            </button>
            <p className="text-xs text-center text-gray-400">
                Requires a paid API key via AI Studio.
            </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center min-h-[400px] overflow-hidden relative">
            {generatedVideoUrl ? (
                <div className="w-full h-full flex flex-col">
                    <video 
                        src={generatedVideoUrl} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-auto flex-1 bg-black"
                    />
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span className="font-medium text-green-600 flex items-center">
                            <Check size={16} className="mr-1" /> Generated Successfully
                        </span>
                        <button 
                            onClick={handlePostVideo}
                            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors flex items-center space-x-1"
                        >
                            <Save size={16} />
                            <span>Post to Feed</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400">
                    <Film size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Video preview will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;