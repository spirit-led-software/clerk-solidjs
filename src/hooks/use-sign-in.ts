import { eventMethodCalled } from '@clerk/shared/telemetry';
import { createEffect, createMemo } from 'solid-js';
import { useClientContext } from '../contexts/client';
import { useIsomorphicClerkContext } from '../contexts/isomorphic-clerk';
import { IsomorphicClerk } from '../isomorphic-clerk';
import { useAssertWrappedByClerkProvider } from './use-assert-wrapped-by-clerk-provider';

export const useSignIn = () => {
  useAssertWrappedByClerkProvider('useSignIn');

  const isomorphicClerk = useIsomorphicClerkContext();
  const client = useClientContext();

  createEffect(() => {
    isomorphicClerk().telemetry?.record(eventMethodCalled('useSignIn'));
  });

  const isLoaded = createMemo(() => !!client());
  const signIn = createMemo(() => client()?.signIn);

  const setActive = (params: Parameters<IsomorphicClerk['setActive']>[0]) => {
    return isomorphicClerk()?.setActive(params);
  };

  return {
    isLoaded,
    signIn,
    setActive
  };
};
