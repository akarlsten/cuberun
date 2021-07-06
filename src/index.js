import React from 'react';
import ReactDOM from 'react-dom';

import './styles/normalize.css'
import './styles/index.css';

import CubeWorld from './components/CubeWorld';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CubeWorld bgColor='#141622' />
  </React.StrictMode>
)