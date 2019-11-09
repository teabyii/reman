import { createContext } from 'reman';

export default createContext({
  state: {
    count: 0
  },
  reducers: {
    increase(state) {
      return { ...state, count: state.count + 1 }
    },
    decrease(state) {
      return { ...state, count: state.count - 1 }
    },
    set(state, { count }: { count: number }) {
      return { ...state, count }
    }
  }
})
