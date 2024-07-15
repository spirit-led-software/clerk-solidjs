import { UserResource } from '@clerk/types';
import { Accessor } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [UserContextProvider, useUserContext] =
  createContextProviderAndHook(
    'UserProvider',
    (props: { user: Accessor<UserResource | null | undefined> }) => {
      return props.user;
    }
  );
