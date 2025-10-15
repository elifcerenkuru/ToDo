import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Modal,
    Provider as PaperProvider,
    Portal,
    Text,
    TextInput,
} from 'react-native-paper';

import { CATEGORIES, COLORS, THEME } from '../src/constants';
import { Category, FilterType, Todo } from '../src/types';
import {
    calculateStats,
    createTodo,
    filterTodos,
    getCategoryData,
} from '../src/utils/todoHelpers';

function TodoApp() {
  // State Management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('personal');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

  // Todo Operations
  const addTodo = useCallback(() => {
    if (newTodoText.trim()) {
      const newTodo = createTodo(newTodoText, newTodoCategory);
      setTodos((prev) => [newTodo, ...prev]);
      setNewTodoText('');
      setModalVisible(false);
    }
  }, [newTodoText, newTodoCategory]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const startEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setEditModalVisible(true);
  }, []);

  const saveEditTodo = useCallback(() => {
    if (editingTodo && editText.trim()) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingTodo.id ? { ...todo, text: editText } : todo
        )
      );
      setEditModalVisible(false);
      setEditingTodo(null);
      setEditText('');
    }
  }, [editingTodo, editText]);

  const clearCompletedTasks = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  // Computed Values
  const filteredTodos = filterTodos(todos, filter, categoryFilter, searchQuery);
  const stats = calculateStats(todos);

  // Render Todo Item
  const renderTodoItem = useCallback(
    ({ item }: { item: Todo }) => {
      const category = getCategoryData(CATEGORIES, item.category);

      return (
        <View style={styles.todoCard}>
          <LinearGradient
            colors={COLORS.GRADIENT_TODO_BG}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.todoGradient}
          >
            <View style={styles.todoContent}>
              <TouchableOpacity onPress={() => toggleTodo(item.id)}>
                <View
                  style={[
                    styles.customCheckbox,
                    item.completed && styles.customCheckboxChecked,
                  ]}
                >
                  {item.completed && (
                    <LinearGradient
                      colors={category.gradient}
                      style={styles.checkboxGradient}
                    >
                      <Text style={styles.checkmark}>✓</Text>
                    </LinearGradient>
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.todoTextContainer}>
                <Text
                  style={[
                    styles.todoText,
                    item.completed && styles.completedText,
                  ]}
                >
                  {item.text}
                </Text>
                <View style={styles.categoryBadge}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text style={styles.categoryText}>{category.label}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => startEditTodo(item)}
                style={styles.editButton}
              >
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteTodo(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteIcon}>×</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      );
    },
    [toggleTodo, startEditTodo, deleteTodo]
  );

  // Render Category Dropdown Item
  const renderCategoryOption = (cat: Category | null) => {
    const isAll = cat === null;
    const isActive = isAll
      ? categoryFilter === 'all'
      : categoryFilter === cat?.value;

    return (
      <TouchableOpacity
        key={isAll ? 'all' : cat?.value}
        style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
        onPress={() => {
          setCategoryFilter(isAll ? 'all' : cat!.value);
          setCategoryDropdownVisible(false);
        }}
        activeOpacity={0.7}
      >
        {!isAll && (
          <View
            style={[styles.categoryColorDot, { backgroundColor: cat?.color }]}
          />
        )}
        <Text
          style={[
            styles.dropdownItemText,
            isActive && styles.dropdownItemTextActive,
          ]}
        >
          {isAll ? 'All Categories' : cat?.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>To-Do App</Text>
          <Text style={styles.headerSubtitle}>Manage your daily activities</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={clearCompletedTasks}
          >
            <Text style={styles.iconText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <LinearGradient
          colors={COLORS.GRADIENT_PRIMARY}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsGradient}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" color={COLORS.TEXT_PLACEHOLDER} />}
          right={
            searchQuery ? (
              <TextInput.Icon
                icon="close"
                color={COLORS.TEXT_PLACEHOLDER}
                onPress={() => setSearchQuery('')}
              />
            ) : undefined
          }
          theme={{
            colors: {
              primary: THEME.colors.primary,
              background: COLORS.BACKGROUND_CARD,
              text: COLORS.TEXT_PRIMARY,
              placeholder: COLORS.TEXT_PLACEHOLDER,
              outline: COLORS.BORDER,
            },
          }}
          outlineColor={COLORS.BORDER}
          activeOutlineColor={THEME.colors.primary}
          textColor={COLORS.TEXT_PRIMARY}
          placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categoryFilterContainer}>
        <TouchableOpacity
          style={styles.categoryFilterButton}
          onPress={() => setCategoryDropdownVisible(!categoryDropdownVisible)}
        >
          <Text style={styles.categoryFilterText}>
            {categoryFilter === 'all'
              ? 'Category'
              : CATEGORIES.find((c) => c.value === categoryFilter)?.label}
          </Text>
          <Text style={styles.dropdownArrow}>
            {categoryDropdownVisible ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Dropdown Modal */}
      {categoryDropdownVisible && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setCategoryDropdownVisible(false)}
        >
          <View style={styles.dropdownMenuAbsolute}>
            {renderCategoryOption(null)}
            {CATEGORIES.map((cat) => renderCategoryOption(cat))}
          </View>
        </TouchableOpacity>
      )}

      {/* Status Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to create your first task
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={COLORS.GRADIENT_PRIMARY}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>

            <TextInput
              mode="outlined"
              label="What needs to be done?"
              value={newTodoText}
              onChangeText={setNewTodoText}
              style={styles.input}
              multiline
              theme={{
                colors: {
                  primary: THEME.colors.primary,
                  background: COLORS.BACKGROUND_CARD,
                  text: COLORS.TEXT_PRIMARY,
                  placeholder: COLORS.TEXT_PLACEHOLDER,
                  outline: COLORS.BORDER,
                },
              }}
              outlineColor={COLORS.BORDER}
              activeOutlineColor={THEME.colors.primary}
              textColor={COLORS.TEXT_PRIMARY}
            />

            <Text style={styles.categoryLabel}>Select Category</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryOption,
                    newTodoCategory === cat.value && styles.categoryOptionActive,
                  ]}
                  onPress={() => setNewTodoCategory(cat.value)}
                >
                  {newTodoCategory === cat.value ? (
                    <LinearGradient
                      colors={cat.gradient}
                      style={styles.categoryOptionGradient}
                    >
                      <View
                        style={[styles.categoryDot, { backgroundColor: '#FFFFFF' }]}
                      />
                      <Text style={styles.categoryOptionTextActive}>
                        {cat.label}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <>
                      <View
                        style={[styles.categoryDot, { backgroundColor: cat.color }]}
                      />
                      <Text style={styles.categoryOptionText}>{cat.label}</Text>
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={addTodo}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={COLORS.GRADIENT_PRIMARY}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonText}>Add Task</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>

            <TextInput
              mode="outlined"
              label="Task title"
              value={editText}
              onChangeText={setEditText}
              style={styles.input}
              multiline
              theme={{
                colors: {
                  primary: THEME.colors.primary,
                  background: COLORS.BACKGROUND_CARD,
                  text: COLORS.TEXT_PRIMARY,
                  placeholder: COLORS.TEXT_PLACEHOLDER,
                  outline: COLORS.BORDER,
                },
              }}
              outlineColor={COLORS.BORDER}
              activeOutlineColor={THEME.colors.primary}
              textColor={COLORS.TEXT_PRIMARY}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={saveEditTodo}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={COLORS.GRADIENT_PRIMARY}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

export default function Index() {
  return (
    <PaperProvider theme={THEME}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TodoApp />
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  statsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 24,
  },
  searchContainer: {
    marginHorizontal: 24,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    fontSize: 14,
  },
  categoryFilterContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    gap: 8,
    minWidth: 120,
  },
  categoryFilterText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  dropdownArrow: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 10,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'flex-start',
    paddingTop: 330,
    paddingHorizontal: 24,
  },
  dropdownMenuAbsolute: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  dropdownItemText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
  },
  dropdownItemTextActive: {
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  categoryColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#E0E7FF',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: THEME.colors.primary,
  },
  filterText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  todoCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  todoGradient: {
    padding: 16,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCheckboxChecked: {
    borderColor: 'transparent',
  },
  checkboxGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  editIcon: {
    fontSize: 18,
    color: THEME.colors.primary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 24,
    color: COLORS.ERROR,
    fontWeight: '300',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '300',
  },
  modalContainer: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
  },
  modalContent: {
    gap: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND_CARD,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: -8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryOptionActive: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  categoryOptionGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryOptionText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  categoryOptionTextActive: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
});

