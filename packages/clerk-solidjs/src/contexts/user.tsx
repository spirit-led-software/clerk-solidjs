import { UserResource } from '@clerk/types';
import { createMemo } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [UserContextProvider, useUserContext] =
  createContextProviderAndHook(
    'UserProvider',
    (props: { user: UserResource | null | undefined }) => {
      return createMemo(() => props.user);
    }
  );
