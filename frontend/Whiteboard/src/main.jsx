import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App/>
  </Router>
)
