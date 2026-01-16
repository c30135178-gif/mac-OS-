
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../store/os-store';
import { Cloud, Clock as ClockIcon } from 'lucide-react';

const DesktopWidgets: React.FC = () => {
  const { widgets } = useOS();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none p-10 select-none">
      {widgets.map(w => {
        if (w.type === 'clock') {
          return (
            <motion.div 
              key={w.id}
              style={{ left: w.x, top: w.y }}
              className="absolute w-40 h-40 bg-white/10 dark:bg-black/10 mac-blur border border-white/10 rounded-[32px] p-6 flex flex-col justify-center pointer-events-auto"
            >
              <div className="text-3xl font-light text-white leading-none">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              <div className="text-xs font-bold text-white/60 uppercase mt-2 tracking-widest">
                {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <ClockIcon size={40} className="absolute -bottom-4 -right-4 text-white/5" />
            </motion.div>
          );
        }
        if (w.type === 'weather') {
          return (
            <motion.div 
              key={w.id}
              style={{ left: w.x, top: w.y }}
              className="absolute w-40 h-40 bg-white/10 dark:bg-black/10 mac-blur border border-white/10 rounded-[32px] p-6 flex flex-col pointer-events-auto"
            >
              <div className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Cupertino</div>
              <div className="text-4xl font-light text-white">72°</div>
              <div className="mt-auto flex items-center gap-2">
                <Cloud size={20} className="text-white" />
                <span className="text-xs text-white/80 font-medium">Mostly Cloudy</span>
              </div>
              <div className="text-[10px] text-white/50 mt-1">H:75° L:64°</div>
            </motion.div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default DesktopWidgets;
