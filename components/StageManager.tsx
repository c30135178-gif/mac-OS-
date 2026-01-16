
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '../store/os-store';
import { APPS } from '../constants';

const StageManager: React.FC = () => {
  const { windows, isStageManagerEnabled, focusWindow, activeApp } = useOS();

  if (!isStageManagerEnabled) return null;

  // Find open windows that are NOT the active app
  const backgroundWindows = windows.filter(w => w.isOpen && !w.isMinimized && w.id !== activeApp);

  return (
    <div className="fixed left-4 top-14 bottom-24 w-40 z-[50] flex flex-col gap-8 justify-center pointer-events-none">
      <AnimatePresence>
        {backgroundWindows.map((win) => {
          const app = APPS.find(a => a.id === win.id);
          return (
            <motion.div
              key={win.id}
              initial={{ x: -100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -100, opacity: 0, scale: 0.8 }}
              whileHover={{ x: 10, scale: 1.05 }}
              onClick={() => focusWindow(win.id)}
              className="w-32 aspect-video bg-white/20 dark:bg-black/20 mac-blur rounded-xl border border-white/20 shadow-xl cursor-pointer pointer-events-auto relative group overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                 {app?.icon}
              </div>
              {/* Stack effect if multiple windows (simulated) */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default StageManager;
