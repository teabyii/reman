import React, { useContext, useMemo } from 'react'
import todosContext from '../contexts/todos';
import TodoList from './TodoList';
import Footer from './Footer'

function MainSection() {
  const { state, dispatch } = useContext(todosContext);
  const { items } = state;
  const todosCount = items.length;
  const completedCount = useMemo(() => items.reduce((count, todo) => todo.completed ? count + 1 : count, 0), [items]);

  return (
    <section className="main">
      {
        !!todosCount &&
        <span>
          <input
            className="toggle-all"
            type="checkbox"
            checked={completedCount === todosCount}
            readOnly
          />
          <label onClick={dispatch.completeAll}/>
        </span>
      }
      <TodoList />
      {
        !!todosCount &&
        <Footer
          completedCount={completedCount}
          activeCount={todosCount - completedCount}
        />
      }
    </section>
  );
}

export default MainSection;
