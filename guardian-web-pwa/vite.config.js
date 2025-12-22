import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 3001, // App do Responsável
        open: true
    },
    build: {
        outDir: 'dist'
    }
})
