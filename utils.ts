
import { NoteColor, ColorTheme } from './types';

export const COLOR_THEMES: Record<NoteColor, ColorTheme> = {
  white: { bg: 'bg-white', border: 'border-gray-200', hover: 'hover:shadow-md' },
  red: { bg: 'bg-red-100', border: 'border-red-200', hover: 'hover:shadow-md' },
  orange: { bg: 'bg-orange-100', border: 'border-orange-200', hover: 'hover:shadow-md' },
  yellow: { bg: 'bg-yellow-100', border: 'border-yellow-200', hover: 'hover:shadow-md' },
  green: { bg: 'bg-green-100', border: 'border-green-200', hover: 'hover:shadow-md' },
  teal: { bg: 'bg-teal-100', border: 'border-teal-200', hover: 'hover:shadow-md' },
  blue: { bg: 'bg-blue-100', border: 'border-blue-200', hover: 'hover:shadow-md' },
  purple: { bg: 'bg-purple-100', border: 'border-purple-200', hover: 'hover:shadow-md' },
  pink: { bg: 'bg-pink-100', border: 'border-pink-200', hover: 'hover:shadow-md' },
  brown: { bg: 'bg-stone-200', border: 'border-stone-300', hover: 'hover:shadow-md' },
  gray: { bg: 'bg-gray-100', border: 'border-gray-300', hover: 'hover:shadow-md' },
};

export const PRESET_CATEGORIES = ['Personal', 'Work', 'Ideas', 'To-Do'];

export const generateId = () => Math.random().toString(36).substr(2, 9);
