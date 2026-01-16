import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '../store/os-store';
import { AppID } from '../types';

interface WindowFrameProps {
  id: AppID;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ id, title, children, icon }) => {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, isStageManagerEnabled, activeApp } = useOS();
  const win = windows.find(w => w.id === id)!;
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const [size, setSize] = useState({ width: win.width, height: win.height });
  const isDragging = useRef(false);

  // In Stage Manager, if not active app, we hide it (sidebar handles it)
  const isStaged = isStageManagerEnabled && activeApp !== id && activeApp !== null;

  if (!win.isOpen || win.isMinimized || isStaged) return null;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: 0,
        width: win.isMaximized ? '100vw' : size.width,
        height: win.isMaximized ? 'calc(100vh - 28px)' : size.height,
        top: win.isMaximized ? 28 : pos.y,
        left: win.isMaximized ? 0 : pos.x,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      onMouseDown={() => focusWindow(id)}
      className={`fixed flex flex-col overflow-hidden bg-white/90 dark:bg-gray-900/90 mac-blur window-shadow border border-white/50 dark:border-white/10 rounded-xl z-[${win.zIndex}] ${win.isMaximized ? 'rounded-none border-none' : ''}`}
      style={{ zIndex: win.zIndex }}
    >
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center px-4 shrink-0 select-none cursor-default group bg-gradient-to-b from-white/20 to-transparent"
        onMouseDown={(e) => {
          if (win.isMaximized) return;
          isDragging.current = true;
          const startX = e.clientX - pos.x;
          const startY = e.clientY - pos.y;
          
          const onMouseMove = (moveE: MouseEvent) => {
            setPos({ x: moveE.clientX - startX, y: moveE.clientY - startY });
          };
          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            isDragging.current = false;
          };
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }}
      >
        <div className="flex gap-2 w-16">
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
            className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-[10px] font-bold text-transparent hover:text-black/60 shadow-inner"
          >×</button>
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
            className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center text-[14px] font-bold text-transparent hover:text-black/60 shadow-inner"
          >−</button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
            className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center text-[10px] font-bold text-transparent hover:text-black/60 shadow-inner"
          >⤢</button>
        </div>
        <div className="flex-1 text-center text-[13px] font-bold text-gray-800 dark:text-gray-100 opacity-90">
          {title}
        </div>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative">
        {children}
      </div>

      {/* Resize Handle */}
      {!win.isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 bg-transparent"
          onMouseDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = size.width;
            const startHeight = size.height;
            
            const onMouseMove = (moveE: MouseEvent) => {
              const newWidth = Math.max(400, startWidth + (moveE.clientX - startX));
              const newHeight = Math.max(300, startHeight + (moveE.clientY - startY));
              setSize({ width: newWidth, height: newHeight });
            };
            const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        />
      )}
    </motion.div>
  );
};

export default WindowFrame;