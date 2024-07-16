import type {
  EmailAddressResource,
  SignInResource,
  SignUpResource
} from '@clerk/types';
import { destructure } from '@solid-primitives/destructure';
import { Accessor, createEffect, createMemo, onCleanup } from 'solid-js';

type EmailLinkable = SignUpResource | EmailAddressResource | SignInResource;

function useEmailLink(resource: Accessor<EmailLinkable>) {
  const linkFlows = createMemo(() => resource().createEmailLinkFlow());

  createEffect(() => {
    onCleanup(linkFlows().cancelEmailLinkFlow);
  });

  return destructure(linkFlows);
}

export { useEmailLink };
