import clerkJsPackage from '@clerk/clerk-js/package.json' with { type: 'json' };
import solid from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import thisPackage from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [tsconfigPaths(), solid()],
  define: {
    PACKAGE_NAME: `"${thisPackage.name}"`,
    PACKAGE_VERSION: `"${thisPackage.version}"`,
    JS_PACKAGE_VERSION: `"${clerkJsPackage.version}"`
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./node_modules/@testing-library/jest-dom/vitest']
  },
  resolve: {
    conditions: ['development', 'browser']
  }
});
