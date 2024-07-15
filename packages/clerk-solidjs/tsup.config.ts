import clerkJsPackage from '@clerk/clerk-js/package.json' with { type: 'json' };
import { defineConfig } from 'tsup';
import * as preset from 'tsup-preset-solid';
import thisPackage from './package.json' with { type: 'json' };

const CI =
  process.env['CI'] === 'true' ||
  process.env['GITHUB_ACTIONS'] === 'true' ||
  process.env['CI'] === '"1"' ||
  process.env['GITHUB_ACTIONS'] === '"1"';

export default defineConfig((config) => {
  const watching = !!config.watch;
  const shouldPublish = !!config.env?.publish;

  const parsed = preset.parsePresetOptions(
    {
      entries: [
        {
          entry: 'src/index.tsx',
          server_entry: true
        },
        {
          name: 'errors',
          entry: 'src/errors.ts'
        },
        {
          name: 'server',
          entry: 'src/server/index.ts'
        }
      ],
      cjs: true,
      drop_console: !watching,
      modify_esbuild_options: (options) => {
        options.bundle = true;
        options.treeShaking = true;
        options.external = [
          ...(options.external ?? []),
          ...Object.keys(thisPackage.peerDependencies)
        ];
        options.define = {
          ...options.define,
          PACKAGE_NAME: `"${thisPackage.name}"`,
          PACKAGE_VERSION: `"${thisPackage.version}"`,
          JS_PACKAGE_VERSION: `"${clerkJsPackage.version}"`,
          __DEV__: `${watching}`
        };

        return options;
      },
      out_dir: 'dist'
    },
    watching
  );

  if (!watching && !CI) {
    const packageFields = preset.generatePackageExports(parsed);
    preset.writePackageJson(packageFields);
  }

  const options = preset.generateTsupOptions(parsed);
  if (shouldPublish) {
    options[options.length - 1].onSuccess = ' && pnpm run publish:local';
  }

  return options;
});
