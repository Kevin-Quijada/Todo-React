export function filterTodos(
  todos,
  search,
  statusFilter,
  priorityFilter,
  categoryFilter
) {
  const term = (search || '').toLowerCase();

  return (todos || []).filter((todo) => {
    const title = (todo.title || '').toLowerCase();
    const description = (todo.description || '').toLowerCase();
    const assigned = (todo.assigned_user?.name || '').toLowerCase();

    const matchesSearch =
      term === '' ||
      title.includes(term) ||
      description.includes(term) ||
      assigned.includes(term);

    const matchesStatus = !statusFilter || todo.status === statusFilter;

    const matchesPriority = !priorityFilter || todo.priority === priorityFilter;

    const matchesCategory =
      !categoryFilter ||
      String(todo.categories?.id || todo.category_id || '') === String(categoryFilter);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });
}