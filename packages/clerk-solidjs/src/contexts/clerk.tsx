import { isPublishableKey } from '@clerk/shared/keys';
import { createEffect, JSX, splitProps } from 'solid-js';
import { errorThrower } from '../errors/error-thrower';
import { multipleClerkProvidersError } from '../errors/messages';
import type { ClerkProviderProps } from '../types';
import { withMaxAllowedInstancesGuard } from '../utils';
import { ClerkContextProvider } from './clerk-context';

function ClerkProviderBase(props: ClerkProviderProps): JSX.Element {
  const [local, restIsomorphicClerkOptions] = splitProps(props, [
    'initialState',
    'children'
  ]);

  createEffect(() => {
    if (!restIsomorphicClerkOptions.Clerk) {
      if (!restIsomorphicClerkOptions.publishableKey) {
        errorThrower.throwMissingPublishableKeyError();
      } else if (
        restIsomorphicClerkOptions.publishableKey &&
        !isPublishableKey(restIsomorphicClerkOptions.publishableKey)
      ) {
        errorThrower.throwInvalidPublishableKeyError({
          key: restIsomorphicClerkOptions.publishableKey
        });
      }
    }
  });

  return (
    <ClerkContextProvider
      initialState={local.initialState}
      isomorphicClerkOptions={restIsomorphicClerkOptions}
    >
      {local.children}
    </ClerkContextProvider>
  );
}

const ClerkProvider = withMaxAllowedInstancesGuard(
  ClerkProviderBase,
  'ClerkProvider',
  multipleClerkProvidersError
);

export { ClerkProvider };
