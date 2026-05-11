import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Settings, LogOut, Heart, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuth();

  const stats = [
    { icon: Heart, label: 'Saved Designs', value: '12', color: 'text-rose-500' },
    { icon: Clock, label: 'Design Hours', value: '45', color: 'text-blue-500' },
    { icon: Award, label: 'Level', value: 'Pro', color: 'text-amber-500' },
  ];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-stone-200 border border-stone-100 flex flex-col items-center">
        <div className="relative group">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg group-hover:scale-105 transition-transform" 
            />
          ) : (
            <div className="w-32 h-32 bg-brand-primary rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {user.displayName?.[0] || 'U'}
            </div>
          )}
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-stone-100 text-stone-600 hover:text-brand-accent transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-6">
          <h2 className="text-3xl font-bold text-brand-dark tracking-tight">{user.displayName || 'Interior Enthusiast'}</h2>
          <p className="text-stone-500 flex items-center justify-center gap-2 mt-1">
            <Mail className="w-4 h-4" />
            {user.email}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-lg">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="flex justify-center">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-primary" />
            Account Security
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-stone-50">
              <span className="text-stone-600">Email Verified</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {user.emailVerified ? 'YES' : 'NO'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-50">
              <span className="text-stone-600">Plan</span>
              <span className="text-brand-accent font-bold uppercase text-xs">Free Tier</span>
            </div>
          </div>
          <button className="text-brand-primary font-bold text-sm hover:underline">Manage Password</button>
        </div>

        <div className="bg-stone-900 p-8 rounded-[2rem] shadow-xl text-white space-y-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">InteriorVista Pro</h3>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Unlock unlimited AI suggestions, 4K exports, and priority support.
            </p>
            <button className="w-full bg-brand-accent text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all">
              Upgrade Now
            </button>
          </div>
          <Settings className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 rotate-45" />
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Sign Out of Account
      </button>
    </div>
  );
}
