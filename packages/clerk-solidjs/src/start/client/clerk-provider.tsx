import { destructure } from '@solid-primitives/destructure';
import { createMemo, JSX, onMount, splitProps } from 'solid-js';
import { getRequestEvent, isServer } from 'solid-js/web';
import { ClerkProvider as SolidClerkProvider } from '../../contexts/clerk';
import type { SolidStartClerkProviderProps } from './types';
import { useAwaitableNavigate } from './use-awaitable-navigate';
import { mergeWithPublicEnvs, pickFromClerkInitState } from './utils';

export function ClerkProvider(
  props: SolidStartClerkProviderProps
): JSX.Element {
  const [local, providerProps] = splitProps(props, ['children']);
  const awaitableNavigate = useAwaitableNavigate();

  const clerkInitState = () =>
    isServer
      ? getRequestEvent()?.locals.clerkInitialState
      : (window as any).__clerk_init_state;

  const states = createMemo(() =>
    pickFromClerkInitState(clerkInitState()?.__internal_clerk_state)
  );
  const { clerkSsrState } = destructure(states);

  const mergedProps = () => ({
    ...mergeWithPublicEnvs(states()),
    ...providerProps
  });

  onMount(() => {
    (window as any).__clerk_init_state = clerkInitState();
  });

  return (
    <SolidClerkProvider
      initialState={clerkSsrState()}
      routerPush={(to: string) =>
        awaitableNavigate(to, {
          replace: false
        })
      }
      routerReplace={(to: string) =>
        awaitableNavigate(to, {
          replace: true
        })
      }
      {...mergedProps()}
    >
      {local.children}
    </SolidClerkProvider>
  );
}
