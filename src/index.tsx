import React, { Context, FunctionComponent, ReactNode } from 'react';

export type Reducer<T> = (state: T, payload?: any) => T;
export interface Reducers<T> {
  [key: string]: Reducer<T>;
}
export interface Action {
  type: string;
  payload?: any;
}
export interface ContextOptions<T, K extends Reducers<T>> {
  state: T;
  reducers: K;
}
type PickPayload<T> = T extends (state: any, payload: infer P) => any
  ? P
  : never;
export type Dispatcher<K> = {
  [P in keyof K]: (payload?: PickPayload<K[P]>) => void;
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

export function useEnhancedReducer<T, K extends Reducers<T>>(
  initialState: T,
  reducers: K
): [T, Dispatcher<K>] {
  const reducer = React.useMemo(() => {
    return (state: T, action: Action) => {
      const fn = reducers[action.type];
      if (typeof fn === 'function') return fn(state, action.payload);
      return state;
    };
  }, [reducers]);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const target = React.useMemo(
    () =>
      Object.keys(reducers).reduce(
        (t, key: keyof K) => {
          t[key] = payload => dispatch({ type: key as string, payload });
          return t;
        },
        {} as Dispatcher<K>
      ),
    [reducers, dispatch]
  );

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
