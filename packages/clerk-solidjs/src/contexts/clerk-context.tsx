import type { ClientResource, InitialState, Resources } from '@clerk/types';
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  JSXElement
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { IsomorphicClerk } from '../isomorphic-clerk';
import type { IsomorphicClerkOptions } from '../types';
import { deriveState } from '../utils/derive-state';
import { AuthContextProvider } from './auth';
import { ClientContextProvider } from './client';
import { IsomorphicClerkContextProvider } from './isomorphic-clerk';
import { OrganizationContextProvider } from './organization';
import { SessionContextProvider } from './session';
import { UserContextProvider } from './user';

type ClerkContextProvider = {
  isomorphicClerkOptions: IsomorphicClerkOptions;
  initialState: InitialState | undefined;
  children: JSXElement;
};

export type ClerkContextProviderState = Resources;

export function ClerkContextProvider(
  props: ClerkContextProvider
): JSX.Element | null {
  const { isomorphicClerk: clerk, loaded: clerkLoaded } =
    useLoadedIsomorphicClerk(() => props.isomorphicClerkOptions);

  const [state, setState] = createStore<ClerkContextProviderState>({
    client: clerk().client as ClientResource,
    session: clerk().session,
    user: clerk().user,
    organization: clerk().organization
  });
  createEffect(() => {
    return clerk().addListener((e) => setState({ ...e }));
  });

  const derivedState = createMemo(() =>
    deriveState(clerkLoaded(), state, props.initialState)
  );

  return (
    // @ts-expect-error - IsomorphicClerk and Loaded clerk are the same
    <IsomorphicClerkContextProvider clerk={clerk()}>
      <ClientContextProvider client={clerk().client}>
        <SessionContextProvider session={derivedState().session}>
          <OrganizationContextProvider
            organization={derivedState().organization}
          >
            <AuthContextProvider
              userId={derivedState().userId}
              sessionId={derivedState().sessionId}
              actor={derivedState().actor}
              orgId={derivedState().orgId}
              orgRole={derivedState().orgRole}
              orgSlug={derivedState().orgSlug}
              orgPermissions={derivedState().orgPermissions}
            >
              <UserContextProvider user={derivedState().user}>
                {props.children}
              </UserContextProvider>
            </AuthContextProvider>
          </OrganizationContextProvider>
        </SessionContextProvider>
      </ClientContextProvider>
    </IsomorphicClerkContextProvider>
  );
}

const useLoadedIsomorphicClerk = (
  options: Accessor<IsomorphicClerkOptions>
) => {
  const [loaded, setLoaded] = createSignal(false);
  const isomorphicClerk = createMemo(() =>
    IsomorphicClerk.getOrCreateInstance(options())
  );

  createEffect(() => {
    void isomorphicClerk().__unstable__updateProps({
      appearance: options().appearance
    });
  });

  createEffect(() => {
    void isomorphicClerk().__unstable__updateProps({ options: options() });
  });

  createEffect(() => {
    isomorphicClerk().addOnLoaded(() => setLoaded(true));
  });

  createEffect(() => {
    return IsomorphicClerk.clearInstance();
  });

  return { isomorphicClerk, loaded };
};
