import React, { useContext } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { storePrototype, Root } from './__fixtures__/base';
import { createContext } from '../src/index';
import { providers } from '../src/provider';

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

test('base', () => {
  const middlewareCall = jest.fn();
  const context = createContext({
    ...storePrototype,
    middlewares: [
      () => (next: any) => (action: any) => {
        middlewareCall(action);
        const result = next(action);
        return result;
      }
    ]
  });
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
  expect(middlewareCall.mock.calls.length).toBe(1);
  expect(middlewareCall.mock.calls[0][0].type).toBe('set');
  expect(middlewareCall.mock.calls[0][0].payload.count).toBe(3);
});
