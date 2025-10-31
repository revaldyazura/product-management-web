// src/App.js
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/common/ToastContainer';

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
      <ToastContainer />
    </ToastProvider>
  );
}

export default App;