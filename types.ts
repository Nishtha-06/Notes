
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  isPinned: boolean;
  isArchived: boolean;
  color: NoteColor;
  updatedAt: number;
  createdAt: number;
}

export type NoteColor = 'white' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink' | 'brown' | 'gray';

export interface ColorTheme {
  bg: string;
  border: string;
  hover: string;
}
