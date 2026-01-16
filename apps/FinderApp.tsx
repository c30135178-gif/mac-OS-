
import React, { useState, useMemo } from 'react';
import { useOS } from '../store/os-store';
import { Folder, FileText, ChevronLeft, ChevronRight, Search, List, Grid, MoreHorizontal, FileIcon } from 'lucide-react';
import ContextMenu from '../components/ContextMenu';

const FinderApp: React.FC = () => {
  const { fs, createItem, deleteFsItem } = useOS();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [history, setHistory] = useState<(string | null)[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFolder = useMemo(() => 
    currentFolderId ? fs.find(f => f.id === currentFolderId) : null
  , [currentFolderId, fs]);

  const filteredFs = useMemo(() => {
    const base = fs.filter(item => item.parentId === currentFolderId);
    if (!searchQuery) return base;
    return base.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [fs, currentFolderId, searchQuery]);

  const navigateTo = (id: string | null) => {
    setHistory(prev => [...prev, currentFolderId]);
    setCurrentFolderId(id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const getFileIcon = (item: any) => {
    if (item.type === 'folder') return <Folder size={48} className="text-blue-500 fill-blue-500/30 drop-shadow-sm" />;
    if (item.name.endsWith('.txt')) return <FileText size={48} className="text-gray-400 drop-shadow-sm" />;
    return <FileIcon size={48} className="text-gray-300 drop-shadow-sm" />;
  };

  return (
    <div className="flex h-full bg-white/50 dark:bg-gray-950/20" onContextMenu={handleContextMenu}>
      {/* Sidebar */}
      <div className="w-48 bg-gray-200/40 dark:bg-black/40 border-r border-black/10 dark:border-white/10 p-4 shrink-0 overflow-y-auto">
        <div className="text-[11px] font-bold text-gray-500 uppercase mb-4 px-2 opacity-60">Favorites</div>
        <div className="space-y-0.5">
          {[
            { name: 'Applications', id: '6' },
            { name: 'Desktop', id: '2' },
            { name: 'Documents', id: '1' },
            { name: 'Downloads', id: '5' }
          ].map(item => (
            <div 
              key={item.id} 
              onClick={() => setCurrentFolderId(item.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-default transition-all ${currentFolderId === item.id ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-800 dark:text-gray-300'}`}
            >
              <Folder size={16} className={currentFolderId === item.id ? 'text-white' : 'text-blue-500 fill-blue-500/20'} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-12 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 shrink-0 bg-white/30 dark:bg-black/20 mac-blur">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <button 
                disabled={history.length === 0}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md disabled:opacity-20"
                onClick={() => {
                  if (history.length > 0) {
                    const prev = history[history.length - 1];
                    setHistory(history.slice(0, -1));
                    setCurrentFolderId(prev);
                  }
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button className="p-1 opacity-20"><ChevronRight size={20} /></button>
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
              {currentFolder ? currentFolder.name : 'Macintosh HD'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-200 dark:bg-gray-800 rounded p-0.5">
              <button className="p-1 bg-white dark:bg-gray-700 shadow-sm rounded transition-colors"><Grid size={14} /></button>
              <button className="p-1 rounded opacity-50 hover:opacity-100"><List size={14} /></button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 flex items-center gap-2 shadow-inner focus-within:ring-2 ring-blue-500/20 transition-all">
              <Search size={14} className="text-gray-400" />
              <input 
                className="bg-transparent text-xs outline-none w-24 md:w-32 lg:w-48" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-gray-500">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 content-start overflow-y-auto bg-white/30 dark:bg-black/10">
          {filteredFs.map(item => (
            <div 
              key={item.id} 
              className="flex flex-col items-center gap-2 group cursor-default"
              onDoubleClick={() => {
                if (item.type === 'folder') navigateTo(item.id);
                // For files, we could open them in a dedicated app or preview
              }}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-xl group-hover:bg-blue-500/10 dark:group-hover:bg-white/10 transition-all group-active:scale-95 relative">
                {getFileIcon(item)}
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none" />
              </div>
              <span className="text-[12px] font-medium text-center text-gray-800 dark:text-gray-200 bg-transparent px-2 group-hover:bg-blue-600 group-hover:text-white rounded transition-all truncate w-24 shadow-sm group-hover:shadow-md">
                {item.name}
              </span>
            </div>
          ))}
          
          {filteredFs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-400/50 py-24 select-none">
              <Folder size={80} strokeWidth={1} className="opacity-20 mb-4" />
              <p className="text-sm font-medium">Empty Folder</p>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5 flex items-center justify-center px-4 shrink-0">
          <span className="text-[10px] text-gray-500 font-medium">
            {filteredFs.length} items, 4.2 GB available
          </span>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)}
          options={[
            { label: 'New Folder', onClick: () => createItem('Untitled Folder', 'folder', currentFolderId) },
            { label: 'New Text File', onClick: () => createItem('New File.txt', 'file', currentFolderId) },
            { label: 'Get Info', onClick: () => {}, divider: true },
            { label: 'Clean Up', onClick: () => {} },
            { label: 'Sort By', onClick: () => {} },
            { label: 'Show View Options', onClick: () => {} },
          ]}
        />
      )}
    </div>
  );
};

export default FinderApp;
