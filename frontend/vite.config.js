import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // Barcha hostlarga (shu jumladan ngrok'ga) ruxsat berish
    headers: {
      'ngrok-skip-browser-warning': 'true' // ngrok warning sahifasini o'tkazib yuborish
    }
  }
})