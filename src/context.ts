import React, { Context } from 'react';
import { providers, createProvider } from './provider';
import { Reducers, ContextOptions, Store } from './types';

let __INCREASE_ID__ = 0;

export function createContext<T, K extends Reducers<T>>(
  options: ContextOptions<T, K>
) {
  const {
    name = `@@${__INCREASE_ID__++}`,
    state,
    reducers,
    middlewares
  } = options;
  const context = React.createContext({
    name,
    state,
    dispatch: {} as any
  }) as Context<Store<T, K>>;
  providers.push(createProvider({ context, state, reducers, middlewares }));
  return context;
}
