import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Trash2, Calendar, Layout, Palette, ArrowUpRight, Loader2, BookmarkX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedDesigns() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, [user]);

  const fetchDesigns = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'designs'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedDesigns = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDesigns(fetchedDesigns);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this design?")) return;
    try {
      await deleteDoc(doc(db, 'designs', id));
      setDesigns(designs.filter(d => d.id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-dark">Saved Projects</h1>
        <p className="text-stone-500">Your collection of AI-inspired interior designs.</p>
      </div>

      {designs.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-stone-100">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
            <BookmarkX className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-stone-400">No saved designs yet</h3>
          <p className="text-stone-400 mt-2 mb-8">Start your first project in the dashboard!</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/dashboard'}
            className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2"
          >
            Go to Dashboard <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {designs.map((design, i) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
              >
                <div className="aspect-video relative overflow-hidden bg-stone-100">
                  {design.image ? (
                    <img src={design.image} alt="Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Layout className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-brand-dark shadow-sm uppercase tracking-wider">
                    {design.roomData.style}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-brand-dark">{design.roomData.roomType}</h4>
                      <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {design.createdAt?.toDate().toLocaleDateString() || 'Recently'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(design.id)}
                      className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {design.suggestions.wallColors.slice(0, 3).map((color, idx) => (
                      <div 
                        key={idx} 
                        className="w-6 h-6 rounded-full border border-stone-100" 
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-stone-500 line-clamp-2 italic leading-relaxed">
                    "{design.suggestions.explanation}"
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
