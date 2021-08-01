import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import { StateProvider } from './components/ContextAPI/StateProvider';
import reducer, { initialState } from './components/ContextAPI/Reducer';

ReactDOM.render(
  
    <Router>
      <StateProvider reducer = {reducer} initialState = {initialState}>
        <App />
      </StateProvider>
    </Router>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
