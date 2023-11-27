import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChatAppContextProvider } from './context/ChatAppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChatAppContextProvider>
        <App/>
    </ChatAppContextProvider>
);

