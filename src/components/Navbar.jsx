import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:block">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Internal Platform</span>
          <h2 className="text-xl font-bold text-slate-800">
            {user ? `Welcome, ${user.displayName || 'Designer'}` : 'Guest Access'}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary rounded-full border-2 border-white"></span>
        </button>
        
        {user ? (
          <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">
                {user.displayName || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold uppercase">Pro Member</p>
            </div>
            <Link to="/profile">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-xl border-2 border-slate-100 shadow-sm" />
              ) : (
                <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-brand-primary/20">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
            <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
