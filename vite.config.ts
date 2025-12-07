import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	server: {
		host: "::",
		port: 8080,
	},
	plugins: [
		react(),
		mode === "development" && componentTagger(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "placeholder.svg"],
			manifest: {
				name: "Isla Maré Resort",
				short_name: "IslaMaré",
				description: "Isla Maré Resort - Book tropical stays",
				theme_color: "#0ea5a4",
				icons: [
					{
						src: "/placeholder.svg",
						sizes: "192x192",
						type: "image/svg+xml"
					},
					{
						src: "/placeholder.svg",
						sizes: "512x512",
						type: "image/svg+xml"
					}
				]
			},
			workbox: {
				runtimeCaching: [
					// Don't cache Supabase API/auth requests — always network
					{
						urlPattern: new RegExp('https://.*\\.supabase\\.co/.*'),
						handler: 'NetworkOnly',
						options: {
							cacheName: 'supabase-network-only'
						}
					},
					{
						urlPattern: /\/(.*)/,
						handler: "NetworkFirst",
						options: {
							cacheName: "html-cache",
						}
					},
					{
						urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|webp)$/,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "asset-cache",
						}
					}
				]
			}
		})
	].filter(Boolean),
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
}));