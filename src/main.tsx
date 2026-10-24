import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {registerOrbiServiceWorker} from './pwa.ts';
import './styles/index.css';
import './styles/androidImmersive.css';
import './styles/analogJoystick.css';
import './styles/webImmersive.css';
import './styles/ux10PremiumOverlays.css';
import './styles/ux10CinematicLaunch.css';
import './styles/ux11Tactics.css';
import './styles/ux11Codex.css';
import './styles/ux11Status3D.css';

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
