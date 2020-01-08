import React, { memo, ComponentType, PropsWithRef } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ConnectOptions } from './types';

export function connect<M = any, T = any>(
  useContext: (props: T) => M,
  options?: ConnectOptions<PropsWithRef<M & T>>
) {
  return (WrappedComponent: ComponentType<PropsWithRef<M & T>>) => {
    const { forwardRef, areEqual } = options || {};
    const Pure = memo(WrappedComponent, areEqual);

    const Connected = function(props: T & { forwardedRef?: any }) {
      const connectedProps = useContext(props);
      const { forwardedRef, ...rest } = props;

      return <Pure {...(rest as any)} {...connectedProps} ref={forwardedRef} />;
    };
    Connected.displayName = `Connected(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    if (forwardRef) {
      const Forwarded = React.forwardRef((props: T, ref: any) => (
        <Connected {...props} forwardedRef={ref} />
      ));
      return hoistStatics(Forwarded, WrappedComponent);
    }

    return hoistStatics(Connected, WrappedComponent);
  };
}
