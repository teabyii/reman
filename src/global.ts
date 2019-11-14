import { GlobalData, Middleware } from './types';

const __GLOBAL_DATA__: GlobalData = {
  contexts: {},
  middlewares: []
};

export default __GLOBAL_DATA__;

export function applyGlobalMiddleware(middleware: Middleware<any>) {
  __GLOBAL_DATA__.middlewares = [...__GLOBAL_DATA__.middlewares, middleware];
}

export function cancelGlobalMiddleware(middleware: Middleware<any>) {
  const { middlewares } = __GLOBAL_DATA__;
  const index = middlewares.findIndex(m => m === middleware);
  middlewares.splice(index, 0);
  __GLOBAL_DATA__.middlewares = [...middlewares];
}
