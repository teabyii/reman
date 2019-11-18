import __GLOBAL_DATA__, { applyGlobalMiddleware } from './global';

let devtools: any;
// as function for testing
export default function initDevtools(
  host: any = window || global,
  disabled = false
) {
  const { devToolsExtension } = host;
  if (disabled) return;
  if (devToolsExtension) {
    devtools = devToolsExtension.connect({});
    devtools.init(__GLOBAL_DATA__.contexts);
    applyGlobalMiddleware((getState, contextName) => next => action => {
      const re = next(action);
      devtools.send(
        { type: `${contextName}@${action.type}`, payload: action.payload },
        { [contextName]: getState() }
      );
      return re;
    });
  }
}

export function getDevtools() {
  return devtools;
}
