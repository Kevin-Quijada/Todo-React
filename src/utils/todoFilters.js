export function filterTodos(
  todos,
  search,
  statusFilter,
  priorityFilter,
  categoryFilter
) {
  return todos.filter((todo) => {
    const matchesSearch =
      todo.title?.toLowerCase().includes(search.toLowerCase()) ||
      todo.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter || todo.status === statusFilter;

    const matchesPriority =
      !priorityFilter || todo.priority === priorityFilter;

    const matchesCategory =
      !categoryFilter ||
      String(todo.category_id) === String(categoryFilter); // s

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });
}