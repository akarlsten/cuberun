import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import CubeWorld from './components/CubeWorld';
import reportWebVitals from './util/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <CubeWorld bgColor='#141622' />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
