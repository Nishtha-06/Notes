
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { Note, NoteColor } from './types';
import { generateId, PRESET_CATEGORIES } from './utils';

// Dummy Initial Data
const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Project Ideas',
    content: '1. AI Plant identifier\n2. Smart Recipe Manager\n3. Personal Finance Dashboard',
    tags: ['brainstorm', 'dev'],
    category: 'Ideas',
    isPinned: true,
    isArchived: false,
    color: 'yellow',
    updatedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Grocery List',
    content: '- Milk\n- Eggs\n- Bread\n- Spinach',
    tags: ['shopping'],
    category: 'Personal',
    isPinned: false,
    isArchived: false,
    color: 'white',
    updatedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: '3',
    title: 'Meeting Notes',
    content: 'Discuss Q3 roadmap. \nKey points:\n- Performance optimization\n- New UI Refresh',
    tags: ['meeting', 'urgent'],
    category: 'Work',
    isPinned: true,
    isArchived: false,
    color: 'red',
    updatedAt: Date.now(),
    createdAt: Date.now(),
  }
];

export default function App() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'notes' | 'archive'>('notes');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // CRUD Operations
  const handleSaveNote = (noteData: Partial<Note>) => {
    if (noteData.id) {
      // Update existing
      setNotes(prev => prev.map(n => n.id === noteData.id ? { ...n, ...noteData, updatedAt: Date.now() } as Note : n));
    } else {
      // Create new
      const newNote: Note = {
        id: generateId(),
        title: noteData.title || '',
        content: noteData.content || '',
        tags: noteData.tags || [],
        category: noteData.category || 'Personal',
        isPinned: noteData.isPinned || false,
        isArchived: false,
        color: (noteData.color as NoteColor) || 'white',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setEditingNote(null);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleArchiveNote = (id: string, currentStatus: boolean) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isArchived: !currentStatus } : n));
  };

  const handlePinNote = (id: string, currentStatus: boolean) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !currentStatus } : n));
  };

  const openNewNoteEditor = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const openEditNoteEditor = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  // Smart Filtering Logic
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // 1. View Filter (Archived vs Active)
    if (currentView === 'archive') {
      filtered = filtered.filter(n => n.isArchived);
    } else {
      filtered = filtered.filter(n => !n.isArchived);
    }

    // 2. Category Filter (Sidebar)
    if (selectedCategory) {
      filtered = filtered.filter(n => n.category === selectedCategory);
    }

    // 3. Search Query Filter (Smart Search)
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      const terms = queryLower.split(' ');
      
      filtered = filtered.filter(note => {
        // Simple text match
        const textMatch = note.title.toLowerCase().includes(queryLower) || 
                          note.content.toLowerCase().includes(queryLower);
        
        // Smart Tag/Color/Category detection from query string
        // Example: "Work red" -> matches Category: Work AND Color: Red
        const categoryMatch = PRESET_CATEGORIES.some(cat => 
          queryLower.includes(cat.toLowerCase()) && note.category.toLowerCase() === cat.toLowerCase()
        );

        const colorMatch = (['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'teal', 'pink', 'brown', 'gray', 'white'] as NoteColor[]).some(c => 
          queryLower.includes(c) && note.color === c
        );

        // Standard tag search
        const tagMatch = note.tags.some(tag => queryLower.includes(tag.toLowerCase()));

        return textMatch || categoryMatch || colorMatch || tagMatch;
      });
    }

    return filtered;
  }, [notes, currentView, selectedCategory, searchQuery]);

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Main Content */}
      <main className="ml-0 md:ml-64 transition-all duration-300 p-4 md:p-8">
        {/* Top Bar: Search & Mobile Menu Trigger (implied) */}
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-4 mb-6">
          <div className="max-w-3xl mx-auto relative">
             <div className="relative shadow-sm rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 transition duration-150 ease-in-out sm:text-sm shadow-sm"
                  placeholder="Search notes, tags, or try 'Work red'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Input Trigger (Fake input to open modal) */}
        {currentView === 'notes' && !searchQuery && (
          <div className="max-w-2xl mx-auto mb-10">
            <div 
              onClick={openNewNoteEditor}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-3 flex items-center text-gray-500 cursor-text hover:shadow-lg transition-shadow"
            >
              <span className="font-medium ml-2">Take a note...</span>
              <div className="ml-auto flex space-x-4">
                 <button className="p-1 hover:bg-gray-100 rounded"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-20">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
               </div>
               <h3 className="text-lg font-medium text-gray-900">No notes found</h3>
               <p className="mt-1 text-gray-500">Try adjusting your search or create a new note.</p>
            </div>
          ) : (
            <>
              {currentView === 'notes' && pinnedNotes.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1">Pinned</h4>
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {pinnedNotes.map(note => (
                      <NoteCard 
                        key={note.id} 
                        note={note} 
                        onEdit={openEditNoteEditor}
                        onArchive={handleArchiveNote}
                        onPin={handlePinNote}
                        onDelete={handleDeleteNote}
                      />
                    ))}
                  </div>
                </div>
              )}

              {currentView === 'notes' && pinnedNotes.length > 0 && otherNotes.length > 0 && (
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1">Others</h4>
              )}

              <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {(currentView === 'notes' ? otherNotes : filteredNotes).map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onEdit={openEditNoteEditor}
                    onArchive={handleArchiveNote}
                    onPin={handlePinNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <NoteEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSave={handleSaveNote}
        initialNote={editingNote}
      />
    </div>
  );
}
