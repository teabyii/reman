import __GLOBAL_DATA__, { applyGlobalMiddleware } from './global';
const devToolsExtension = window && (window as any).devToolsExtension;

if (devToolsExtension) {
  const withDevtools = devToolsExtension.connect({});
  withDevtools.init(__GLOBAL_DATA__.contexts);
  applyGlobalMiddleware((getState, contextName) => next => action => {
    const re = next(action);
    withDevtools.send(
      { type: `${contextName}@${action.type}`, payload: action.payload },
      { [contextName]: getState() }
    );
    return re;
  });
}
