import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {registerOrbiServiceWorker} from './pwa.ts';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

window.addEventListener(
  'load',
  () => {
    void registerOrbiServiceWorker();
  },
  {once: true},
);
