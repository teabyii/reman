import React, {
  useContext,
  useImperativeHandle,
  useRef,
  forwardRef
} from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { createContext } from '../src/context';
import { connect } from '../src/connect';
import { storePrototype, Root } from './__fixtures__/base';
import { act } from 'react-dom/test-utils';

export interface RefHandlers {
  test: (i: number) => void;
}

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

test('connect', () => {
  const context = createContext(storePrototype);
  const d = jest.fn();
  const c = jest.fn();
  const useCustomizedContext = function(): [
    { count: number },
    { set: (payload: { count: number }) => void }
  ] {
    const { state, dispatch } = useContext(context);
    return [{ count: state.count }, { set: dispatch.set }];
  };
  const Case = forwardRef<RefHandlers, any>((props: any, ref) => {
    const { init, count, set, onClick } = props;
    d();
    useImperativeHandle(ref, () => ({
      test(input: number) {
        c(input);
      }
    }));

    return (
      <>
        <div data-testid="initial">{init}</div>
        <div data-testid="divide">{count}</div>
        <button data-testid="button" onClick={() => set({ count: 3 })}>
          点击
        </button>
        <button data-testid="ref" onClick={onClick}>
          点击
        </button>
      </>
    );
  });
  // Case.staticPropTest = true;
  const ConnectedCase = connect(
    useCustomizedContext,
    { forwardRef: true }
  )(Case);
  function Total() {
    const ref = useRef<RefHandlers>(null);
    const onClick = () => {
      if (ref.current) {
        ref.current.test(1);
      }
    };

    return <ConnectedCase ref={ref} init={2} onClick={onClick} />;
  }

  act(() => {
    render(
      <Root>
        <Total />
      </Root>,
      container
    );
  });

  // expect(ConnectedCase.staticPropTest);
  expect(container.querySelector('[data-testid="divide"]')!.textContent).toBe(
    '1'
  );
  expect(container.querySelector('[data-testid="initial"]')!.textContent).toBe(
    '2'
  );
  const button = container.querySelector('[data-testid="button"]');
  const refButton = container.querySelector('[data-testid="ref"]');
  act(() => {
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    refButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(c.mock.calls.length).toBe(1);
  expect(d.mock.calls.length).toBe(2);
  expect(container.querySelector('[data-testid="divide"]')!.textContent).toBe(
    '3'
  );
  act(() => {
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(d.mock.calls.length).toBe(2);
});
