import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Forces Vite to use 5173. The backend rejects 5174.
    open: true,
  },
});
