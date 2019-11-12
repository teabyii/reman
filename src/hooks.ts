import { useMemo, useReducer } from 'react';
import { Reducers, Dispatcher, Middleware, Action } from './types';

// https://github.com/reduxjs/redux/blob/master/src/compose.ts#L46
export function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return (arg: any) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

export function useEnhancedReducer<T, K extends Reducers<T>>(
  initialState: T,
  reducers: K,
  middlewares?: Middleware<T>[]
): [T, Dispatcher<K>] {
  // trick for middleware to get state
  const maybe = { state: initialState };
  const reducer = useMemo(() => {
    return (state: T, action: Action) => {
      const fn = reducers[action.type];
      let result = state;
      if (typeof fn === 'function') result = fn(state, action.payload);
      maybe.state = result;
      return result;
    };
  }, [reducers]);

  const [state, dispatch] = useReducer(reducer, initialState);
  maybe.state = state;
  const target = useMemo(() => {
    let newDispatch = dispatch;
    if (middlewares) {
      const chain = middlewares.map(n => n(() => maybe.state));
      newDispatch = compose(...chain)(dispatch);
    }

    return Object.keys(reducers).reduce(
      (t, key: keyof K) => {
        t[key] = payload => newDispatch({ type: key as string, payload });
        return t;
      },
      {} as Dispatcher<K>
    );
  }, [reducers, dispatch]);

  return [state, target];
}
