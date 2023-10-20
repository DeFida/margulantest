import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './component/App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from "react-router-dom";
import { AppProvider } from './contexts/AppContext';
import { UserProvider } from './contexts/UserContext/UserContext';
import { HostProvider } from './contexts/HostContext/HostContext';
import { SocketProvider } from './contexts/SocketContext/SocketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <UserProvider>
          <SocketProvider serverUrl="http://localhost:3001">
            <HostProvider>
              <App />
            </HostProvider>
          </SocketProvider>
        </UserProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
