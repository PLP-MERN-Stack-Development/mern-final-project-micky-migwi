import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Bell, User as UserIcon, LogOut, Moon, Sun, Search, Film, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = user ? notifications.filter(n => n.userId === user.id && !n.read).length : 0;

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, badge }: any) => (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive(to)
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <div className="relative">
        <Icon size={24} strokeWidth={isActive(to) ? 2.5 : 2} />
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span className="font-medium hidden lg:block">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-2 px-4 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white hidden lg:block tracking-tight">ConnectHub</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={Home} label="Home" />
          <NavItem to="/notifications" icon={Bell} label="Notifications" badge={unreadCount} />
          <NavItem to="/assistant" icon={Bot} label="AI Assistant" />
          <NavItem to="/studio" icon={Film} label="Video Studio" />
          <NavItem to={`/profile/${user?.id}`} icon={UserIcon} label="Profile" />
        </nav>

        <div className="mt-auto space-y-2 border-t border-gray-200 dark:border-gray-800 pt-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            <span className="hidden lg:block">Toggle Theme</span>
          </button>
          
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut size={24} />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 md:pb-0 pb-16">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                 <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">ConnectHub</span>
            </div>
            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-400">
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
        </div>

        <div className="p-4 md:p-8">
            {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around p-3 z-30 pb-safe">
        <Link to="/" className={`p-2 rounded-lg ${isActive('/') ? 'text-brand-600' : 'text-gray-500'}`}>
            <Home size={24} />
        </Link>
        <Link to="/assistant" className={`p-2 rounded-lg ${isActive('/assistant') ? 'text-brand-600' : 'text-gray-500'}`}>
            <Bot size={24} />
        </Link>
        <Link to="/studio" className={`p-2 rounded-lg ${isActive('/studio') ? 'text-brand-600' : 'text-gray-500'}`}>
            <Film size={24} />
        </Link>
        <Link to="/notifications" className={`p-2 rounded-lg relative ${isActive('/notifications') ? 'text-brand-600' : 'text-gray-500'}`}>
            <Bell size={24} />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
        </Link>
        <Link to={`/profile/${user?.id}`} className={`p-2 rounded-lg ${isActive(`/profile/${user?.id}`) ? 'text-brand-600' : 'text-gray-500'}`}>
            <UserIcon size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Layout;