import clerkJsPackage from '@clerk/clerk-js/package.json' with { type: 'json' };
import { defineConfig } from 'tsup';
import thisPackage from './package.json' with { type: 'json' };

export default defineConfig((overrideOptions) => {
  const isWatch = !!overrideOptions.watch;

  return {
    entry: {
      index: 'src/index.ts',
      errors: 'src/errors.ts'
    },
    dts: true,
    format: ['cjs', 'esm'],
    bundle: true,
    clean: true,
    minify: true,
    sourcemap: true,
    external: ['solid-js', '@solidjs/start'],
    define: {
      PACKAGE_NAME: `"${thisPackage.name}"`,
      PACKAGE_VERSION: `"${thisPackage.version}"`,
      JS_PACKAGE_VERSION: `"${clerkJsPackage.version}"`,
      __DEV__: `${isWatch}`
    }
  };
});
