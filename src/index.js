import './index.less'
import 'antd/dist/antd.css';
import React from 'react'
import ReactDOM from 'react-dom'

import '@commons/interception'
import App from '@containers/app'

function render() {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

if(process.env.USE_MOCK_SERVICE && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(`./service-worker.js?mock-service-base=${process.env.MOCK_SERVICE_BASE}`, { scope: './' })
    .then(function (registration) {
      render();
    })
    .catch(function (error) {
      console.log('Service Worker Failed to Register', error);
    });
} else {
  console.log('Service Worker are not supported.');
  render();
}
