import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'
import { app as expressApp } from './server/index.js'

export function cropguardExpressApiPlugin(): Plugin {
  return {
    name: 'cropguard-express-api',
    configureServer(server) {
      server.middlewares.use(expressApp)
    },
    configurePreviewServer(server) {
      server.middlewares.use(expressApp)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    cropguardExpressApiPlugin(),
  ],
})
