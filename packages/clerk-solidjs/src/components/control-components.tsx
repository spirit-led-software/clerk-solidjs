import type {
  CheckAuthorizationWithCustomPermissions,
  HandleOAuthCallbackParams,
  OrganizationCustomPermissionKey,
  OrganizationCustomRoleKey
} from '@clerk/types';
import {
  createEffect,
  createMemo,
  JSX,
  ParentProps,
  Show,
  splitProps
} from 'solid-js';
import { useAuthContext } from '../contexts/auth';
import { useIsomorphicClerkContext } from '../contexts/isomorphic-clerk';
import { useAssertWrappedByClerkProvider } from '../hooks/use-assert-wrapped-by-clerk-provider';
import { useAuth } from '../hooks/use-auth';
import type {
  RedirectToSignInProps,
  RedirectToSignUpProps,
  WithClerkProp
} from '../types';
import { withClerk } from './with-clerk';

export const SignedIn = (props: ParentProps<unknown>): JSX.Element => {
  useAssertWrappedByClerkProvider('SignedIn');

  const { userId } = useAuthContext();
  return <Show when={userId()}>{props.children}</Show>;
};

export const SignedOut = (props: ParentProps<unknown>): JSX.Element => {
  useAssertWrappedByClerkProvider('SignedOut');

  const { userId } = useAuthContext();
  return <Show when={userId() === null}>{props.children}</Show>;
};

export const ClerkLoaded = (props: ParentProps<unknown>): JSX.Element => {
  useAssertWrappedByClerkProvider('ClerkLoaded');

  const isomorphicClerk = useIsomorphicClerkContext();
  return <Show when={isomorphicClerk().loaded}>{props.children}</Show>;
};

export const ClerkLoading = (props: ParentProps<unknown>): JSX.Element => {
  useAssertWrappedByClerkProvider('ClerkLoading');

  const isomorphicClerk = useIsomorphicClerkContext();
  return <Show when={!isomorphicClerk().loaded}>{props.children}</Show>;
};

export type ProtectProps = ParentProps<
  (
    | {
        condition?: never;
        role: OrganizationCustomRoleKey;
        permission?: never;
      }
    | {
        condition?: never;
        role?: never;
        permission: OrganizationCustomPermissionKey;
      }
    | {
        condition: (has: CheckAuthorizationWithCustomPermissions) => boolean;
        role?: never;
        permission?: never;
      }
    | {
        condition?: never;
        role?: never;
        permission?: never;
      }
  ) & {
    fallback?: JSX.Element;
  }
>;

/**
 * Use `<Protect/>` in order to prevent unauthenticated or unauthorized users from accessing the children passed to the component.
 *
 * Examples:
 * ```
 * <Protect permission="a_permission_key" />
 * <Protect role="a_role_key" />
 * <Protect condition={(has) => has({permission:"a_permission_key"})} />
 * <Protect condition={(has) => has({role:"a_role_key"})} />
 * <Protect fallback={<p>Unauthorized</p>} />
 * ```
 */
export const Protect = ({
  children,
  fallback,
  ...restAuthorizedParams
}: ProtectProps) => {
  useAssertWrappedByClerkProvider('Protect');

  const { isLoaded, has, userId } = useAuth();

  /**
   * Avoid flickering children or fallback while clerk is loading sessionId or userId
   */
  if (!isLoaded) {
    return null;
  }

  /**
   * Fallback to UI provided by user or `null` if authorization checks failed
   */
  const unauthorized = <>{fallback ?? null}</>;

  const authorized = <>{children}</>;

  if (!userId) {
    return unauthorized;
  }

  /**
   * Check against the results of `has` called inside the callback
   */
  if (typeof restAuthorizedParams.condition === 'function') {
    if (restAuthorizedParams.condition(has)) {
      return authorized;
    }
    return unauthorized;
  }

  if (restAuthorizedParams.role || restAuthorizedParams.permission) {
    if (has(restAuthorizedParams)) {
      return authorized;
    }
    return unauthorized;
  }

  /**
   * If neither of the authorization params are passed behave as the `<SignedIn/>`.
   * If fallback is present render that instead of rendering nothing.
   */
  return authorized;
};

export const RedirectToSignIn = withClerk(
  (props: WithClerkProp<RedirectToSignInProps>) => {
    const [local, redirectToSignInProps] = splitProps(props, ['clerk']);

    const hasActiveSessions = createMemo(
      () =>
        local.clerk().client.activeSessions &&
        local.clerk().client.activeSessions.length > 0
    );

    createEffect(() => {
      if (local.clerk().session === null && hasActiveSessions()) {
        void local.clerk().redirectToAfterSignOut();
      } else {
        void local.clerk().redirectToSignIn(redirectToSignInProps);
      }
    });

    return null;
  },
  'RedirectToSignIn'
);

export const RedirectToSignUp = withClerk(
  (props: WithClerkProp<RedirectToSignUpProps>) => {
    const [local, redirectToSignUpProps] = splitProps(props, ['clerk']);
    createEffect(() => {
      void local.clerk().redirectToSignUp(redirectToSignUpProps);
    });

    return null;
  },
  'RedirectToSignUp'
);

export const RedirectToUserProfile = withClerk((props) => {
  createEffect(() => {
    void props.clerk().redirectToUserProfile();
  });

  return null;
}, 'RedirectToUserProfile');

export const RedirectToOrganizationProfile = withClerk((props) => {
  createEffect(() => {
    void props.clerk().redirectToOrganizationProfile();
  });

  return null;
}, 'RedirectToOrganizationProfile');

export const RedirectToCreateOrganization = withClerk((props) => {
  createEffect(() => {
    void props.clerk().redirectToCreateOrganization();
  });

  return null;
}, 'RedirectToCreateOrganization');

export const AuthenticateWithRedirectCallback = withClerk(
  (props: WithClerkProp<HandleOAuthCallbackParams>) => {
    const [local, handleRedirectCallbackParams] = splitProps(props, ['clerk']);
    createEffect(() => {
      void local.clerk().handleRedirectCallback(handleRedirectCallbackParams);
    });

    return null;
  },
  'AuthenticateWithRedirectCallback'
);
