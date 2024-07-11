import { createMemo } from 'solid-js';
import { useUserContext } from '../contexts/user';
import { useAssertWrappedByClerkProvider } from './use-assert-wrapped-by-clerk-provider';

export function useUser() {
  useAssertWrappedByClerkProvider('useUser');

  const user = useUserContext();

  const isLoaded = createMemo(() => user() !== undefined);
  const isSignedIn = createMemo(() => user() !== null);

  return {
    isLoaded,
    isSignedIn,
    user
  };
}
