import type { ClientResource, InitialState, Resources } from '@clerk/types';
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  JSXElement,
  on,
  onCleanup,
  untrack
} from 'solid-js';
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

export function ClerkContextProvider(props: ClerkContextProvider): JSX.Element {
  const { isomorphicClerk: clerk, loaded: clerkLoaded } =
    useLoadedIsomorphicClerk(() => props.isomorphicClerkOptions);

  const [state, setState] = createSignal<ClerkContextProviderState>({
    client: clerk().client as ClientResource,
    session: clerk().session,
    user: clerk().user,
    organization: clerk().organization
  });
  createEffect(() => {
    onCleanup(clerk().addListener((e) => setState({ ...e })));
  });

  const derivedState = createMemo(() =>
    deriveState(clerkLoaded(), state(), props.initialState)
  );

  // Hacky way to get clerk to update when the loading state changes
  const clerkCtx = () => (clerkLoaded() ? clerk() : clerk());

  return (
    // @ts-expect-error - IsomorphicClerk and Loaded clerk are the same
    <IsomorphicClerkContextProvider clerk={clerkCtx}>
      <ClientContextProvider client={() => state().client}>
        <SessionContextProvider session={() => derivedState().session}>
          <OrganizationContextProvider
            organization={() => derivedState().organization}
          >
            <AuthContextProvider
              userId={() => derivedState().userId}
              sessionId={() => derivedState().sessionId}
              actor={() => derivedState().actor}
              orgId={() => derivedState().orgId}
              orgRole={() => derivedState().orgRole}
              orgSlug={() => derivedState().orgSlug}
              orgPermissions={() => derivedState().orgPermissions}
            >
              <UserContextProvider user={() => derivedState().user}>
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
    IsomorphicClerk.getOrCreateInstance(untrack(options))
  );

  createEffect(
    on(
      () => options().appearance,
      (appearance) => {
        void isomorphicClerk().__unstable__updateProps({
          appearance
        });
      }
    )
  );

  createEffect(
    on(options, (options) => {
      void isomorphicClerk().__unstable__updateProps({ options });
    })
  );

  createEffect(() => {
    isomorphicClerk().addOnLoaded(() => {
      setLoaded(true);
    });
    onCleanup(() => {
      IsomorphicClerk.clearInstance();
    });
  });

  return { isomorphicClerk, loaded };
};
