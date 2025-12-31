
import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteColor } from '../types';
import { COLOR_THEMES, PRESET_CATEGORIES } from '../utils';

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  initialNote?: Note | null;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ isOpen, onClose, onSave, initialNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<NoteColor>('white');
  const [category, setCategory] = useState('Personal');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setColor(initialNote.color);
      setCategory(initialNote.category);
      setTags(initialNote.tags);
      setIsPinned(initialNote.isPinned);
    } else {
      // Reset for new note
      setTitle('');
      setContent('');
      setColor('white');
      setCategory('Personal');
      setTags([]);
      setIsPinned(false);
    }
  }, [initialNote, isOpen]);

  useEffect(() => {
    // Auto-resize textarea
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = contentRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      onClose();
      return;
    }
    
    onSave({
      id: initialNote?.id,
      title,
      content,
      color,
      category,
      tags,
      isPinned,
    });
    onClose();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleSave}>
      <div 
        className={`w-full max-w-2xl rounded-lg shadow-2xl transition-colors duration-300 max-h-[90vh] flex flex-col ${COLOR_THEMES[color].bg}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {/* Header / Pin */}
            <div className="flex justify-between items-start mb-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent text-xl font-bold placeholder-gray-500 text-gray-900 border-none focus:ring-0 p-0"
              />
              <button 
                onClick={() => setIsPinned(!isPinned)}
                className={`p-2 rounded-full hover:bg-black/10 transition-colors ${isPinned ? 'text-gray-900' : 'text-gray-400'}`}
              >
                 <svg className={`w-6 h-6 ${isPinned ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </button>
            </div>

            <textarea
              ref={contentRef}
              placeholder="Take a note..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-transparent text-gray-800 placeholder-gray-500 border-none focus:ring-0 p-0 resize-none min-h-[150px] leading-relaxed"
            />

            {/* Tags Display */}
            <div className="flex flex-wrap gap-2 mt-4 mb-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center px-2 py-1 bg-black/10 rounded-md text-xs font-medium text-gray-700">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
            
            <div className="mt-2">
                 <input
                  type="text"
                  placeholder="Add tag (press Enter)"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="bg-transparent text-sm text-gray-600 placeholder-gray-500 border-none focus:ring-0 p-0"
                />
            </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-t border-black/5 bg-white/50 flex flex-col gap-3 rounded-b-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
             {/* Color Picker */}
            <div className="flex items-center gap-1">
              {(Object.keys(COLOR_THEMES) as NoteColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border border-gray-300 shadow-sm ${COLOR_THEMES[c].bg} ${color === c ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-110'} transition-all`}
                  title={c}
                />
              ))}
            </div>

             {/* Category Selector */}
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-600 border-none focus:ring-0 cursor-pointer"
            >
              {PRESET_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
