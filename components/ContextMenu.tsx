
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: { label: string; onClick: () => void; divider?: boolean }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, options }) => {
  useEffect(() => {
    const handleGlobalClick = () => onClose();
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed z-[9999] w-56 bg-white/70 dark:bg-gray-800/80 mac-blur border border-white/20 rounded-xl shadow-2xl py-1 px-1 overflow-hidden"
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {options.map((opt, i) => (
        <React.Fragment key={i}>
          {opt.divider && <div className="h-px bg-black/10 dark:bg-white/10 my-1 mx-2" />}
          <div
            onClick={opt.onClick}
            className="px-3 py-1.5 hover:bg-blue-600 hover:text-white rounded-md transition-colors cursor-default text-[13px] font-medium text-gray-800 dark:text-gray-100 flex justify-between"
          >
            {opt.label}
          </div>
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default ContextMenu;
