import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Store from './state/Store';
import { MainPage } from './components/MainPage';
import { PlusDarkTheme } from './components/Theme';

const App = () => {
  return (<Store>
    <div className={PlusDarkTheme('App')}>
      <MainPage></MainPage>
    </div>
  </Store>);
};

export default App;
