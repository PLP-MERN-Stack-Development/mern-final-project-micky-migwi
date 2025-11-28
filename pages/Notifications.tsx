import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { notifications, users, markNotificationsAsRead } = useData();

  const myNotifications = user
    ? notifications.filter(n => n.userId === user.id)
    : [];

  // Sort by newest
  myNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  useEffect(() => {
    if (user && myNotifications.some(n => !n.read)) {
      // Mark as read when viewing page (simulated delay for UX)
      const timer = setTimeout(() => {
        markNotificationsAsRead(user.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, myNotifications, markNotificationsAsRead]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full text-pink-500"><Heart size={20} fill="currentColor" /></div>;
      case 'comment': return <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-500"><MessageCircle size={20} fill="currentColor" /></div>;
      case 'follow': return <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-500"><UserPlus size={20} /></div>;
      default: return null;
    }
  };

  const getMessage = (n: any, username: string) => {
    switch (n.type) {
        case 'like': return <span><span className="font-bold">{username}</span> liked your post.</span>;
        case 'comment': return <span><span className="font-bold">{username}</span> commented on your post.</span>;
        case 'follow': return <span><span className="font-bold">{username}</span> started following you.</span>;
        default: return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <button 
            className="text-sm text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            onClick={() => user && markNotificationsAsRead(user.id)}
          >
              <Check size={16} />
              <span>Mark all read</span>
          </button>
      </div>

      <div className="space-y-3">
        {myNotifications.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Heart size={32} />
             </div>
             <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          myNotifications.map(notification => {
            const sourceUser = users.find(u => u.id === notification.sourceUserId);
            if (!sourceUser) return null;

            return (
              <Link 
                key={notification.id} 
                to={notification.postId ? `/post/${notification.postId}` : `/profile/${sourceUser.id}`}
                className={`flex items-center space-x-4 p-4 rounded-xl border transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  !notification.read 
                    ? 'bg-white dark:bg-gray-800 border-brand-200 dark:border-brand-900 shadow-sm border-l-4 border-l-brand-500' 
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}
              >
                {getIcon(notification.type)}
                
                <div className="flex-1">
                    <img src={sourceUser.avatar} className="w-8 h-8 rounded-full inline-block mr-2 md:hidden mb-1" alt="" />
                    <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base">
                        {getMessage(notification, sourceUser.username)}
                    </p>
                    <span className="text-xs text-gray-500 mt-1 block">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                </div>
                
                {!notification.read && (
                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
