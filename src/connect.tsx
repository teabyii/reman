import React, { memo, FunctionComponent } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ConnectOptions, Props } from './types';

export function connect<M = any, N = any, T extends Props = any>(
  useContext: (props?: T) => [M, N],
  options?: ConnectOptions<M & N & T>
) {
  return (Component: FunctionComponent<M & N & T>) => {
    const { areEqual, forwardRef } = options || {};
    const Memorized = memo(Component, areEqual);

    const Connected = function(props: T, ref: any) {
      const [state, dispatcher] = useContext();
      return (
        <Memorized {...props} {...state} {...dispatcher} ref={ref}>
          {props.children}
        </Memorized>
      );
    };
    Connected.displayName = `Connected(${Component.displayName ||
      Component.name})`;

    if (forwardRef) {
      const Forwarded = React.forwardRef(Connected);
      return hoistStatics(Forwarded, Component);
    }

    return hoistStatics(Connected, Component);
  };
}
