import React, { useContext, useState } from 'react';
import classnames from 'classnames';
import todosContext, { Todo } from '../contexts/todos';
import TodoTextInput from './TodoTextInput';

interface Props {
  todo: Todo;
}

function TodoItem(props: Props) {
  const { todo } = props;
  const { dispatch } = useContext(todosContext);
  const [editing, setEditing] = useState(false);
  const handleSave = (id: number, text: string) => {
    if (!text.length) {
      dispatch.remove({ id });
    } else {
      dispatch.edit({ id, text });
    }
    setEditing(false);
  }
  let element = null;

  if (editing) {
    element = (
      <TodoTextInput
        init={todo.text}
        editing={editing}
        onSave={(text) => handleSave(todo.id, text)}
      />
    );
  } else {
    element = (
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch.complete({ id: todo.id, completed: true })}
        />
        <label onDoubleClick={() => setEditing(true)}>
          {todo.text}
        </label>
        <button
          className="destroy"
          onClick={() => dispatch.remove({ id: todo.id })}
        />
      </div>
    );
  }

  return (
    <li className={classnames({
      completed: todo.completed,
      editing
    })}>
      {element}
    </li>
  );
}

export default TodoItem;
