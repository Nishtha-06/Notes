
import React from 'react';
import { PRESET_CATEGORIES } from '../utils';

interface SidebarProps {
  currentView: 'notes' | 'archive';
  onViewChange: (view: 'notes' | 'archive') => void;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  selectedCategory, 
  onCategorySelect 
}) => {
  const navItemClass = (isActive: boolean) => 
    `flex items-center w-full px-4 py-3 text-sm font-medium rounded-r-full transition-colors ${
      isActive 
        ? 'bg-yellow-100 text-gray-900' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 fixed h-full bg-white flex flex-col pt-4 pb-4 pr-2 overflow-y-auto hidden md:flex border-r border-gray-200 z-10">
      <div className="pl-4 mb-8 flex items-center space-x-2">
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-700">SmartNotes</span>
      </div>

      <nav className="space-y-1">
        <button 
          onClick={() => { onViewChange('notes'); onCategorySelect(null); }}
          className={navItemClass(currentView === 'notes' && selectedCategory === null)}
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          Notes
        </button>
        
        <button 
          onClick={() => onViewChange('archive')}
          className={navItemClass(currentView === 'archive')}
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          Archive
        </button>
      </nav>

      <div className="mt-8 px-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</h3>
        <div className="space-y-1">
          {PRESET_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { onViewChange('notes'); onCategorySelect(cat); }}
              className={`flex items-center w-full py-2 text-sm transition-colors ${
                selectedCategory === cat ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-gray-400 mr-3"></span>
              {cat}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
