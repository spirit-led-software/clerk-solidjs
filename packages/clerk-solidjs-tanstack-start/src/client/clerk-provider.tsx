import { ScriptOnce, useRouteContext } from '@tanstack/solid-router';
import { ClerkProvider as SolidClerkProvider } from 'clerk-solidjs';

import { destructure } from '@solid-primitives/destructure';
import { createMemo, JSX, mergeProps, splitProps } from 'solid-js';
import { isClient } from '../utils';
import { ClerkOptionsProvider } from './options-context';
import { TanstackStartClerkProviderProps } from './types';
import { useAwaitableNavigate } from './use-awaitable-navigate';
import { mergeWithPublicEnvs, pickFromClerkInitState } from './utils';

export * from 'clerk-solidjs';

const SDK_METADATA = {
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION
};

export function ClerkProvider(
  props: TanstackStartClerkProviderProps
): JSX.Element {
  const [local, rest] = splitProps(props, ['children']);

  const awaitableNavigate = useAwaitableNavigate();
  const routerContext = useRouteContext({ strict: false });

  const clerkInitState = createMemo(() =>
    isClient()
      ? (window as any).__clerk_init_state
      : routerContext()?.clerkInitialState
  );

  const { clerkSsrState, ...restInitState } = destructure(() =>
    pickFromClerkInitState(clerkInitState()?.__internal_clerk_state)
  );

  const mergedProps = mergeProps({
    ...mergeWithPublicEnvs(restInitState),
    ...rest
  });

  return (
    <>
      <ScriptOnce>{`window.__clerk_init_state = ${JSON.stringify(routerContext()?.clerkInitialState)};`}</ScriptOnce>
      <ClerkOptionsProvider options={mergedProps}>
        <SolidClerkProvider
          initialState={clerkSsrState()}
          sdkMetadata={SDK_METADATA}
          routerPush={(to: string) => awaitableNavigate(to, { replace: false })}
          routerReplace={(to: string) =>
            awaitableNavigate(to, { replace: true })
          }
          {...mergedProps}
        >
          {local.children}
        </SolidClerkProvider>
      </ClerkOptionsProvider>
    </>
  );
}
ClerkProvider.displayName = 'ClerkProvider';
