// Helper functions for todo operations

import { Category, FilterType, Todo } from '../types';

export const createTodo = (text: string, category: string): Todo => ({
  id: Date.now().toString(),
  text,
  completed: false,
  category,
  createdAt: new Date().toISOString(),
});

export const filterTodos = (
  todos: Todo[],
  statusFilter: FilterType,
  categoryFilter: string,
  searchQuery: string
): Todo[] => {
  let filtered = todos;

  // Apply status filter
  if (statusFilter === 'active') {
    filtered = filtered.filter((todo) => !todo.completed);
  } else if (statusFilter === 'completed') {
    filtered = filtered.filter((todo) => todo.completed);
  }

  // Apply category filter
  if (categoryFilter !== 'all') {
    filtered = filtered.filter((todo) => todo.category === categoryFilter);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    filtered = filtered.filter((todo) =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
};

export const getCategoryData = (
  categories: Category[],
  categoryValue: string
): Category => {
  return categories.find((cat) => cat.value === categoryValue) || categories[4];
};

export const calculateStats = (todos: Todo[]) => ({
  total: todos.length,
  completed: todos.filter((t) => t.completed).length,
  active: todos.filter((t) => !t.completed).length,
});

