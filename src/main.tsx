
  import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById("root")!).render(<App />);

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New service worker available. Refresh to update.');
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
  },
});

let deferredPrompt: any = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  console.log('beforeinstallprompt fired');
  // Optional: expose it to app UI for custom install button
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
});

window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
});

export function promptPWAInstall() {
  if (!deferredPrompt) {
    console.warn('PWA install prompt not available yet.');
    return;
  }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult: any) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted PWA install');
    } else {
      console.log('User dismissed PWA install');
    }
    deferredPrompt = null;
  });
}

export { updateSW };
  