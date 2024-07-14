import {
  ActJWTClaim,
  OrganizationCustomPermissionKey,
  OrganizationCustomRoleKey
} from '@clerk/types';
import { createMemo } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [AuthContextProvider, useAuthContext] =
  createContextProviderAndHook(
    'AuthContext',
    (props: {
      userId: string | null | undefined;
      sessionId: string | null | undefined;
      actor: ActJWTClaim | null | undefined;
      orgId: string | null | undefined;
      orgRole: OrganizationCustomRoleKey | null | undefined;
      orgSlug: string | null | undefined;
      orgPermissions: OrganizationCustomPermissionKey[] | null | undefined;
    }) => {
      return {
        userId: createMemo(() => props.userId),
        sessionId: createMemo(() => props.sessionId),
        actor: createMemo(() => props.actor),
        orgId: createMemo(() => props.orgId),
        orgRole: createMemo(() => props.orgRole),
        orgSlug: createMemo(() => props.orgSlug),
        orgPermissions: createMemo(() => props.orgPermissions)
      };
    }
  );
