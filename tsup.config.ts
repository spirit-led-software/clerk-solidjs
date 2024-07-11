import { defineConfig } from 'tsup';

import clerkJsPackage from '@clerk/clerk-js/package.json' with { type: 'json' };
import thisPackage from './package.json' with { type: 'json' };

export default defineConfig((overrideOptions) => {
  const isWatch = !!overrideOptions.watch;
  const shouldPublish = !!overrideOptions.env?.publish;

  return {
    entry: {
      index: 'src/index.ts',
      errors: 'src/errors.ts'
    },
    dts: true,
    onSuccess: shouldPublish ? 'npm run publish:local' : undefined,
    format: ['cjs', 'esm'],
    bundle: true,
    clean: true,
    minify: false,
    sourcemap: true,
    external: ['solid-js'],
    define: {
      PACKAGE_NAME: `"${thisPackage.name}"`,
      PACKAGE_VERSION: `"${thisPackage.version}"`,
      JS_PACKAGE_VERSION: `"${clerkJsPackage.version}"`,
      __DEV__: `${isWatch}`
    }
  };
});
