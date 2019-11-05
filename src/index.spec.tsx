import React, { ReactNode, useContext } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Provider, { createContext } from './index';

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
