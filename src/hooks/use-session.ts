import { createMemo } from 'solid-js';
import { useSessionContext } from '../contexts/session';
import { useAssertWrappedByClerkProvider } from './use-assert-wrapped-by-clerk-provider';

export const useSession = () => {
  useAssertWrappedByClerkProvider('useSession');

  const session = useSessionContext();

  const isLoaded = createMemo(() => session() !== undefined);
  const isSignedIn = createMemo(() => session() !== null);

  return {
    isLoaded,
    isSignedIn,
    session
  };
};
