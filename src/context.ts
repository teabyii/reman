import React, { Context } from 'react';
import { providers, createProvider } from './provider';
import { Reducers, ContextOptions, Store } from './types';
import __GLOBAL_DATA__ from './global';

let __CONTEXT_ID__ = 0;

export function createContext<T, K extends Reducers<T>>(
  options: ContextOptions<T, K>
) {
  const {
    name = `$$${__CONTEXT_ID__++}`,
    state,
    reducers,
    middlewares
  } = options;
  const context = React.createContext({
    name,
    state,
    dispatch: {} as any
  }) as Context<Store<T, K>>;
  context.displayName = name;
  __GLOBAL_DATA__.contexts[name] = { ...state };
  providers.push(
    createProvider({ name, context, state, reducers, middlewares })
  );
  return context;
}
