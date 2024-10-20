import React, { FC } from 'react';
import ReactDOM from 'react-dom/client';
import RoutesComponent from './routes';

import "./index.css"

const App:FC = () => {
  return (
    <RoutesComponent />
  );
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
