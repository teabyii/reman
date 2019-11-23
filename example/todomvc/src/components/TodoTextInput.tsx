import React, { useState } from 'react';
import classnames from 'classnames';

interface Props {
  onSave: (text: string) => void;
  init?: string;
  placeholder?: string;
  editing?: boolean;
  newTodo?: boolean;
}

function TodoTextInput(props: Props) {
  const { init, editing, newTodo, placeholder, onSave } = props;
  const [text, setText] = useState(init || '');
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!props.newTodo) {
      onSave(e.target.value);
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      onSave(text);
      if (newTodo) {
        setText(text);
      }
    }
  };

  return (
    <input
      className={
        classnames({
          edit: editing,
          'new-todo': newTodo
        })
      }
      type="text"
      placeholder={placeholder}
      autoFocus={true}
      value={text}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleSubmit}
    />
  );
}

export default TodoTextInput;
