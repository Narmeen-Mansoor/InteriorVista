import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layout, Palette, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <section className="text-center space-y-10 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold rounded-full mb-8 uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            Visonary Design AI
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-indigo-400">Environment</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mt-8 font-medium leading-relaxed">
            Harnessing advanced spatial analysis to refine your interior aesthetic. Professional-grade styling, instant visualization.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-5"
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-black hover:shadow-2xl hover:shadow-slate-300 transition-all active:scale-95"
          >
            Open Creative Studio <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
          <Link
            to="/chat"
            className="flex items-center gap-2 bg-white border-2 border-slate-100 text-slate-800 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm"
          >
            Consult AI Expert
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-10 mb-24">
        {[
          { 
            icon: Sparkles, 
            title: "Spatial Intelligence", 
            text: "Context-aware object detection that respects your room's structural integrity.",
            iconColor: "text-indigo-600"
          },
          { 
            icon: Palette, 
            title: "Color Theory v4", 
            text: "Deep learning generated palettes optimized for lighting and material texture.",
            iconColor: "text-rose-600"
          },
          { 
            icon: Layout, 
            title: "Logic-Based Flow", 
            text: "Space planning that prioritizes ergonomics and natural movement paths.",
            iconColor: "text-blue-600"
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-slate-50 group-hover:bg-indigo-50 transition-colors", feature.iconColor)}>
              <feature.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{feature.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900 text-white p-16 rounded-[4rem] text-center space-y-8 relative overflow-hidden shadow-3xl shadow-slate-200">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Zap className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Ready to stabilize your vision?</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Deploy the most advanced design logic to your home. Join over 50,000 professional designers and homeowners.
          </p>
          <div className="flex justify-center flex-wrap gap-12 py-10 opacity-40">
            <span className="font-extrabold tracking-[0.4em] uppercase text-xs">Architectural Digest</span>
            <span className="font-extrabold tracking-[0.4em] uppercase text-xs">Hypebeast</span>
            <span className="font-extrabold tracking-[0.4em] uppercase text-xs">DesignMilk</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// Utility function to merge classes
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
