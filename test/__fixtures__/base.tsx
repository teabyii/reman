import React, { ReactNode } from 'react';
import Provider from '../../src/provider';

export const storePrototype = {
  state: { count: 1 },
  reducers: {
    set(state: any, { count }: { count: number }) {
      return { ...state, count };
    }
  }
};

export function Root(props: { children: ReactNode }) {
  return <Provider>{props.children}</Provider>;
}
