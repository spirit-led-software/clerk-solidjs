import {
  ActJWTClaim,
  OrganizationCustomPermissionKey,
  OrganizationCustomRoleKey
} from '@clerk/types';
import { Accessor } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [AuthContextProvider, useAuthContext] =
  createContextProviderAndHook(
    'AuthContext',
    (props: {
      userId: Accessor<string | null | undefined>;
      sessionId: Accessor<string | null | undefined>;
      actor: Accessor<ActJWTClaim | null | undefined>;
      orgId: Accessor<string | null | undefined>;
      orgRole: Accessor<OrganizationCustomRoleKey | null | undefined>;
      orgSlug: Accessor<string | null | undefined>;
      orgPermissions: Accessor<
        OrganizationCustomPermissionKey[] | null | undefined
      >;
    }) => {
      return {
        userId: props.userId,
        sessionId: props.sessionId,
        actor: props.actor,
        orgId: props.orgId,
        orgRole: props.orgRole,
        orgSlug: props.orgSlug,
        orgPermissions: props.orgPermissions
      };
    }
  );
