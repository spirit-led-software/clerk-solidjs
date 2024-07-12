/**
 * Vite does not define `global` by default
 * One workaround is to use the `define` config prop
 * https://vitejs.dev/config/#define
 * We are solving this in the SDK level to reduce setup steps.
 */
if (typeof window !== 'undefined' && !window.global) {
  // @ts-ignore
  window.global = typeof global === 'undefined' ? window : global;
}

export {};
