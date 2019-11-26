# Reman

[![NPM version][npm-badge]][npm-url]
[![Build status][travis-badge]][travis-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Commitizen Friendly][commitizen-badge]][commitizen-url]

A easy & pocket State Handler with React Context instead of Redux

## Installation

```sh
npm install reman 
# or
yarn add reman
```

## Getting Started

First of all, **Reman** is built with react hooks in react@16.8, it works wonderfully for the `Function Component`, but not good for `Class Component`. However, you can use `Reman.connect` to adapt `Class Component`.

In **Reman**, we use `context` to replace `store` in redux, and make up **reducers** just like [rematch][rematch-url], in the same time, you should organize business data with serveral contexts instead of the only one store.

### Step 1: Create context

A little like [Rematch][rematch-url], the **Context** brings together state, reducers, middlewares in one place. You just create context, and it works automatically.

```ts
import { createContext } from 'reman'

export default createContext({
  state: { // initial state
    count: 0
  },
  reducers: { // handle state changes with pure functions 
    increase(state) {
      return { ...state, count: state.count + 1 }
    },
    decrease(state) {
      return { ...state, count: state.count - 1 }
    },
    set(state, { count }: { count: number }) {
      return { ...state, count }
    }
  }
})
```

### Step 2: Use Provider

**Provider** should be your app's root element, it make sure your `Function Component` can respond to the change of state in context, also for multi-contexts.

```tsx
import { render } from 'react-dom'
import Provider from 'reman'
import App from './app'

render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### Step 3: Dispatch action

You should use `useContext` to get state & dispatch from the **Context** you created.

```tsx
import React, { useContext } from 'react'
import context from './context'

export default function App() {
  // use state & dispatch in context
  const { state, dispatch } = useContext(context)

  return (
    <div>
      <span>{state.count}</span>
      <button onClick={() => dispatch.increase()}>ADD MORE</button>
    </div>
  )
}
```

## Example

Check `example` dir for more details about useing.

## Development

First, clone repo and use `yarn` to install deps for testing.

```sh
yarn test # test 
```

## Thanks

- [Redux][redux-url]
- [Rematch][rematch-url]
- [Reinspect][reinspect-url]
- [Redux DevTools without Redux][redux-devtools-without-redux-url]

## TODO

- [x] test
- [x] middleware
- [x] connect
- [x] devtool
- [ ] component state injector

## License

Reman is published under the MIT license. See LICENSE for more information.

[npm-url]: https://npmjs.org/package/reman
[npm-badge]: http://img.shields.io/npm/v/reman.svg?style=flat
[travis-url]: https://travis-ci.org/teabyii/reman
[travis-badge]: http://img.shields.io/travis/teabyii/reman.svg?style=flat
[coverage-url]: https://coveralls.io/github/teabyii/reman
[coverage-badge]: http://img.shields.io/coveralls/teabyii/reman.svg?style=flat
[commitizen-url]: http://commitizen.github.io/cz-cli/
[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat
[redux-url]: https://github.com/reduxjs/redux
[rematch-url]: https://rematch.github.io/rematch/#
[redux-devtools-without-redux-url]: https://medium.com/@zalmoxis/redux-devtools-without-redux-or-how-to-have-a-predictable-state-with-any-architecture-61c5f5a7716f
[reinspect-url]: https://github.com/troch/reinspect
