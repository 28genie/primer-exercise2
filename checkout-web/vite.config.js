import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root,
  server: { port: 5174, strictPort: false }
});
