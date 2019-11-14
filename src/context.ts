import React, { Context } from 'react';
import { providers, createProvider } from './provider';
import { Reducers, ContextOptions, Store } from './types';

export function createContext<T, K extends Reducers<T>>(
  options: ContextOptions<T, K>
) {
  const { state, reducers, middlewares } = options;
  const context = React.createContext({
    state,
    dispatch: {} as any
  }) as Context<Store<T, K>>;
  providers.push(createProvider({ context, state, reducers, middlewares }));
  return context;
}
