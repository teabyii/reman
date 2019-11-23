import { createContext } from 'reman';

export enum FilterType {
  SHOW_ALL = 'SHOW_ALL',
  SHOW_COMPLETED = 'SHOW_COMPLETED',
  SHOW_ACTIVE = 'SHOW_ACTIVE'
 }

export default createContext({
  state: {
    filter: FilterType.SHOW_ALL
  },
  reducers: {
    set(state, payload: { type: FilterType }) {
      return { ...state, filter: payload.type };
    }
  }
})
