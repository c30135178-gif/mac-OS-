
import React, { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, ShieldCheck, Search } from 'lucide-react';

const SafariApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com/search?igu=1');
  const [input, setInput] = useState('https://google.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = input;
    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="h-12 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4 bg-gray-100 dark:bg-gray-900 shrink-0">
        <div className="flex items-center gap-4 text-gray-500">
          <ChevronLeft size={20} className="hover:text-gray-900 cursor-pointer" />
          <ChevronRight size={20} className="hover:text-gray-900 cursor-pointer" />
          <RotateCcw size={18} className="hover:text-gray-900 cursor-pointer" />
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md flex items-center px-3 py-1 gap-2 shadow-sm">
            <ShieldCheck size={14} className="text-green-500" />
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-center"
              placeholder="Search or enter website name"
            />
            <Search size={14} className="text-gray-400" />
          </div>
        </form>

        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="flex-1 bg-white">
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="browser-content"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default SafariApp;
