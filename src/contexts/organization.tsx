import { OrganizationResource } from '@clerk/types';
import { createMemo } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [OrganizationContextProvider, useOrganizationContext] =
  createContextProviderAndHook(
    'OrganizationProvider',
    (props: { organization: OrganizationResource | null | undefined }) => {
      return createMemo(() => props.organization);
    }
  );
