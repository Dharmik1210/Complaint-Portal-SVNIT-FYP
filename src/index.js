import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// context
import { AuthContextProvider } from './context/AuthContext';
import { AppProvider } from './Context';

// styles
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      {/* <AppProvider> */}
      <App />
      {/* </AppProvider> */}
    </AuthContextProvider>
  </React.StrictMode>
);
