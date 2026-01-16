
import React, { useState, useEffect } from 'react';
import { useOS } from '../store/os-store';
import { Apple, Wifi, Battery, Search, List, Settings } from 'lucide-react';

const MenuBar: React.FC = () => {
  const { activeApp, logout, toggleSpotlight, toggleControlCenter } = useOS();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-7 w-full fixed top-0 left-0 flex items-center justify-between px-4 text-[13px] font-semibold text-white/90 bg-black/5 dark:bg-black/20 mac-blur border-b border-white/10 z-[1000] select-none shadow-sm">
      <div className="flex items-center gap-1 h-full">
        <div className="hover:bg-white/20 px-3 rounded-md cursor-default h-[85%] flex items-center group relative transition-colors">
          <Apple size={16} fill="white" className="drop-shadow-sm" />
          <div className="hidden group-hover:block absolute top-7 left-0 w-56 bg-gray-900/80 border border-white/10 rounded-xl py-1 shadow-2xl mac-blur z-[1001] p-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="px-3 py-1.5 hover:bg-blue-600 rounded-md transition-colors">About This Mac</div>
            <div className="h-px bg-white/10 my-1 mx-2"></div>
            <div className="px-3 py-1.5 hover:bg-blue-600 rounded-md transition-colors">System Settings...</div>
            <div className="px-3 py-1.5 hover:bg-blue-600 rounded-md transition-colors">App Store...</div>
            <div className="h-px bg-white/10 my-1 mx-2"></div>
            <div className="px-3 py-1.5 hover:bg-blue-600 rounded-md transition-colors flex justify-between items-center">
                Force Quit... <span className="text-[10px] opacity-60">⌥⌘⎋</span>
            </div>
            <div className="h-px bg-white/10 my-1 mx-2"></div>
            <div className="px-3 py-1.5 hover:bg-blue-600 rounded-md transition-colors">Sleep</div>
            <div className="px-3 py-1.5 hover:bg-blue-600 rounded-md transition-colors">Restart...</div>
            <div className="px-3 py-1.5 hover:bg-blue-600 rounded-md transition-colors">Shut Down...</div>
            <div className="h-px bg-white/10 my-1 mx-2"></div>
            <div onClick={logout} className="px-3 py-1.5 hover:bg-blue-600 rounded-md cursor-pointer transition-colors">Lock Screen <span className="text-[10px] opacity-60 ml-auto">^⌘Q</span></div>
            <div onClick={logout} className="px-3 py-1.5 hover:bg-blue-600 rounded-md cursor-pointer transition-colors">Log Out...</div>
          </div>
        </div>
        
        <span className="font-bold tracking-tight hover:bg-white/20 px-3 rounded-md h-[85%] flex items-center transition-colors">
          {activeApp ? activeApp.charAt(0).toUpperCase() + activeApp.slice(1) : 'Finder'}
        </span>

        {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map(item => (
          <span key={item} className="hidden md:flex hover:bg-white/20 px-3 rounded-md cursor-default h-[85%] items-center transition-colors font-medium">
            {item}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1 h-full">
        <div className="flex items-center gap-3 h-full px-2">
            <div className="hover:bg-white/20 px-1 rounded transition-colors"><Wifi size={16} strokeWidth={2.5} /></div>
            <div className="hover:bg-white/20 px-1 rounded transition-colors"><Battery size={16} strokeWidth={2.5} className="rotate-90" /></div>
            <div onClick={() => toggleSpotlight()} className="hover:bg-white/20 px-1 rounded transition-colors cursor-default"><Search size={16} strokeWidth={2.5} /></div>
            <div onClick={() => toggleControlCenter()} className="hover:bg-white/20 px-1 rounded transition-colors cursor-default"><List size={16} strokeWidth={2.5} /></div>
        </div>
        <div className="hover:bg-white/20 px-3 rounded-md h-[85%] flex items-center transition-colors font-medium">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
