import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bookmark, MessageSquare, User, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Bookmark, label: 'Saved Designs', path: '/saved' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/chat' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-screen sticky top-0 z-40">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-primary/30">
            IV
          </div>
          <span className="text-xl font-bold text-white tracking-tight">InteriorVista</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-3">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
            location.pathname === '/' ? "bg-slate-800 text-white font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          )}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-slate-800 text-white font-semibold" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-brand-primary" : "group-hover:scale-110 transition-transform")} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-brand-primary rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
