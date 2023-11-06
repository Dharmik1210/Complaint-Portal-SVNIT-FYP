import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// context
import { AuthContextProvider } from './context/AuthContext';

// styles
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
