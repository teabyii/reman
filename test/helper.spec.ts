import { merge } from '../src/helper';

test('merge useContext', () => {
  const props = merge(() => ({ a: 1 }), () => ({ b: 2 }), () => ({ c: 3 }))();
  expect(props.a).toBe(1);
  expect(props.b).toBe(2);
  expect(props.c).toBe(3);
});
