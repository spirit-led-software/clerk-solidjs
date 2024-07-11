import { ClientResource } from '@clerk/types';
import { createMemo } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [ClientContextProvider, useClientContext] =
  createContextProviderAndHook(
    'ClientProvider',
    (props: { client: ClientResource | null | undefined }) => {
      return createMemo(() => props.client);
    }
  );
