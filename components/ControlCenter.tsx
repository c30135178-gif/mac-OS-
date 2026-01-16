
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Bluetooth, Airplay, Moon, Sun, Volume2, Monitor, Play, SkipForward, SkipBack } from 'lucide-react';
import { useOS } from '../store/os-store';

const ControlCenter: React.FC = () => {
  const { isControlCenterOpen, toggleControlCenter, isStageManagerEnabled, toggleStageManager } = useOS();

  if (!isControlCenterOpen) return null;

  return (
    <div className="fixed inset-0 z-[1500]" onClick={() => toggleControlCenter(false)}>
      <motion.div
        initial={{ y: -20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-9 right-4 w-80 bg-white/70 dark:bg-gray-900/70 mac-blur border border-white/30 dark:border-gray-700/50 rounded-[24px] shadow-2xl p-3 grid grid-cols-2 gap-3"
      >
        {/* Connectivity */}
        <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-3 flex flex-col gap-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><Wifi size={16} /></div>
            <div className="flex flex-col"><span className="text-[12px] font-bold dark:text-white">Wi-Fi</span><span className="text-[10px] opacity-60 dark:text-white">Home-Network</span></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><Bluetooth size={16} /></div>
            <div className="flex flex-col"><span className="text-[12px] font-bold dark:text-white">Bluetooth</span><span className="text-[10px] opacity-60 dark:text-white">On</span></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><Airplay size={16} /></div>
            <div className="flex flex-col"><span className="text-[12px] font-bold dark:text-white">AirDrop</span><span className="text-[10px] opacity-60 dark:text-white">Contacts Only</span></div>
          </div>
        </div>

        {/* Focus & Stage Manager */}
        <div className="flex flex-col gap-3">
          <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-3 flex items-center gap-3 border border-white/10 flex-1">
            <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center dark:text-white"><Moon size={16} /></div>
            <span className="text-[12px] font-bold dark:text-white">Focus</span>
          </div>
          <div 
            onClick={toggleStageManager}
            className={`bg-white/40 dark:bg-black/20 rounded-2xl p-3 flex items-center gap-3 border border-white/10 flex-1 cursor-pointer transition-colors ${isStageManagerEnabled ? 'bg-blue-500/20' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isStageManagerEnabled ? 'bg-blue-500 text-white' : 'bg-white/10 dark:bg-white/5 dark:text-white'}`}><Monitor size={16} /></div>
            <span className="text-[12px] font-bold dark:text-white">Stage Manager</span>
          </div>
        </div>

        {/* Display & Volume */}
        <div className="col-span-2 bg-white/40 dark:bg-black/20 rounded-2xl p-4 border border-white/10 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center"><span className="text-[12px] font-bold dark:text-white">Display</span><Sun size={14} className="opacity-60" /></div>
            <div className="h-6 bg-white/20 dark:bg-black/40 rounded-full w-full relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-white/60 dark:bg-white/80 w-3/4" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center"><span className="text-[12px] font-bold dark:text-white">Sound</span><Volume2 size={14} className="opacity-60" /></div>
            <div className="h-6 bg-white/20 dark:bg-black/40 rounded-full w-full relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-white/60 dark:bg-white/80 w-1/2" />
            </div>
          </div>
        </div>

        {/* Music Mini Player */}
        <div className="col-span-2 bg-white/40 dark:bg-black/20 rounded-2xl p-4 border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400" />
          <div className="flex-1 overflow-hidden">
            <div className="text-[12px] font-bold dark:text-white truncate">Now Playing</div>
            <div className="text-[10px] opacity-60 dark:text-white truncate">macOS Simulation Soundtrack</div>
          </div>
          <div className="flex items-center gap-3 text-gray-800 dark:text-white">
            <SkipBack size={16} />
            <Play size={18} fill="currentColor" />
            <SkipForward size={16} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ControlCenter;
