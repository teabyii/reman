import { ReactNode, Context } from 'react';

export type Reducer<T> = (state: T, payload?: any) => T;
export interface Reducers<T> {
  [key: string]: Reducer<T>;
}
export interface Action {
  type: string;
  payload?: any;
}
export interface Dispatch {
  (action: Action): any;
}
export interface Middleware<T> {
  (getState: () => T): (next: Dispatch) => Dispatch;
}
export interface ContextOptions<T, K extends Reducers<T>> {
  name?: string;
  state: T;
  reducers: K;
  middlewares?: Middleware<T>[];
}
export type PickPayload<T> = T extends (state: any, payload: infer P) => any
  ? P
  : never;
export type Dispatcher<K> = {
  [P in keyof K]: (payload?: PickPayload<K[P]>) => any;
};
export interface Store<T, K extends Reducers<T>> {
  name: string;
  state: T;
  dispatch: Dispatcher<K>;
}
export interface Props {
  children?: ReactNode;
  key?: string;
}
export interface CreateContextOptions<T, K extends Reducers<T>>
  extends ContextOptions<T, K> {
  context: Context<Store<T, K>>;
}
export interface ConnectOptions<T> {
  areEqual?: (prevProps: Readonly<T>, nextProps: Readonly<T>) => boolean;
  forwardRef?: boolean;
}
export interface GlobalData {
  middlewares: Middleware<any>[];
}
