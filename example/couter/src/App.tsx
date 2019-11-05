import React from 'react';
import './App.css';
import Result from './components/Result';
import Input from './components/Input';
import Increase from './components/Increase';
import Decrease from './components/Decrease';
import Provider from 'reable';

function App() {
  return (
    <Provider>
      <div className="App">
        <Result />
        <Input />
        <Increase />
        <Decrease />
      </div>
    </Provider>
 );
}

export default App;
