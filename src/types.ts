// Type definitions for the Todo app

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  createdAt: string;
}

export interface Category {
  value: string;
  label: string;
  color: string;
  gradient: readonly [string, string];
}

export type FilterType = 'all' | 'active' | 'completed';

