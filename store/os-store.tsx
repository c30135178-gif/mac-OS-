
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WindowState, User, AppID, Note, FileSystemItem, Widget } from '../types';
import { WALLPAPERS } from '../constants';

interface OSContextType {
  user: User | null;
  windows: WindowState[];
  activeApp: AppID | null;
  notes: Note[];
  fs: FileSystemItem[];
  widgets: Widget[];
  isSpotlightOpen: boolean;
  isControlCenterOpen: boolean;
  isStageManagerEnabled: boolean;
  theme: 'light' | 'dark';
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  openWindow: (id: AppID) => void;
  closeWindow: (id: AppID) => void;
  minimizeWindow: (id: AppID) => void;
  focusWindow: (id: AppID) => void;
  maximizeWindow: (id: AppID) => void;
  toggleSpotlight: (show?: boolean) => void;
  toggleControlCenter: (show?: boolean) => void;
  toggleStageManager: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateWallpaper: (url: string) => void;
  addNote: (note: Partial<Note>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  createItem: (name: string, type: 'file' | 'folder', parentId: string | null) => void;
  deleteFsItem: (id: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const INITIAL_WINDOWS: WindowState[] = [
  { id: 'finder', title: 'Finder', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, width: 800, height: 500, x: 250, y: 100 },
  { id: 'safari', title: 'Safari', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, width: 1000, height: 650, x: 150, y: 50 },
  { id: 'notes', title: 'Notes', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, width: 700, height: 450, x: 200, y: 150 },
  { id: 'terminal', title: 'Terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, width: 700, height: 450, x: 300, y: 200 },
  { id: 'camera', title: 'Camera', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, width: 640, height: 480, x: 400, y: 100 },
  { id: 'settings', title: 'Settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, width: 800, height: 550, x: 250, y: 80 },
];

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [activeApp, setActiveApp] = useState<AppID | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [fs, setFs] = useState<FileSystemItem[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'w1', type: 'clock', x: 20, y: 40 },
    { id: 'w2', type: 'weather', x: 20, y: 210 }
  ]);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isStageManagerEnabled, setIsStageManagerEnabled] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [maxZ, setMaxZ] = useState(10);

  useEffect(() => {
    const savedUser = localStorage.getItem('mac_user');
    const savedNotes = localStorage.getItem('mac_notes');
    const savedFs = localStorage.getItem('mac_fs');
    const savedTheme = localStorage.getItem('mac_theme') as 'light' | 'dark';
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedTheme) setThemeState(savedTheme);
    if (savedFs) setFs(JSON.parse(savedFs));
    else {
      const initialFs: FileSystemItem[] = [
        { id: '1', name: 'Documents', type: 'folder', parentId: null },
        { id: '2', name: 'Desktop', type: 'folder', parentId: null },
        { id: '3', name: 'Welcome.txt', type: 'file', parentId: '2', content: 'Welcome to the macOS Web Simulator!' },
        { id: '4', name: 'Project X', type: 'folder', parentId: '2' },
        { id: '5', name: 'Downloads', type: 'folder', parentId: null },
        { id: '6', name: 'Applications', type: 'folder', parentId: null },
      ];
      setFs(initialFs);
      localStorage.setItem('mac_fs', JSON.stringify(initialFs));
    }
  }, []);

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('mac_theme', t);
  };

  const login = async (password: string): Promise<boolean> => {
    if (password === 'admin') {
      const newUser: User = {
        id: '1',
        username: 'Admin User',
        avatar: 'https://picsum.photos/id/64/200/200',
        wallpaper: WALLPAPERS[0],
        theme: 'dark',
        accentColor: 'blue'
      };
      setUser(newUser);
      localStorage.setItem('mac_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mac_user');
    setWindows(INITIAL_WINDOWS);
  };

  const focusWindow = useCallback((id: AppID) => {
    setWindows(prev => {
      const newZ = maxZ + 1;
      setMaxZ(newZ);
      setActiveApp(id);
      setIsSpotlightOpen(false);
      setIsControlCenterOpen(false);
      return prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w);
    });
  }, [maxZ]);

  const openWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false } : w));
    focusWindow(id);
  };

  const closeWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
    if (activeApp === id) setActiveApp(null);
  };

  const minimizeWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeApp === id) setActiveApp(null);
  };

  const maximizeWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const createItem = (name: string, type: 'file' | 'folder', parentId: string | null) => {
    const newItem: FileSystemItem = {
      id: Math.random().toString(36).substring(7),
      name,
      type,
      parentId,
      content: type === 'file' ? '' : undefined
    };
    const newFs = [...fs, newItem];
    setFs(newFs);
    localStorage.setItem('mac_fs', JSON.stringify(newFs));
  };

  const deleteFsItem = (id: string) => {
    const newFs = fs.filter(item => item.id !== id);
    setFs(newFs);
    localStorage.setItem('mac_fs', JSON.stringify(newFs));
  };

  const toggleSpotlight = (show?: boolean) => setIsSpotlightOpen(show ?? !isSpotlightOpen);
  const toggleControlCenter = (show?: boolean) => setIsControlCenterOpen(show ?? !isControlCenterOpen);
  const toggleStageManager = () => setIsStageManagerEnabled(!isStageManagerEnabled);

  const updateWallpaper = (url: string) => {
    if (user) {
      const newUser = { ...user, wallpaper: url };
      setUser(newUser);
      localStorage.setItem('mac_user', JSON.stringify(newUser));
    }
  };

  const addNote = (note: Partial<Note>) => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: note.title || 'Untitled',
      content: note.content || '',
      updatedAt: Date.now(),
    };
    const newNotes = [newNote, ...notes];
    setNotes(newNotes);
    localStorage.setItem('mac_notes', JSON.stringify(newNotes));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const newNotes = notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n);
    setNotes(newNotes);
    localStorage.setItem('mac_notes', JSON.stringify(newNotes));
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    localStorage.setItem('mac_notes', JSON.stringify(newNotes));
  };

  return (
    <OSContext.Provider value={{
      user, windows, activeApp, notes, fs, widgets, isSpotlightOpen, isControlCenterOpen, isStageManagerEnabled, theme,
      login, logout, openWindow, closeWindow, minimizeWindow, focusWindow, maximizeWindow, setTheme,
      toggleSpotlight, toggleControlCenter, toggleStageManager, updateWallpaper, addNote, updateNote, deleteNote, createItem, deleteFsItem
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within OSProvider');
  return context;
};
