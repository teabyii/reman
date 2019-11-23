import React, { useContext, useMemo } from 'react';
import todosContext from '../contexts/todos';
import filterContext, { FilterType } from '../contexts/filter';
import TodoItem from './TodoItem';

function TodoList() {
  const { state } = useContext(todosContext);
  const { state: { filter } } = useContext(filterContext);
  const { items } = state;
  const filteredTodos = useMemo(() => {
    if (filter === FilterType.SHOW_ALL) return items;
    if (filter === FilterType.SHOW_ACTIVE) return items.filter(todo => !todo.completed)
    if (filter === FilterType.SHOW_COMPLETED) return items.filter(todo => todo.completed)
    throw new Error(`Unknown filter: ${filter}`);
  }, [items, filter]);

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo =>
        <TodoItem key={todo.id} todo={todo} />
      )}
    </ul>
  );
}

export default TodoList;
