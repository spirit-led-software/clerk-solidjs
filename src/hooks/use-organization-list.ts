import { eventMethodCalled } from '@clerk/shared/telemetry';
import type {
  ClerkPaginatedResponse,
  GetUserOrganizationInvitationsParams,
  GetUserOrganizationMembershipParams,
  GetUserOrganizationSuggestionsParams,
  OrganizationMembershipResource,
  OrganizationSuggestionResource,
  UserOrganizationInvitationResource
} from '@clerk/types';
import { Accessor, createEffect, createMemo } from 'solid-js';
import { useClerkInstanceContext } from '../contexts/clerk-instance';
import { useUserContext } from '../contexts/user';
import { IsomorphicClerk } from '../isomorphic-clerk';
import type { PaginatedHookConfig } from '../types';
import { useAssertWrappedByClerkProvider } from './use-assert-wrapped-by-clerk-provider';
import {
  convertToSafeValues,
  usePagesOrInfinite
} from './use-pages-or-infinite';

type UseOrganizationListParams = {
  userMemberships?:
    | true
    | PaginatedHookConfig<GetUserOrganizationMembershipParams>;
  userInvitations?:
    | true
    | PaginatedHookConfig<GetUserOrganizationInvitationsParams>;
  userSuggestions?:
    | true
    | PaginatedHookConfig<GetUserOrganizationSuggestionsParams>;
};

export const useOrganizationList = (
  params?: Accessor<UseOrganizationListParams>
) => {
  useAssertWrappedByClerkProvider('useOrganizationList');

  const userMembershipsSafeValues = createMemo(() =>
    convertToSafeValues(params?.().userMemberships, {
      initialPage: 1,
      pageSize: 10,
      keepPreviousData: false,
      infinite: false
    })
  );

  const userInvitationsSafeValues = createMemo(() =>
    convertToSafeValues(params?.().userInvitations, {
      initialPage: 1,
      pageSize: 10,
      status: 'pending',
      keepPreviousData: false,
      infinite: false
    })
  );

  const userSuggestionsSafeValues = createMemo(() =>
    convertToSafeValues(params?.().userSuggestions, {
      initialPage: 1,
      pageSize: 10,
      status: 'pending',
      keepPreviousData: false,
      infinite: false
    })
  );

  const clerk = useClerkInstanceContext();
  const user = useUserContext();

  createEffect(() => {
    clerk().telemetry?.record(eventMethodCalled('useOrganizationList'));
  });

  const userMembershipsParams = createMemo(() =>
    typeof params?.().userMemberships === 'undefined'
      ? undefined
      : {
          initialPage: userMembershipsSafeValues().initialPage,
          pageSize: userMembershipsSafeValues().pageSize
        }
  );

  const userInvitationsParams = createMemo(() =>
    typeof params?.().userInvitations === 'undefined'
      ? undefined
      : {
          initialPage: userInvitationsSafeValues().initialPage,
          pageSize: userInvitationsSafeValues().pageSize,
          status: userInvitationsSafeValues().status
        }
  );

  const userSuggestionsParams = createMemo(() =>
    typeof params?.().userSuggestions === 'undefined'
      ? undefined
      : {
          initialPage: userSuggestionsSafeValues().initialPage,
          pageSize: userSuggestionsSafeValues().pageSize,
          status: userSuggestionsSafeValues().status
        }
  );

  const isClerkLoaded = createMemo(() => !!(clerk().loaded && user()));

  const memberships = usePagesOrInfinite<
    GetUserOrganizationMembershipParams,
    ClerkPaginatedResponse<OrganizationMembershipResource>
  >(() => ({
    params: userMembershipsParams() || {},
    fetcher: user()?.getOrganizationMemberships,
    config: {
      keepPreviousData: userMembershipsSafeValues().keepPreviousData,
      infinite: userMembershipsSafeValues().infinite,
      enabled: !!userMembershipsParams()
    },
    cacheKeys: {
      type: 'userMemberships',
      userId: user()?.id
    }
  }));

  const invitations = usePagesOrInfinite<
    GetUserOrganizationInvitationsParams,
    ClerkPaginatedResponse<UserOrganizationInvitationResource>
  >(() => ({
    params: {
      ...userInvitationsParams()
    },
    fetcher: user()?.getOrganizationInvitations,
    config: {
      keepPreviousData: userInvitationsSafeValues().keepPreviousData,
      infinite: userInvitationsSafeValues().infinite,
      enabled: !!userInvitationsParams()
    },
    cacheKeys: {
      type: 'userInvitations',
      userId: user()?.id
    }
  }));

  const suggestions = usePagesOrInfinite<
    GetUserOrganizationSuggestionsParams,
    ClerkPaginatedResponse<OrganizationSuggestionResource>
  >(() => ({
    params: {
      ...userSuggestionsParams()
    },
    fetcher: user()?.getOrganizationSuggestions,
    config: {
      keepPreviousData: userSuggestionsSafeValues().keepPreviousData,
      infinite: userSuggestionsSafeValues().infinite,
      enabled: !!userSuggestionsParams()
    },
    cacheKeys: {
      type: 'userSuggestions',
      userId: user()?.id
    }
  }));

  const createOrganization = (
    params: Parameters<IsomorphicClerk['createOrganization']>[0]
  ) => {
    return clerk().createOrganization(params);
  };
  const setActive = (params: Parameters<IsomorphicClerk['setActive']>[0]) => {
    return clerk().setActive(params);
  };

  return {
    isLoaded: isClerkLoaded,
    createOrganization,
    setActive,
    userMemberships: createMemo(() =>
      isClerkLoaded() ? memberships : undefined
    ),
    userInvitations: createMemo(() =>
      isClerkLoaded() ? invitations : undefined
    ),
    userSuggestions: createMemo(() =>
      isClerkLoaded() ? suggestions : undefined
    )
  };
};
