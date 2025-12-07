import { useEffect, useState } from "react";

export default function PWAControls() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const onUpdate = () => setUpdateAvailable(true);
    window.addEventListener("sw:updateavailable", onUpdate);
    return () => window.removeEventListener("sw:updateavailable", onUpdate);
  }, []);

  useEffect(() => {
    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const doUpdate = async () => {
    try {
      // @ts-ignore
      if (window.__sw_update) {
        // call update to skip waiting and activate
        await window.__sw_update();
        // reload page to apply new content
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const doInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice && choice.outcome === 'accepted') {
        console.log('PWA installed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!updateAvailable && !deferredPrompt) return null;

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 9999 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {updateAvailable && (
          <button
            onClick={doUpdate}
            style={{ background: '#059669', color: 'white', padding: '8px 12px', borderRadius: 8, border: 'none' }}
          >
            Update Available — Reload
          </button>
        )}
        {deferredPrompt && (
          <button
            onClick={doInstall}
            style={{ background: '#0ea5a4', color: 'white', padding: '8px 12px', borderRadius: 8, border: 'none' }}
          >
            Install App
          </button>
        )}
      </div>
    </div>
  );
}
