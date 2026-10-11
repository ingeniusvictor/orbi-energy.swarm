import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const buildSha = process.env.ORBI_BUILD_SHA?.trim() || 'local-development';
  const productVersion =
    process.env.npm_package_version?.trim() || '0.0.0-local';

  return {
    base: process.env.ORBI_PUBLIC_BASE || '/',
    define: {
      __ORBI_BUILD_SHA__: JSON.stringify(buildSha),
      __ORBI_PRODUCT_VERSION__: JSON.stringify(productVersion),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
