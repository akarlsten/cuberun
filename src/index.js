import React from 'react';
import ReactDOM from 'react-dom';

import './styles/normalize.css'
import './styles/index.css';

import CubeWorld from './components/CubeWorld';

ReactDOM.render(
  <React.StrictMode>
    <CubeWorld bgColor='#141622' />
  </React.StrictMode>,
  document.getElementById('root')
);
