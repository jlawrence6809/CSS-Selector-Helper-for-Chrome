import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Store from './state/Store';
import { MainPage } from './components/MainPage';

const App = () => {
  return (<Store>
      <MainPage></MainPage>
  </Store>);
};

export default App;
