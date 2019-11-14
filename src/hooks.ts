import { useMemo, useReducer } from 'react';
import { Reducers, Dispatcher, Middleware, Action, GlobalData } from './types';

export const __GLOBAL_DATA__: GlobalData = {
  middlewares: []
};

export function applyGlobalMiddleware(middleware: Middleware<any>) {
  __GLOBAL_DATA__.middlewares = [...__GLOBAL_DATA__.middlewares, middleware];
}

export function cancelGlobalMiddleware(middleware: Middleware<any>) {
  const { middlewares } = __GLOBAL_DATA__;
  const index = middlewares.findIndex(m => m === middleware);
  middlewares.splice(index, 0);
  __GLOBAL_DATA__.middlewares = [...middlewares];
}

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
    const appliedMiddlewares = [
      ...__GLOBAL_DATA__.middlewares,
      ...(middlewares || [])
    ];
    const chain = appliedMiddlewares.map(n => n(() => maybe.state));
    newDispatch = compose(...chain)(dispatch);

    return Object.keys(reducers).reduce(
      (t, key: keyof K) => {
        t[key] = payload => newDispatch({ type: key as string, payload });
        return t;
      },
      {} as Dispatcher<K>
    );
  }, [reducers, dispatch, __GLOBAL_DATA__.middlewares]);

  return [state, target];
}
