import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure Vite outputs build files to 'dist'
    emptyOutDir: true, // Ensures old builds are removed before a new one
  }
});
