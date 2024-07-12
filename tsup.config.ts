import clerkJsPackage from '@clerk/clerk-js/package.json' with { type: 'json' };
import { defineConfig } from 'tsup';
import thisPackage from './package.json' with { type: 'json' };

export default defineConfig((config) => {
  const isWatch = !!config.watch;
  const shouldPublish = !!config.env?.publish;

  return {
    entry: {
      index: 'src/index.ts',
      server: 'src/server/index.ts',
      errors: 'src/errors.ts'
    },
    dts: true,
    format: ['esm', 'cjs'],
    bundle: true,
    clean: true,
    esbuildOptions: (options) => {
      options.jsx = 'preserve';
      options.jsxImportSource = 'solid-js';
    },
    external: ['solid-js', '@solidjs/start'],
    define: {
      PACKAGE_NAME: `"${thisPackage.name}"`,
      PACKAGE_VERSION: `"${thisPackage.version}"`,
      JS_PACKAGE_VERSION: `"${clerkJsPackage.version}"`,
      __DEV__: `${isWatch}`
    },
    onSuccess: shouldPublish ? 'bun run publish:local' : undefined
  };
});
