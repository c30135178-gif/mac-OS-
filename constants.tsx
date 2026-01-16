
import React from 'react';
import { 
  Folder, 
  Globe, 
  FileText, 
  Terminal as TerminalIcon, 
  Settings as SettingsIcon, 
  Camera as CameraIcon,
  Trash2
} from 'lucide-react';
import { AppID } from './types';

export const APPS: { id: AppID; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'finder', name: 'Finder', icon: <Folder className="w-8 h-8 text-blue-500" />, color: 'bg-blue-500/10' },
  { id: 'safari', name: 'Safari', icon: <Globe className="w-8 h-8 text-blue-400" />, color: 'bg-blue-400/10' },
  { id: 'notes', name: 'Notes', icon: <FileText className="w-8 h-8 text-yellow-500" />, color: 'bg-yellow-500/10' },
  { id: 'terminal', name: 'Terminal', icon: <TerminalIcon className="w-8 h-8 text-gray-800" />, color: 'bg-gray-800/10' },
  { id: 'camera', name: 'Camera', icon: <CameraIcon className="w-8 h-8 text-gray-400" />, color: 'bg-gray-400/10' },
  { id: 'settings', name: 'Settings', icon: <SettingsIcon className="w-8 h-8 text-gray-500" />, color: 'bg-gray-500/10' },
  { id: 'trash', name: 'Trash', icon: <Trash2 className="w-8 h-8 text-gray-600" />, color: 'bg-gray-600/10' },
];

export const WALLPAPERS = [
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1541450805268-4822a3a774ce?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
];
