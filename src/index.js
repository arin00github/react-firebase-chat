import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { storeWithMiddleWare } from './redux/store';
import rootReducers from './redux';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={storeWithMiddleWare(rootReducers)}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
    
  </React.StrictMode>,
  document.getElementById('root')
);


