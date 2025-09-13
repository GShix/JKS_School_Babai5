import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  //explain the purpose of the server proxy configuration
  // The server proxy configuration is used to redirect API requests from the frontend to the backend server
  // during development. This allows the frontend to communicate with the backend without running into CORS issues.
  // It proxies requests made to '/api' to 'http://localhost:4000', which is where the backend server is expected to run. 
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
