import React, {
  useContext,
  useImperativeHandle,
  useRef,
  forwardRef,
  Component
} from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { createContext } from '../src/context';
import { connect } from '../src/connect';
import { storePrototype, Root } from './__fixtures__/base';
import { act } from 'react-dom/test-utils';

export interface RefHandlers {
  set: (i: number) => void;
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

test('function component', () => {
  const context = createContext(storePrototype);
  const renderCount = jest.fn();
  const refCallCount = jest.fn();
  const useCustomizedContext = function(): [
    { count: number },
    { set: (payload: { count: number }) => void }
  ] {
    const { state, dispatch } = useContext(context);
    return [{ count: state.count }, { set: dispatch.set }];
  };
  const Case = forwardRef<RefHandlers, any>((props: any, ref) => {
    const { init, count, set, onClick } = props;
    renderCount();
    useImperativeHandle(ref, () => ({
      set(input: number) {
        refCallCount(input);
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
        ref.current.set(1);
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
  expect(refCallCount.mock.calls.length).toBe(1);
  expect(refCallCount.mock.calls[0][0]).toBe(1);
  expect(renderCount.mock.calls.length).toBe(2);
  expect(container.querySelector('[data-testid="divide"]')!.textContent).toBe(
    '3'
  );
  act(() => {
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(renderCount.mock.calls.length).toBe(2);
});

test('no forward', () => {
  const context = createContext(storePrototype);
  const Case = (props: { count: number }) => (
    <div data-testid="divide">{props.count}</div>
  );
  const ConnectedCase = connect(() => {
    const { state } = useContext(context);
    return [{ count: state.count }];
  })(Case);

  act(() => {
    render(
      <Root>
        <ConnectedCase />
      </Root>,
      container
    );
  });

  expect(container.querySelector('[data-testid="divide"]')!.textContent).toBe(
    '1'
  );
});

test('class component', () => {
  const renderCount = jest.fn();
  const refCallCount = jest.fn();
  class Case extends Component<any> {
    set(param: number) {
      refCallCount(param);
      this.props.set({ count: param });
    }

    render() {
      renderCount();
      return (
        <>
          <div data-testid="initial">{this.props.init}</div>
          <div data-testid="divide">{this.props.count}</div>;
          <button
            data-testid="button"
            onClick={() => this.props.set({ count: 3 })}
          >
            点击
          </button>
          <button data-testid="ref" onClick={this.props.onClick}>
            点击
          </button>
        </>
      );
    }
  }

  const context = createContext(storePrototype);
  const ConnectedCase = connect(
    () => {
      const { state, dispatch } = useContext(context);
      return [{ count: state.count }, { set: dispatch.set }];
    },
    {
      forwardRef: true
    }
  )(Case);
  function Total() {
    const ref = useRef<RefHandlers>(null);
    const onClick = () => {
      if (ref.current) {
        ref.current.set(10);
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
  });
  expect(renderCount.mock.calls.length).toBe(2);
  act(() => {
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(renderCount.mock.calls.length).toBe(2);
  act(() => {
    refButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(refCallCount.mock.calls.length).toBe(1);
  expect(refCallCount.mock.calls[0][0]).toBe(10);
  expect(container.querySelector('[data-testid="divide"]')!.textContent).toBe(
    '10'
  );
});
