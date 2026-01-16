
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { useOS } from '../store/os-store';
import { APPS } from '../constants';
import { Download, Trash2, Folder } from 'lucide-react';

const DockItem = ({ app, mouseX, onClick, isOpen }: { app: any; mouseX: MotionValue; onClick: () => void; isOpen: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [48, 80, 48]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative flex flex-col items-center group">
      <motion.div
        ref={ref}
        style={{ width, height }}
        onClick={onClick}
        className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ${app.color} shadow-lg overflow-visible cursor-default active:brightness-90 active:scale-95`}
      >
        <div className="relative z-10 scale-110">{app.icon}</div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none rounded-2xl" />
      </motion.div>

      <div className={`w-1 h-1 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.4)] mt-1.5 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

      <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/40 mac-blur text-white text-[13px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-xl z-50">
        {app.name}
      </div>
    </div>
  );
};

const DownloadsStack = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fs, openWindow } = useOS();
  const downloads = fs.filter(f => f.parentId === '5');

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center cursor-default group"
      >
        <div className="relative">
          <div className="absolute inset-0 blur-md bg-blue-500/20 group-hover:bg-blue-500/40" />
          <Download size={24} className="text-white relative z-10" />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: -20 }}
              exit={{ opacity: 0, scale: 0.5, y: 100 }}
              className="absolute bottom-16 right-0 w-64 bg-white/70 dark:bg-gray-900/80 mac-blur border border-white/20 rounded-2xl shadow-2xl p-4 z-50 origin-bottom-right"
            >
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Download size={12} /> Downloads
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {downloads.length > 0 ? downloads.map(file => (
                  <div key={file.id} className="flex items-center gap-3 p-2 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-default group">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center shrink-0">
                      <Folder size={16} className="text-blue-400 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium truncate">{file.name}</span>
                  </div>
                )) : (
                  <div className="text-center py-4 text-xs text-gray-400 italic">No recent downloads</div>
                )}
              </div>
              <div 
                onClick={() => { openWindow('finder'); setIsOpen(false); }}
                className="mt-3 pt-3 border-t border-white/10 text-center text-xs font-bold text-blue-500 hover:text-blue-400 cursor-pointer"
              >
                Open in Finder
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrashItem = () => {
  return (
    <div className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center cursor-default group">
      <Trash2 size={24} className="text-gray-400 group-hover:text-white transition-colors" />
    </div>
  );
};

const Dock: React.FC = () => {
  const { openWindow, windows } = useOS();
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[1000] perspective-1000">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 px-4 py-2 bg-black/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[24px] mac-blur shadow-2xl relative"
      >
        {APPS.filter(a => a.id !== 'trash').map((app, index) => {
          const win = windows.find(w => w.id === app.id);
          const isOpen = !!win?.isOpen;
          
          return (
            <React.Fragment key={app.id}>
              <DockItem 
                app={app} 
                mouseX={mouseX} 
                onClick={() => openWindow(app.id)} 
                isOpen={isOpen}
              />
              {index === APPS.length - 3 && (
                <div className="w-[1px] h-10 bg-white/20 dark:bg-white/10 mx-1 self-center" />
              )}
            </React.Fragment>
          );
        })}
        <DownloadsStack />
        <TrashItem />
      </motion.div>
    </div>
  );
};

export default Dock;
