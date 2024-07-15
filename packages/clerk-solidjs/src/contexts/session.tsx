import { SessionResource } from '@clerk/types';
import { Accessor } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [SessionContextProvider, useSessionContext] =
  createContextProviderAndHook(
    'SessionProvider',
    (props: { session: Accessor<SessionResource | null | undefined> }) => {
      return props.session;
    }
  );
