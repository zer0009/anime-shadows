import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import './styles/global.css';


// const createFlame = () => {
//   const flameContainer = document.querySelector('.flame-container');
//   for (let i = 0; i < 5; i++) {
//       const flame = document.createElement('div');
//       flame.classList.add('flame');
//       flame.style.left = `${Math.random() * 100}%`;
//       flame.style.animationDelay = `${Math.random() * 2}s`;
//       flameContainer.appendChild(flame);
//   }
// };

// document.addEventListener('DOMContentLoaded', createFlame);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </React.StrictMode>
);
