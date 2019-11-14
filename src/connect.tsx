import React, { memo, ComponentType, PropsWithRef } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ConnectOptions, Props } from './types';

export function connect<M = any, N = any, T extends Props = any>(
  useContext: (props?: T) => [M, N?],
  options?: ConnectOptions<PropsWithRef<M & N & T>>
) {
  return (WrappedComponent: ComponentType<PropsWithRef<M & N & T>>) => {
    const { forwardRef, areEqual } = options || {};
    const Pure = memo(WrappedComponent, areEqual);

    const Connected = function(props: T & { forwardedRef: any }) {
      const [state, dispatcher] = useContext();
      const { forwardedRef, ...rest } = props;

      return (
        <Pure
          {...(rest as any)}
          {...state}
          {...dispatcher}
          ref={forwardedRef}
        />
      );
    };
    Connected.displayName = `Connected(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    if (forwardRef) {
      const Forwarded = React.forwardRef((props: M & N & T, ref: any) => (
        <Connected {...props} forwardedRef={ref} />
      ));
      return hoistStatics(Forwarded, WrappedComponent);
    }

    return hoistStatics(Connected, WrappedComponent);
  };
}
