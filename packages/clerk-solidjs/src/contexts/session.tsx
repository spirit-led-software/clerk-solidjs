import { SessionResource } from '@clerk/types';
import { createMemo } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [SessionContextProvider, useSessionContext] =
  createContextProviderAndHook(
    'SessionProvider',
    (props: { session: SessionResource | null | undefined }) => {
      return createMemo(() => props.session);
    }
  );
