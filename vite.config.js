import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite
// Este archivo le dice a Vite cómo procesar el proyecto
export default defineConfig({
  plugins: [react()],
});