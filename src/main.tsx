import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register PWA service worker if available (vite-plugin-pwa provides virtual helper)
// Use Promise-based dynamic import to avoid top-level await which breaks some build targets
try {
	// @ts-ignore
	import('virtual:pwa-register')
		.then((mod) => {
			const registerSW = mod?.default;
			if (!registerSW) return;
			const updateSW = registerSW({
				onRegistered(r) {
					// r is the registration
				},
				onNeedRefresh() {
					try {
						window.dispatchEvent(new CustomEvent('sw:updateavailable'));
					} catch (e) {}
				}
			});

			// expose update function so UI can trigger it
			// @ts-ignore
			window.__sw_update = updateSW;
		})
		.catch(() => {
			// plugin not available in this environment
		});
} catch (e) {
	// ignore if plugin isn't installed yet
}

createRoot(document.getElementById("root")!).render(<App />);
