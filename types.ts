
export type AppID = 'finder' | 'safari' | 'notes' | 'terminal' | 'settings' | 'camera' | 'trash';

export interface WindowState {
  id: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  width: number;
  height: number;
  x: number;
  y: number;
  stageGroup?: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  wallpaper: string;
  theme: 'light' | 'dark';
  accentColor: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string;
  icon?: string;
}

export interface Widget {
  id: string;
  type: 'clock' | 'weather' | 'notes' | 'calendar';
  x: number;
  y: number;
}
