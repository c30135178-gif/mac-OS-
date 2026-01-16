
import React, { useState, useEffect } from 'react';
import { useOS } from './store/os-store';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import WindowFrame from './components/WindowFrame';
import SafariApp from './apps/SafariApp';
import NotesApp from './apps/NotesApp';
import TerminalApp from './apps/TerminalApp';
import CameraApp from './apps/CameraApp';
import SettingsApp from './apps/SettingsApp';
import FinderApp from './apps/FinderApp';
import Spotlight from './components/Spotlight';
import ControlCenter from './components/ControlCenter';
import StageManager from './components/StageManager';
import DesktopWidgets from './components/DesktopWidgets';
import ContextMenu from './components/ContextMenu';
import { motion, AnimatePresence } from 'framer-motion';

const LoginScreen: React.FC = () => {
  const { login } = useOS();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    const success = await login(password);
    setLoading(false);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center flex flex-col items-center justify-center overflow-hidden" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=2000&q=80")' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-all duration-1000" />
      
      <motion.div 
        animate={error ? { x: [-15, 15, -15, 15, 0] } : { scale: 1, opacity: 1 }}
        initial={{ scale: 0.9, opacity: 0 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative group mb-8">
            <img src="https://picsum.photos/id/64/200/200" className="w-40 h-40 rounded-full border-4 border-white/10 shadow-2xl transition-transform group-hover:scale-105" alt="Profile" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        </div>
        <h1 className="text-white text-3xl font-bold mb-10 drop-shadow-lg tracking-tight">Admin User</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <div className="relative">
            <input 
              autoFocus
              type="password"
              placeholder="Enter Password"
              className="w-72 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-4 focus:ring-blue-500/30 placeholder-white/40 backdrop-blur-md transition-all text-lg shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loading && (
                <div className="absolute right-4 top-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            )}
          </div>
          <div className="text-white/40 text-sm font-medium animate-pulse">Press Enter to Unlock</div>
          <div className="text-white/30 text-xs font-bold mt-2 uppercase tracking-widest">Password is admin</div>
        </form>
      </motion.div>

      <div className="absolute bottom-12 flex flex-col items-center gap-8">
        <div className="flex gap-14 text-white/70 text-sm font-semibold">
          <button className="flex flex-col items-center gap-3 hover:text-white transition-all group">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 mac-blur group-hover:bg-white/10 shadow-lg transition-colors">⏻</div>
            <span>Sleep</span>
          </button>
          <button className="flex flex-col items-center gap-3 hover:text-white transition-all group">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 mac-blur group-hover:bg-white/10 shadow-lg transition-colors">⟳</div>
            <span>Restart</span>
          </button>
          <button className="flex flex-col items-center gap-3 hover:text-white transition-all group">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 mac-blur group-hover:bg-white/10 shadow-lg transition-colors">☒</div>
            <span>Shut Down</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Desktop: React.FC = () => {
  const { user, fs, isStageManagerEnabled, createItem, updateWallpaper } = useOS();
  const desktopItems = fs.filter(f => f.parentId === '2');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-[1500ms]" 
        style={{ backgroundImage: `url("${user?.wallpaper}")` }}
        onContextMenu={handleContextMenu}
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      
      <MenuBar />
      <DesktopWidgets />
      
      <div className={`absolute inset-0 pt-14 pb-20 px-6 grid grid-flow-col grid-rows-[repeat(auto-fill,minmax(110px,1fr))] gap-x-6 gap-y-4 justify-end content-start w-fit ml-auto pointer-events-none transition-all duration-500`}>
        {desktopItems.map(item => (
          <div key={item.id} className="w-24 flex flex-col items-center gap-1 group pointer-events-auto cursor-default">
            <div className="w-[72px] h-[72px] flex items-center justify-center rounded-xl group-hover:bg-white/10 dark:group-hover:bg-white/10 transition-all group-active:scale-95">
               <img 
                    src={item.type === 'folder' ? "https://cdn-icons-png.flaticon.com/512/3767/3767084.png" : "https://cdn-icons-png.flaticon.com/512/2965/2965330.png"} 
                    className="w-14 h-14 drop-shadow-lg" 
                    alt="File" 
                />
            </div>
            <span className="text-[12px] text-white font-semibold text-center drop-shadow-lg leading-tight bg-black/10 px-2 py-0.5 group-hover:bg-blue-600 rounded-md transition-all select-none truncate w-full">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <StageManager />

      <div className={`relative h-full pt-7 z-[100] transition-all duration-500 ${isStageManagerEnabled ? 'pl-48' : ''}`}>
        <WindowFrame id="finder" title="Finder"><FinderApp /></WindowFrame>
        <WindowFrame id="safari" title="Safari"><SafariApp /></WindowFrame>
        <WindowFrame id="notes" title="Notes"><NotesApp /></WindowFrame>
        <WindowFrame id="terminal" title="Terminal"><TerminalApp /></WindowFrame>
        <WindowFrame id="camera" title="Camera"><CameraApp /></WindowFrame>
        <WindowFrame id="settings" title="Settings"><SettingsApp /></WindowFrame>
      </div>

      <Spotlight />
      <ControlCenter />
      <Dock />

      {contextMenu && (
        <ContextMenu 
            x={contextMenu.x} 
            y={contextMenu.y} 
            onClose={() => setContextMenu(null)}
            options={[
                { label: 'New Folder', onClick: () => createItem('New Folder', 'folder', '2') },
                { label: 'Get Info', onClick: () => {} },
                { label: 'Change Wallpaper...', onClick: () => {}, divider: true },
                { label: 'Use Stacks', onClick: () => {} },
                { label: 'Show View Options', onClick: () => {} },
            ]}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const { user, theme } = useOS();

  return (
    <div className={`w-full h-screen bg-black ${theme === 'dark' ? 'dark' : ''}`}>
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <LoginScreen />
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Desktop />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;