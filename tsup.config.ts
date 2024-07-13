// Adapted from https://github.com/corvudev/corvu/blob/main/packages/accordion/tsup.config.ts

import clerkJsPackage from '@clerk/clerk-js/package.json' with { type: 'json' };
import { solidPlugin } from 'esbuild-plugin-solid';
import type { Options } from 'tsup';
import { defineConfig } from 'tsup';
import thisPackage from './package.json' with { type: 'json' };

function generateConfig(config: {
  watching: boolean;
  format: 'esm' | 'cjs';
  jsx: boolean;
  publish?: boolean;
}): Options {
  const { watching, format, jsx, publish } = config;

  return {
    target: 'esnext',
    platform: 'browser',
    format,
    clean: true,
    dts: format === 'esm' && !jsx,
    entry: {
      index: 'src/index.ts',
      server: 'src/server/index.ts',
      errors: 'src/errors.ts'
    },
    outDir: 'dist/',
    treeshake: { preset: 'smallest' },
    replaceNodeEnv: true,
    esbuildOptions(options) {
      if (jsx) {
        options.jsx = 'preserve';
      }
      options.chunkNames = '[name]/[hash]';
      options.drop = ['console', 'debugger'];
    },
    outExtension() {
      if (jsx) {
        return { js: '.jsx' };
      } else {
        return {};
      }
    },
    esbuildPlugins: !jsx ? [solidPlugin({ solid: { generate: 'dom' } })] : [],
    define: {
      PACKAGE_NAME: `"${thisPackage.name}"`,
      PACKAGE_VERSION: `"${thisPackage.version}"`,
      JS_PACKAGE_VERSION: `"${clerkJsPackage.version}"`,
      __DEV__: `${watching}`
    },
    onSuccess: publish ? 'bun run publish:local' : undefined
  };
}

export default defineConfig((config) => {
  const watching = !!config.watch;
  const shouldPublish = !!config.env?.publish;

  return [
    generateConfig({
      watching,
      format: 'esm',
      jsx: false
    }),
    generateConfig({
      watching,
      format: 'esm',
      jsx: true,
      publish: shouldPublish // publish on last config
    })
  ];
});
