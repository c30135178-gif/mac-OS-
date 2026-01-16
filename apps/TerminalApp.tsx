
import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../store/os-store';

const TerminalApp: React.FC = () => {
  const { fs, user } = useOS();
  const [history, setHistory] = useState<{ type: 'input' | 'output'; content: string }[]>([
    { type: 'output', content: 'Last login: ' + new Date().toString() },
    { type: 'output', content: 'Type "help" for a list of commands.' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentDir, setCurrentDir] = useState('~');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = currentInput.trim().toLowerCase();
    const parts = cmd.split(' ');
    
    setHistory(prev => [...prev, { type: 'input', content: `${currentDir} % ${currentInput}` }]);
    
    switch (parts[0]) {
      case 'ls':
        const files = fs.map(f => f.name).join('  ');
        setHistory(prev => [...prev, { type: 'output', content: files || 'No files found.' }]);
        break;
      case 'whoami':
        setHistory(prev => [...prev, { type: 'output', content: user?.username || 'user' }]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'date':
        setHistory(prev => [...prev, { type: 'output', content: new Date().toString() }]);
        break;
      case 'help':
        setHistory(prev => [...prev, { type: 'output', content: 'Available commands: ls, whoami, clear, date, echo, help' }]);
        break;
      case 'echo':
        setHistory(prev => [...prev, { type: 'output', content: parts.slice(1).join(' ') }]);
        break;
      case '':
        break;
      default:
        setHistory(prev => [...prev, { type: 'output', content: `zsh: command not found: ${parts[0]}` }]);
    }
    
    setCurrentInput('');
  };

  return (
    <div 
      className="h-full bg-[#1e1e1e] text-white p-4 font-mono text-sm overflow-y-auto cursor-text"
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className={`whitespace-pre-wrap mb-1 ${line.type === 'input' ? 'text-green-400' : 'text-gray-200'}`}>
          {line.content}
        </div>
      ))}
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-green-400 shrink-0">{currentDir} %</span>
        <input 
          id="term-input"
          autoFocus
          className="bg-transparent border-none outline-none flex-1 text-white"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalApp;
