import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 5173,
		allowedHosts: [
			'forth-campaign-greek-television.trycloudflare.com',
		],
		hmr: {
			protocol: 'wss',
			host: 'forth-campaign-greek-television.trycloudflare.com',
			clientPort: 443,
		},
	},
})
