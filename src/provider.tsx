import React, { FunctionComponent } from 'react';
import { Props, Reducers, CreateContextOptions } from './types';
import { useEnhancedReducer } from './hooks';

export const providers: FunctionComponent[] = [];

function Provider(props: Props) {
  return providers.reduce(
    (children, SubProvider) => <SubProvider>{children}</SubProvider>,
    props.children
  );
}

export default Provider as FunctionComponent;

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
