import { eventMethodCalled } from '@clerk/shared/telemetry';
import type {
  ClerkPaginatedResponse,
  GetDomainsParams,
  GetInvitationsParams,
  GetMembershipRequestParams,
  GetMembersParams,
  OrganizationDomainResource,
  OrganizationInvitationResource,
  OrganizationMembershipRequestResource,
  OrganizationMembershipResource
} from '@clerk/types';
import { Accessor, createEffect, createMemo } from 'solid-js';
import { useClerkInstanceContext } from '../contexts/clerk-instance';
import { useOrganizationContext } from '../contexts/organization';
import { useSessionContext } from '../contexts/session';
import type { PaginatedHookConfig } from '../types';
import { useAssertWrappedByClerkProvider } from './use-assert-wrapped-by-clerk-provider';
import {
  convertToSafeValues,
  usePagesOrInfinite
} from './use-pages-or-infinite';

type UseOrganizationParams = {
  domains?: true | PaginatedHookConfig<GetDomainsParams>;
  membershipRequests?: true | PaginatedHookConfig<GetMembershipRequestParams>;
  memberships?: true | PaginatedHookConfig<GetMembersParams>;
  invitations?: true | PaginatedHookConfig<GetInvitationsParams>;
};

export const useOrganization = (params?: Accessor<UseOrganizationParams>) => {
  useAssertWrappedByClerkProvider('useOrganization');

  const organization = useOrganizationContext();
  const session = useSessionContext();

  const domainSafeValues = createMemo(() =>
    convertToSafeValues(params?.().domains, {
      initialPage: 1,
      pageSize: 10,
      keepPreviousData: false,
      infinite: false,
      enrollmentMode: undefined
    })
  );

  const membershipRequestSafeValues = createMemo(() =>
    convertToSafeValues(params?.().membershipRequests, {
      initialPage: 1,
      pageSize: 10,
      status: 'pending',
      keepPreviousData: false,
      infinite: false
    })
  );

  const membersSafeValues = createMemo(() =>
    convertToSafeValues(params?.().memberships, {
      initialPage: 1,
      pageSize: 10,
      role: undefined,
      keepPreviousData: false,
      infinite: false
    })
  );

  const invitationsSafeValues = createMemo(() =>
    convertToSafeValues(params?.().invitations, {
      initialPage: 1,
      pageSize: 10,
      status: ['pending'],
      keepPreviousData: false,
      infinite: false
    })
  );

  const clerk = useClerkInstanceContext();

  createEffect(() => {
    clerk().telemetry?.record(eventMethodCalled('useOrganization'));
  });

  const domainParams = createMemo(() =>
    typeof params?.().domains === 'undefined'
      ? undefined
      : {
          initialPage: domainSafeValues().initialPage,
          pageSize: domainSafeValues().pageSize,
          enrollmentMode: domainSafeValues().enrollmentMode
        }
  );

  const membershipRequestParams = createMemo(() =>
    typeof params?.().membershipRequests === 'undefined'
      ? undefined
      : {
          initialPage: membershipRequestSafeValues().initialPage,
          pageSize: membershipRequestSafeValues().pageSize,
          status: membershipRequestSafeValues().status
        }
  );

  const membersParams = createMemo(() =>
    typeof params?.().memberships === 'undefined'
      ? undefined
      : {
          initialPage: membersSafeValues().initialPage,
          pageSize: membersSafeValues().pageSize,
          role: membersSafeValues().role
        }
  );

  const invitationsParams = createMemo(() =>
    typeof params?.().invitations === 'undefined'
      ? undefined
      : {
          initialPage: invitationsSafeValues().initialPage,
          pageSize: invitationsSafeValues().pageSize,
          status: invitationsSafeValues().status
        }
  );

  const domains = usePagesOrInfinite<
    GetDomainsParams,
    ClerkPaginatedResponse<OrganizationDomainResource>
  >(() => ({
    params: {
      ...domainParams()
    },
    fetcher: organization()?.getDomains,
    config: {
      keepPreviousData: domainSafeValues().keepPreviousData,
      infinite: domainSafeValues().infinite,
      enabled: !!domainParams()
    },
    cacheKeys: {
      type: 'domains',
      organizationId: organization()?.id
    }
  }));

  const membershipRequests = usePagesOrInfinite<
    GetMembershipRequestParams,
    ClerkPaginatedResponse<OrganizationMembershipRequestResource>
  >(() => ({
    params: {
      ...membershipRequestParams()
    },
    fetcher: organization()?.getMembershipRequests,
    config: {
      keepPreviousData: membershipRequestSafeValues().keepPreviousData,
      infinite: membershipRequestSafeValues().infinite,
      enabled: !!membershipRequestParams()
    },
    cacheKeys: {
      type: 'membershipRequests',
      organizationId: organization()?.id
    }
  }));

  const memberships = usePagesOrInfinite<
    GetMembersParams,
    ClerkPaginatedResponse<OrganizationMembershipResource>
  >(() => ({
    params: membersParams() || {},
    fetcher: organization()?.getMemberships,
    config: {
      keepPreviousData: membersSafeValues().keepPreviousData,
      infinite: membersSafeValues().infinite,
      enabled: !!membersParams()
    },
    cacheKeys: {
      type: 'members',
      organizationId: organization()?.id
    }
  }));

  const invitations = usePagesOrInfinite<
    GetInvitationsParams,
    ClerkPaginatedResponse<OrganizationInvitationResource>
  >(() => ({
    params: {
      ...invitationsParams()
    },
    fetcher: organization()?.getInvitations,
    config: {
      keepPreviousData: invitationsSafeValues().keepPreviousData,
      infinite: invitationsSafeValues().infinite,
      enabled: !!invitationsParams()
    },
    cacheKeys: {
      type: 'invitations',
      organizationId: organization()?.id
    }
  }));

  const isLoaded = createMemo(() => organization() === undefined);

  return {
    isLoaded,
    organization,
    membership: createMemo(() => {
      if (isLoaded()) {
        if (organization()) {
          return getCurrentOrganizationMembership(
            session()!.user!.organizationMemberships,
            organization()!.id
          );
        } else {
          return null;
        }
      }
      return undefined;
    }),
    domains: createMemo(() => {
      if (isLoaded()) {
        if (organization()) {
          return domains;
        } else {
          return null;
        }
      }
      return undefined;
    }),
    membershipRequests: createMemo(() => {
      if (isLoaded()) {
        if (organization()) {
          return membershipRequests;
        } else {
          return null;
        }
      }
      return undefined;
    }),
    memberships: createMemo(() => {
      if (isLoaded()) {
        if (organization()) {
          return memberships;
        } else {
          return null;
        }
      }
      return undefined;
    }),
    invitations: createMemo(() => {
      if (isLoaded()) {
        if (organization()) {
          return invitations;
        } else {
          return null;
        }
      }
      return undefined;
    })
  };
};

function getCurrentOrganizationMembership(
  organizationMemberships: OrganizationMembershipResource[],
  activeOrganizationId: string
) {
  return organizationMemberships.find(
    (organizationMembership) =>
      organizationMembership.organization.id === activeOrganizationId
  );
}
