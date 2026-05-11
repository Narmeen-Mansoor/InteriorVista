import React, { useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon, CheckCircle, Save, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDesignSuggestions } from '../services/gemini';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Bathroom', 'Dining Room'];
const DESIGN_STYLES = ['Modern', 'Minimalist', 'Scandinavian', 'Luxury', 'Bohemian', 'Industrial', 'Traditional'];
const BUDGET_LEVELS = ['Economic', 'Standard', 'Premium', 'Ultra Luxury'];

export default function Dashboard() {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [roomData, setRoomData] = useState({
    roomType: 'Living Room',
    style: 'Modern',
    description: '',
    budget: 'Standard'
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!preview && !roomData.description) {
      alert("Please upload an image or provide a description.");
      return;
    }

    setLoading(true);
    setSuggestions(null);
    try {
      const result = await generateDesignSuggestions(roomData, preview);
      setSuggestions(result);
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI failed to generate suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDesign = async () => {
    if (!suggestions || !user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'designs'), {
        userId: user.uid,
        roomData,
        suggestions,
        image: preview, // Note: In production use Firebase Storage for images
        createdAt: serverTimestamp()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Workspace</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Creative Studio</h1>
          <p className="text-slate-500 font-medium">Refining your spatial identity with precision.</p>
        </div>
        {suggestions && (
          <div className="flex gap-3">
            <button
              onClick={() => { setSuggestions(null); setPreview(null); setImage(null); }}
              className="flex items-center gap-2 px-5 py-3 text-slate-400 hover:text-red-500 font-bold transition-colors text-sm"
            >
              <Trash2 className="w-5 h-5" /> Reset Studio
            </button>
            <button
              onClick={handleSaveDesign}
              disabled={isSaving}
              className={cn(
                "flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-xl",
                saveSuccess ? "bg-green-500 text-white" : "bg-slate-900 text-white hover:bg-black"
              )}
            >
              {saveSuccess ? <CheckCircle className="w-5 h-5" /> : (isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />)}
              {saveSuccess ? 'Archive Success' : 'Archive Project'}
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Original Canvas</label>
              <div 
                className={cn(
                  "relative aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                  preview ? "border-transparent" : "border-slate-200 bg-slate-50 hover:bg-indigo-50/30 hover:border-brand-primary"
                )}
                onClick={() => document.getElementById('room-image').click()}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <p className="text-white text-xs font-black uppercase tracking-widest">Update Source</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-500">IMPORT ROOM SOURCE</p>
                    <p className="text-[10px] text-slate-300 mt-2 uppercase tracking-tight">RAW DATA ONLY (JPG/PNG)</p>
                  </>
                )}
                <input id="room-image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            {/* Room Type */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Spatial Category</label>
              <select 
                value={roomData.roomType}
                onChange={(e) => setRoomData({ ...roomData, roomType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-brand-primary transition-all appearance-none"
              >
                {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* Design Style */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Aesthetic Direction</label>
              <div className="grid grid-cols-2 gap-3">
                {DESIGN_STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => setRoomData({ ...roomData, style })}
                    className={cn(
                      "py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-left border-2",
                      roomData.style === style 
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
                        : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Resource Allocation</label>
              <div className="grid grid-cols-2 gap-3">
                {BUDGET_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setRoomData({ ...roomData, budget: level })}
                    className={cn(
                      "py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-center border-2",
                      roomData.budget === level 
                        ? "bg-white text-brand-primary border-brand-primary" 
                        : "bg-slate-50 text-slate-400 border-slate-50 hover:bg-slate-100"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-brand-primary/30 transition-all active:scale-95 disabled:opacity-70 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
              {loading ? 'Synthesizing...' : 'Deploy Vision'}
            </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!suggestions && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[600px] bg-slate-100/30 border-2 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-slate-200">
                  <ImageIcon className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">Awaiting Input</h3>
                <p className="text-slate-400 mt-4 max-w-sm font-medium leading-relaxed">Please initialize the spatial parameters in the left panel to begin analysis.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[600px] bg-white rounded-[4rem] flex flex-col items-center justify-center text-center p-12 shadow-2xl shadow-slate-200/50"
              >
                <div className="relative mb-12">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-40 h-40 border-[6px] border-slate-50 border-t-brand-primary rounded-full shadow-inner"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-brand-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">AI Logic Processing</h3>
                <p className="text-slate-400 mt-4 max-w-sm font-medium leading-relaxed uppercase text-[10px] tracking-[0.3em]">Mapping Geometry • Sampling Textures • Applying Aesthetic Rules</p>
              </motion.div>
            )}

            {suggestions && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 pb-12"
              >
                {/* Result Header Stats */}
                <div className="bg-slate-900 text-white h-32 rounded-[3rem] shadow-3xl shadow-slate-200 overflow-hidden flex items-center px-12 gap-16 relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Layout className="w-32 h-32 rotate-45" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Processing Node</span>
                    <p className="text-xl font-bold mt-1 tracking-tight">Vision v.2.4</p>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Confidence Score</span>
                    <p className="text-xl font-bold mt-1 tracking-tight">98.4% Match</p>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Design Intensity</span>
                    <p className="text-xl font-bold mt-1 tracking-tight">Optimal Balance</p>
                  </div>
                </div>

                {/* Wall Colors Grid */}
                <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Chromatic Recommendations</h3>
                    <div className="h-0.5 flex-1 bg-slate-50 mx-6 opacity-30" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {suggestions.wallColors.map((color, i) => (
                      <div key={i} className="space-y-4 group">
                        <div 
                          className="h-32 w-full rounded-[2rem] shadow-inner border border-slate-100 transition-all group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-slate-200" 
                          style={{ backgroundColor: color.hex }} 
                        />
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{color.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold tracking-widest mt-0.5">{color.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid for items */}
                <div className="grid md:grid-cols-2 gap-8">
                  <InventoryBlock title="Structural Items" items={suggestions.furniture} index="01" />
                  <InventoryBlock title="Ambient Logic" items={suggestions.lighting} index="02" />
                  <InventoryBlock title="Surface Finishing" items={[...suggestions.flooring, ...suggestions.decor]} index="03" />
                  <InventoryBlock title="Spatial Refinement" items={suggestions.spaceOptimization} index="04" />
                </div>

                {/* Final Explanation */}
                <div className="bg-white p-12 rounded-[4rem] border-2 border-slate-900 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Thesis</h3>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight tracking-tighter">"{suggestions.explanation}"</p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-50/50 rounded-full group-hover:scale-110 transition-transform duration-1000" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function InventoryBlock({ title, items, index }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</h4>
        <div className="text-[10px] font-black text-slate-200 italic">{index}</div>
      </div>
      <ul className="space-y-5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 items-start translate-x-0 group-hover:translate-x-2 transition-transform">
            <div className="mt-2 w-8 h-1 bg-slate-100 rounded-full shrink-0 group-hover:bg-indigo-200 transition-colors" />
            <span className="text-slate-700 text-sm font-bold leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
