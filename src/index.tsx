import React, { Context, FunctionComponent, ReactNode } from 'react';

export type Reducer<T> = (state: T, payload?: any) => T;
export interface Reducers<T> {
  [key: string]: Reducer<T>;
}
export interface Action {
  type: string;
  payload?: any;
}
export interface Dispatch {
  (action: Action): any;
}
export interface Middleware<T> {
  (getState: () => T): (next: Dispatch) => Dispatch;
}
export interface ContextOptions<T, K extends Reducers<T>> {
  state: T;
  reducers: K;
  middlewares?: Middleware<T>[];
}
export type PickPayload<T> = T extends (state: any, payload: infer P) => any
  ? P
  : never;
export type Dispatcher<K> = {
  [P in keyof K]: (payload?: PickPayload<K[P]>) => any;
};
export interface Store<T, K extends Reducers<T>> {
  state: T;
  dispatch: Dispatcher<K>;
}
export interface Props {
  children?: ReactNode;
}
export interface CreateContextOptions<T, K extends Reducers<T>>
  extends ContextOptions<T, K> {
  context: Context<Store<T, K>>;
}

export const providers: FunctionComponent[] = [];

function Provider(props: Props) {
  return providers.reduce(
    (children, SubProvider) => <SubProvider>{children}</SubProvider>,
    props.children
  );
}

export default Provider as FunctionComponent;

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
  const reducer = React.useMemo(() => {
    return (state: T, action: Action) => {
      const fn = reducers[action.type];
      let result = state;
      if (typeof fn === 'function') result = fn(state, action.payload);
      maybe.state = result;
      return result;
    };
  }, [reducers]);

  const [state, dispatch] = React.useReducer(reducer, initialState);
  maybe.state = state;
  const target = React.useMemo(() => {
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

export function createProvider<T, K extends Reducers<T>>(
  options: CreateContextOptions<T, K>
): FunctionComponent {
  return function(props: Props) {
    const [state, dispatch] = useEnhancedReducer(
      options.state,
      options.reducers
    );
    return (
      <options.context.Provider value={{ state, dispatch }}>
        {props.children}
      </options.context.Provider>
    );
  };
}

export function createContext<T, K extends Reducers<T>>(
  options: ContextOptions<T, K>
) {
  const { state, reducers } = options;
  const context = React.createContext({
    state,
    dispatch: {} as any
  }) as Context<Store<T, K>>;
  providers.push(createProvider({ context, state, reducers }));
  return context;
}
