
import React, { useState } from 'react';
import { useOS } from '../store/os-store';
import { Plus, Trash2, Search } from 'lucide-react';

const NotesApp: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useOS();
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id || null);

  const selectedNote = notes.find(n => n.id === selectedId);

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 bg-gray-50/50 dark:bg-black/20">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold dark:text-white">Notes</h1>
          <button 
            onClick={() => addNote({ title: 'New Note' })}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            <Plus size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 flex items-center gap-2">
            <Search size={14} className="text-gray-400" />
            <input className="bg-transparent text-sm outline-none w-full" placeholder="Search" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={`px-4 py-3 cursor-default border-b border-gray-100 dark:border-gray-800 transition-colors ${selectedId === note.id ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className="font-semibold text-sm truncate dark:text-white">{note.title || 'Untitled'}</div>
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <span className="truncate ml-2">{note.content.substring(0, 20)}...</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-4 flex justify-end gap-4 border-b border-gray-200 dark:border-gray-800">
              <button 
                onClick={() => {
                  deleteNote(selectedNote.id);
                  setSelectedId(null);
                }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto">
              <input 
                className="w-full text-3xl font-bold bg-transparent outline-none mb-6 dark:text-white"
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                placeholder="Title"
              />
              <textarea 
                className="w-full h-[calc(100%-100px)] bg-transparent outline-none resize-none text-lg leading-relaxed dark:text-gray-200"
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                placeholder="Start typing..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select or create a note
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
