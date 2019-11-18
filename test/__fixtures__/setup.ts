import { unmountComponentAtNode } from 'react-dom';

let container: HTMLDivElement;

export default function setup() {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
  });
}

export function getContainer() {
  return container;
}
