import { createContext } from 'reman';

export interface Todo {
  text: string;
  completed: boolean;
  id: number
}

export default createContext({
  state: {
    items: [
      {
        text: 'Use Reman',
        completed: false,
        id: 0
      }
    ] as Todo[]
  },
  reducers: {
    add(state, payload: { text: string }) {
      const { items } = state;
      return {
        ...state,
        items: [
          ...items,
          {
            text: payload.text,
            completed: false,
            id: items.reduce((max, todo) => Math.max(todo.id, max), -1) + 1
          }
        ]
      };
    },
    remove(state, payload: { id: number }) {
      const { items } = state;
      return {
        ...state,
        items: items.filter(todo => todo.id !== payload.id)
      };
    },
    edit(state, payload: { id: number; text: string }) {
      const { items } = state;
      return {
        ...state,
        items: items.map(todo => todo.id === payload.id ? { ...todo, text: payload.text } : todo)
      };
    },
    complete(state, payload: { id: number; completed: boolean }) {
      const { items } = state;
      return {
        ...state,
        items: items.map(todo => todo.id === payload.id ? { ...todo, completed: payload.completed } : todo)
      };
    },
    completeAll(state) {
      const { items } = state;
      const all = items.every(todo => todo.completed);
      return {
        ...state,
        items: items.map(todo => ({ ...todo, completed: !all }))
      };
    },
    clearCompleted(state) {
      const { items } = state;
      return {
        ...state,
        items: items.filter(todo => todo.completed === false)
      };
    }
  }
});
