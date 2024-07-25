import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.config';
import { base64Loader } from './base64loader';

export default defineConfig({
  plugins: [base64Loader, crx({ manifest })]
});
