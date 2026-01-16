
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AppWindow, File, Globe, Calculator, ArrowRight } from 'lucide-react';
import { useOS } from '../store/os-store';
import { APPS } from '../constants';

const Spotlight: React.FC = () => {
  const { isSpotlightOpen, toggleSpotlight, openWindow, fs } = useOS();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        toggleSpotlight();
      }
      if (e.key === 'Escape') {
        toggleSpotlight(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSpotlight]);

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSpotlightOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const list: any[] = [];

    // 1. Calculator Logic
    try {
      if (/^[0-9+\-*/().\s]+$/.test(query) && /[0-9]/.test(query)) {
        // Simple evaluation safely
        const res = eval(query);
        if (typeof res === 'number') {
          list.push({
            id: 'calc',
            type: 'calculator',
            name: `${query} = ${res}`,
            value: res,
            icon: <Calculator size={18} className="text-orange-500" />
          });
        }
      }
    } catch (e) {}

    // 2. Apps
    const appResults = APPS.filter(app => 
      app.name.toLowerCase().includes(query.toLowerCase())
    ).map(app => ({
      id: app.id,
      type: 'app',
      name: app.name,
      icon: <AppWindow size={18} className="text-blue-400" />
    }));
    list.push(...appResults);

    // 3. Files/Folders
    const fileResults = fs.filter(f => 
      f.name.toLowerCase().includes(query.toLowerCase())
    ).map(f => ({
      id: f.id,
      type: f.type === 'folder' ? 'folder' : 'file',
      name: f.name,
      icon: <File size={18} className={f.type === 'folder' ? "text-blue-400" : "text-gray-400"} />
    }));
    list.push(...fileResults);

    // 4. Web Search
    list.push({ 
      id: 'web', 
      type: 'web', 
      name: `Search Google for "${query}"`, 
      icon: <Globe size={18} className="text-green-400" /> 
    });

    return list.slice(0, 10);
  }, [query, fs]);

  const handleSelect = (result: any) => {
    if (result.type === 'app') {
      openWindow(result.id);
    } else if (result.type === 'folder' || result.type === 'file') {
      openWindow('finder');
      // In a more complex app, we'd navigate Finder to this file
    } else if (result.type === 'web') {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    } else if (result.type === 'calculator') {
      setQuery(result.value.toString());
      return;
    }
    toggleSpotlight(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  if (!isSpotlightOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={() => toggleSpotlight(false)} />
      <motion.div
        initial={{ scale: 1.05, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.05, opacity: 0, y: -20 }}
        className="w-[680px] bg-white/75 dark:bg-gray-900/80 mac-blur border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="p-4 flex items-center gap-4 border-b border-white/10">
          <Search size={24} className="text-gray-400" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-2xl text-gray-800 dark:text-white placeholder-gray-400 font-light"
            placeholder="Spotlight Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        
        {results.length > 0 && (
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {results.map((result, idx) => (
              <div
                key={`${result.type}-${result.id}-${idx}`}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => handleSelect(result)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-default transition-all ${idx === selectedIndex ? 'bg-blue-600 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${idx === selectedIndex ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'}`}>
                    {result.icon}
                </div>
                <div className="flex-1 flex flex-col">
                  <span className={`text-lg font-medium leading-none ${idx === selectedIndex ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                    {result.name}
                  </span>
                  {idx === selectedIndex && result.type === 'calculator' && (
                    <span className="text-xs text-white/70 mt-1 italic">Press Enter to copy result</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${idx === selectedIndex ? 'text-white/60' : 'text-gray-400'}`}>
                    {result.type}
                  </span>
                  {idx === selectedIndex && <ArrowRight size={14} className="opacity-60" />}
                </div>
              </div>
            ))}
          </div>
        )}

        {!query && (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50">
             <Search size={48} strokeWidth={1} />
             <p className="text-sm font-medium">Search for apps, files, or calculations</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Spotlight;
