import clerkJsPackage from '@clerk/clerk-js/package.json' with { type: 'json' };
import { defineConfig } from 'tsup';
import * as preset from 'tsup-preset-solid';
import thisPackage from './package.json' with { type: 'json' };

export default defineConfig((config) => {
  const watching = !!config.watch;

  const parsed = preset.parsePresetOptions(
    {
      entries: [
        {
          entry: 'src/index.ts'
        },
        {
          name: 'errors',
          entry: 'src/errors.ts'
        },
        {
          name: 'server',
          entry: 'src/server/index.ts',
          server_entry: true
        }
      ],
      modify_esbuild_options: (options) => ({
        ...options,
        define: {
          ...options.define,
          PACKAGE_NAME: `"${thisPackage.name}"`,
          PACKAGE_VERSION: `"${thisPackage.version}"`,
          JS_PACKAGE_VERSION: `"${clerkJsPackage.version}"`,
          __DEV__: `${watching}`
        }
      }),
      drop_console: !watching,
      cjs: true
    },
    watching
  );

  if (!watching) {
    const packageFields = preset.generatePackageExports(parsed);
    preset.writePackageJson(packageFields);
  }

  return preset.generateTsupOptions(parsed);
});
