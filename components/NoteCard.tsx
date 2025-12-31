
import React from 'react';
import { Note } from '../types';
import { COLOR_THEMES } from '../utils';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onArchive: (id: string, currentStatus: boolean) => void;
  onPin: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onArchive, onPin, onDelete }) => {
  const theme = COLOR_THEMES[note.color];

  return (
    <div 
      className={`group relative p-4 rounded-xl border transition-all duration-200 break-inside-avoid mb-4 ${theme.bg} ${theme.border} ${theme.hover} hover:border-gray-400`}
    >
      {/* Selection Checkmark Overlay (Hidden by default, could be added later) */}
      
      {/* Pin Button - Visible on Hover or if pinned */}
      <button 
        onClick={(e) => { e.stopPropagation(); onPin(note.id, note.isPinned); }}
        className={`absolute top-2 right-2 p-2 rounded-full transition-opacity ${
          note.isPinned ? 'opacity-100 text-gray-800 bg-black/5' : 'opacity-0 group-hover:opacity-100 text-gray-500 hover:bg-black/10'
        }`}
        title={note.isPinned ? "Unpin note" : "Pin note"}
      >
         <svg className={`w-5 h-5 ${note.isPinned ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
      </button>

      <div onClick={() => onEdit(note)} className="cursor-pointer">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 pr-8 break-words">{note.title}</h3>
        <p className="text-gray-700 text-sm whitespace-pre-wrap break-words line-clamp-[10]">{note.content}</p>
        
        <div className="mt-4 flex flex-wrap gap-1">
          {note.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-black/5 text-gray-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <span className="text-xs text-gray-400 font-medium px-2 py-1 uppercase">{note.category}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onArchive(note.id, note.isArchived); }}
            className="p-2 text-gray-500 hover:bg-black/10 rounded-full"
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="p-2 text-gray-500 hover:bg-black/10 rounded-full hover:text-red-600"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
