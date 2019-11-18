import React, { useContext } from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { storePrototype, Root } from './__fixtures__/base';
import setup, { getContainer } from './__fixtures__/setup';
import { createContext } from '../src/index';
import initDevtools from '../src/devtools';

setup();

test('init & send', () => {
  const fakeInit = jest.fn();
  const fakeSend = jest.fn();

  initDevtools({
    devToolsExtension: {
      connect: () => ({
        init: fakeInit,
        send: fakeSend
      })
    }
  });
  expect(fakeInit.mock.calls.length).toBe(1);
  const container = getContainer();
  const context = createContext({ ...storePrototype });

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

  const button = container.querySelector('[data-testid="button"]');
  act(() => {
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(fakeSend.mock.calls.length).toBe(1);
  expect(fakeSend.mock.calls[0][0].payload.count).toBe(3);
});
