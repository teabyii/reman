import React, { ReactNode, useContext } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { renderHook, act as actHook } from '@testing-library/react-hooks';
import Provider, {
  createContext,
  useEnhancedReducer,
  providers
} from './index';

jest.useFakeTimers();

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

const storePrototype = {
  state: { count: 1 },
  reducers: {
    set(state: any, { count }: { count: number }) {
      return { ...state, count };
    }
  }
};

function Root(props: { children: ReactNode }) {
  return <Provider>{props.children}</Provider>;
}

test('base', () => {
  const context = createContext(storePrototype);
  expect(providers.length).toBe(1);

  function Case() {
    const { state, dispatch } = useContext(context);
    return (
      <>
        <div data-testid="divide">{state.count}</div>
        <button data-testid="button" onClick={() => dispatch.set({ count: 3 })}>
          点击
        </button>
      </>
    );
  }

  act(() => {
    render(
      <Root>
        <Case />
      </Root>,
      container
    );
  });

  expect(container.querySelector('[data-testid="divide"]')!.textContent).toBe(
    '1'
  );
  const button = container.querySelector('[data-testid="button"]');
  act(() => {
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(container.querySelector('[data-testid="divide"]')!.textContent).toBe(
    '3'
  );
});

test('useEnhancedReducer', () => {
  const { result } = renderHook(() =>
    useEnhancedReducer(storePrototype.state, storePrototype.reducers)
  );

  expect(result.current[0].count).toBe(1);
  expect(typeof result.current[1].set).toBe('function');
  actHook(() => {
    result.current[1].set({ count: 4 });
  });
  expect(result.current[0].count).toBe(4);
});

test('meaningless reducers', () => {
  const { result } = renderHook(() =>
    useEnhancedReducer({}, { meaninglessValue: 1 } as any)
  );
  expect(() => {
    result.current[1].meaninglessValue();
  }).not.toThrow();
});

test('middlewares', () => {
  const first = jest.fn();
  const second = jest.fn();
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
      storePrototype.state,
      storePrototype.reducers,
      middlewares
    )
  );
  actHook(() => {
    result.current[1].set({ count: 4 });
  });
  expect(first).toHaveBeenCalledBefore(second);
  expect(first.mock.calls.length).toBe(1);
  expect(first.mock.calls[0][0].count).toBe(1);
  expect(second.mock.calls.length).toBe(1);
  expect(second.mock.calls[0][0].count).toBe(4);
});

test('empty middlewares', () => {
  const { result } = renderHook(() =>
    useEnhancedReducer(storePrototype.state, storePrototype.reducers, [])
  );
  actHook(() => {
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
  actHook(() => {
    result.current[1].more();
  });
  expect(result.current[0].count).toBe(2);
  actHook(() => {
    const cancel = result.current[1].more({ delay: 1000 });
    result.current[1].set({ count: 3 });
    jest.runAllTimers();
    cancel();
  });
  expect(result.current[0].count).toBe(4);
  expect(d.mock.calls.length).toBe(1);
  expect(c.mock.calls.length).toBe(3);
});
