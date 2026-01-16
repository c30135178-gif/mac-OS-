
import React from 'react';
import { useOS } from '../store/os-store';
import { WALLPAPERS } from '../constants';
import { User, Image as ImageIcon, Monitor, ShieldCheck, HardDrive, Moon, Sun } from 'lucide-react';

const SettingsApp: React.FC = () => {
  const { user, updateWallpaper, theme, setTheme } = useOS();

  const sections = [
    { name: 'Apple ID', icon: <User size={18} className="text-blue-500" />, id: 'account' },
    { name: 'Appearance', icon: <Monitor size={18} className="text-gray-400" />, id: 'appearance' },
    { name: 'Wallpaper', icon: <ImageIcon size={18} className="text-pink-500" />, id: 'wallpaper' },
    { name: 'Security & Privacy', icon: <ShieldCheck size={18} className="text-blue-600" />, id: 'security' },
    { name: 'Storage', icon: <HardDrive size={18} className="text-orange-500" />, id: 'storage' },
  ];

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-950">
      <div className="w-64 border-r border-black/10 dark:border-white/10 p-4 shrink-0 bg-gray-200/40 dark:bg-black/40">
        <div className="text-xs font-bold text-gray-500 uppercase mb-4 px-2">Settings</div>
        {sections.map(s => (
          <div key={s.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-default mb-1 transition-colors ${s.id === 'appearance' ? 'bg-blue-600 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 dark:text-gray-200'}`}>
            {s.icon}
            <span className="text-sm font-medium">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8 dark:text-white">Appearance</h1>
        
        <div className="flex gap-8 mb-12">
            <div onClick={() => setTheme('light')} className={`flex flex-col items-center gap-3 cursor-pointer group`}>
                <div className={`w-32 h-20 rounded-lg border-4 transition-all ${theme === 'light' ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-gray-200 dark:border-gray-800'}`}>
                    <div className="w-full h-full bg-gray-100 flex flex-col p-2 gap-1">
                        <div className="w-full h-2 bg-gray-300 rounded" />
                        <div className="w-1/2 h-2 bg-gray-300 rounded" />
                    </div>
                </div>
                <span className={`text-sm font-medium dark:text-white ${theme === 'light' ? 'text-blue-500' : ''}`}>Light</span>
            </div>
            <div onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-3 cursor-pointer group`}>
                <div className={`w-32 h-20 rounded-lg border-4 transition-all ${theme === 'dark' ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-gray-200 dark:border-gray-800'}`}>
                    <div className="w-full h-full bg-gray-900 flex flex-col p-2 gap-1">
                        <div className="w-full h-2 bg-gray-700 rounded" />
                        <div className="w-1/2 h-2 bg-gray-700 rounded" />
                    </div>
                </div>
                <span className={`text-sm font-medium dark:text-white ${theme === 'dark' ? 'text-blue-500' : ''}`}>Dark</span>
            </div>
        </div>

        <h2 className="text-xl font-bold mb-6 dark:text-white">Desktop Wallpaper</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {WALLPAPERS.map((wp, idx) => (
            <div 
              key={idx}
              onClick={() => updateWallpaper(wp)}
              className={`group relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${user?.wallpaper === wp ? 'border-blue-500 scale-[1.02]' : 'border-transparent'}`}
            >
              <img src={wp} alt="Wallpaper" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold px-3 py-1 bg-white/20 mac-blur rounded-full">Apply</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-4">
            <img src={user?.avatar} className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-800 shadow-md" alt="Avatar" />
            <div>
              <h3 className="text-lg font-bold dark:text-white">{user?.username}</h3>
              <p className="text-sm text-gray-500">Standard User • macOS Virtual Experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
