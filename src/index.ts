import './polyfills';

import { setErrorThrowerOptions } from './errors/error-thrower';

export * from './components';
export * from './contexts';

export * from './hooks';
export type {
  BrowserClerk,
  ClerkProp,
  ClerkProviderProps,
  HeadlessBrowserClerk
} from './types';

setErrorThrowerOptions({ packageName: PACKAGE_NAME });
