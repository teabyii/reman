import Provider from './provider';

export default Provider;
export { createContext } from './context';
export { connect } from './connect';
export { applyGlobalMiddleware, cancelGlobalMiddleware } from './global';
export { merge } from './helper';

// devtools support
import initDevtools from './devtools';
initDevtools();
