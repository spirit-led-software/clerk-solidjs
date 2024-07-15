import { OrganizationResource } from '@clerk/types';
import { Accessor } from 'solid-js';
import { createContextProviderAndHook } from '../utils/create-context-provider-and-hook';

export const [OrganizationContextProvider, useOrganizationContext] =
  createContextProviderAndHook(
    'OrganizationProvider',
    (props: {
      organization: Accessor<OrganizationResource | null | undefined>;
    }) => {
      return props.organization;
    }
  );
