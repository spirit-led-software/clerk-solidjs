import { Accessor } from 'solid-js';
import { IsomorphicClerk } from '../isomorphic-clerk';
import {
  ClerkInstanceContextProvider,
  useClerkInstanceContext
} from './clerk-instance';

export const IsomorphicClerkContextProvider = ClerkInstanceContextProvider;
export const useIsomorphicClerkContext =
  useClerkInstanceContext as unknown as () => Accessor<IsomorphicClerk>;
