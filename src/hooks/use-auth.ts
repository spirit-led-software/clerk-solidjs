import type {
  CheckAuthorizationWithCustomPermissions,
  GetToken,
  SignOut
} from '@clerk/types';
import { createMemo } from 'solid-js/types/server/reactive.js';
import { useAuthContext } from '../contexts/auth';
import { useIsomorphicClerkContext } from '../contexts/isomorphic-clerk';
import { errorThrower } from '../errors/error-thrower';
import { useAuthHasRequiresRoleOrPermission } from '../errors/messages';
import { useAssertWrappedByClerkProvider } from './use-assert-wrapped-by-clerk-provider';
import { createGetToken, createSignOut } from './utils';

export const useAuth = () => {
  useAssertWrappedByClerkProvider('useAuth');

  const { sessionId, userId, actor, orgId, orgRole, orgPermissions } =
    useAuthContext();
  const isomorphicClerk = useIsomorphicClerkContext();

  const getToken: GetToken = createGetToken(isomorphicClerk);
  const signOut: SignOut = createSignOut(isomorphicClerk);

  const has = (
    params: Parameters<CheckAuthorizationWithCustomPermissions>[0]
  ) => {
    if (!params?.permission && !params?.role) {
      errorThrower.throw(useAuthHasRequiresRoleOrPermission);
    }

    if (!orgId() || !userId() || !orgRole() || !orgPermissions()) {
      return false;
    }

    if (params.permission) {
      return orgPermissions()!.includes(params.permission);
    }

    if (params.role) {
      return orgRole() === params.role;
    }

    return false;
  };

  const isLoaded = createMemo(
    () => sessionId() !== undefined && userId() !== undefined
  );

  const isSignedIn = createMemo(() => {
    if (!isLoaded()) {
      return undefined;
    }
    return sessionId() !== null && userId() !== null;
  });

  return {
    isLoaded,
    isSignedIn,
    sessionId,
    userId,
    actor,
    orgId,
    orgRole,
    orgPermissions,
    has,
    signOut,
    getToken
  };
};
