import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
export default defineConfig({
  plugins: [
    {
      name: 'public-pages-asset-paths',
      enforce: 'pre',
      transform(source, id) {
        if (!id.endsWith('/CustomerOnboarding.tsx')) return null;
        return source.replace(/src="\/assets\/([^"]+)"/g, (_match, asset) =>
          'src={import.meta.env.BASE_URL + "assets/' + asset + '"}');
      }
    },
    react(),
    tailwindcss()
  ],
  base: process.env.GITHUB_PAGES === 'true' ? '/ProRiv-Isa-Onboarding/' : '/',
  build: { rollupOptions: { input: { presentation: path.resolve('presentation.html') } } },
  server: { host: '127.0.0.1', port: 3000 }
});