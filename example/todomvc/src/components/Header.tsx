import React from 'react'
import todosContext from '../contexts/todos';
import TodoTextInput from './TodoTextInput'
import { useContext } from 'react';

const Header = () => {
  const { dispatch } = useContext(todosContext);

  return (
    <header className="header">
      <h1>todos</h1>
      <TodoTextInput
        newTodo
        onSave={text => {
          if (text.length !== 0) {
            dispatch.add({ text });
          }
        }}
        placeholder="What needs to be done?"
      />
    </header>
  );
};

export default Header
