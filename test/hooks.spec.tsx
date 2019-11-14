import { renderHook, act } from '@testing-library/react-hooks';
import { useEnhancedReducer } from '../src/hooks';
import { storePrototype } from './__fixtures__/base';

jest.useFakeTimers();

const fakeContextName = '$$0';

test('useEnhancedReducer', () => {
  const { result } = renderHook(() =>
    useEnhancedReducer(
      fakeContextName,
      storePrototype.state,
      storePrototype.reducers
    )
  );

  expect(result.current[0].count).toBe(1);
  expect(typeof result.current[1].set).toBe('function');
  act(() => {
    result.current[1].set({ count: 4 });
  });
  expect(result.current[0].count).toBe(4);
});

test('meaningless reducers', () => {
  const { result } = renderHook(() =>
    useEnhancedReducer(fakeContextName, {}, { meaninglessValue: 1 } as any)
  );
  expect(() => {
    result.current[1].meaninglessValue();
  }).not.toThrow();
});

test('middlewares', () => {
  const queue: number[] = [];
  const first = jest.fn().mockImplementation(() => queue.push(0));
  const second = jest.fn().mockImplementation(() => queue.push(1));
  const middlewares = [
    (getState: any) => (next: any) => (action: any) => {
      first(getState());
      const result = next(action);
      second(getState());
      return result;
    }
  ];
  const { result } = renderHook(() =>
    useEnhancedReducer(
      fakeContextName,
      storePrototype.state,
      storePrototype.reducers,
      middlewares
    )
  );
  act(() => {
    result.current[1].set({ count: 4 });
  });
  expect(queue[0]).toBe(0);
  expect(queue[1]).toBe(1);
  expect(first.mock.calls.length).toBe(1);
  expect(first.mock.calls[0][0].count).toBe(1);
  expect(second.mock.calls.length).toBe(1);
  expect(second.mock.calls[0][0].count).toBe(4);
});

test('empty middlewares', () => {
  const { result } = renderHook(() =>
    useEnhancedReducer(
      fakeContextName,
      storePrototype.state,
      storePrototype.reducers,
      []
    )
  );
  act(() => {
    result.current[1].set({ count: 5 });
  });
  expect(result.current[0].count).toBe(5);
});

test('async', () => {
  const d = jest.fn();
  const c = jest.fn();
  const middlewares = [
    () => (next: any) => (action: any) => {
      if (!action.payload || !action.payload.delay) {
        return next(action);
      }
      const tid = setTimeout(() => next(action), action.payload.delay);
      return () => {
        d();
        clearTimeout(tid);
      };
    },
    () => (next: any) => (action: any) => {
      c(action);
      return next(action);
    }
  ];
  const { result } = renderHook(() =>
    useEnhancedReducer(
      fakeContextName,
      storePrototype.state,
      {
        set(state, payload: { count: number; delay?: number }) {
          return { ...state, count: payload.count };
        },
        more(state) {
          return { ...state, count: state.count + 1 };
        }
      },
      middlewares
    )
  );
  act(() => {
    result.current[1].more();
  });
  expect(result.current[0].count).toBe(2);
  act(() => {
    const cancel = result.current[1].more({ delay: 1000 });
    result.current[1].set({ count: 3 });
    jest.runAllTimers();
    cancel();
  });
  expect(result.current[0].count).toBe(4);
  expect(d.mock.calls.length).toBe(1);
  expect(c.mock.calls.length).toBe(3);
});
