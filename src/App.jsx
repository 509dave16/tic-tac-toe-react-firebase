import styles from './App.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Components/Game/Game';

const size = 3;
ReactDOM.render(
  <Game size={size}/>,
  document.getElementById('app')
);