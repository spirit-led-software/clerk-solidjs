import { logErrorInDevMode } from '@clerk/shared';
import type {
  CreateOrganizationProps,
  GoogleOneTapProps,
  OrganizationListProps,
  OrganizationProfileProps,
  OrganizationSwitcherProps,
  SignInProps,
  SignUpProps,
  UserButtonProps,
  UserProfileProps,
  Without
} from '@clerk/types';
import {
  children,
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  ParentProps,
  splitProps
} from 'solid-js';
import {
  organizationProfileLinkRenderedError,
  organizationProfilePageRenderedError,
  userProfileLinkRenderedError,
  userProfilePageRenderedError
} from '../errors/messages';
import { IsomorphicClerk } from '../isomorphic-clerk';
import type {
  MountProps,
  OpenProps,
  OrganizationProfileLinkProps,
  OrganizationProfilePageProps,
  UserProfileLinkProps,
  UserProfilePageProps,
  WithClerkProp
} from '../types';
import { withClerk } from './with-clerk';

type UserProfileExportType = typeof _UserProfile & {
  Page: typeof UserProfilePage;
  Link: typeof UserProfileLink;
};

type UserButtonExportType = typeof _UserButton & {
  UserProfilePage: typeof UserProfilePage;
  UserProfileLink: typeof UserProfileLink;
};

type UserButtonPropsWithoutCustomPages = Without<
  UserButtonProps,
  'userProfileProps'
> & {
  userProfileProps?: Pick<
    UserProfileProps,
    'additionalOAuthScopes' | 'appearance'
  >;
};

type OrganizationProfileExportType = typeof _OrganizationProfile & {
  Page: typeof OrganizationProfilePage;
  Link: typeof OrganizationProfileLink;
};

type OrganizationSwitcherExportType = typeof _OrganizationSwitcher & {
  OrganizationProfilePage: typeof OrganizationProfilePage;
  OrganizationProfileLink: typeof OrganizationProfileLink;
};

type OrganizationSwitcherPropsWithoutCustomPages = Without<
  OrganizationSwitcherProps,
  'organizationProfileProps'
> & {
  organizationProfileProps?: Pick<OrganizationProfileProps, 'appearance'>;
};

const isMountProps = (props: any): props is MountProps => {
  return 'mount' in props;
};

const isOpenProps = (props: any): props is OpenProps => {
  return 'open' in props;
};

const Portal: Component<MountProps | OpenProps> = (props) => {
  const [portalRef, setPortalRef] = createSignal<HTMLDivElement>();

  const componentProps = () => props.props;

  createEffect(() => {
    const ref = portalRef();
    if (ref && isMountProps(props)) {
      props.updateProps({
        node: ref,
        props: componentProps()
      });
    }
  });

  onMount(() => {
    const ref = portalRef();
    if (ref) {
      if (isMountProps(props)) {
        props.mount(ref, componentProps());
      } else if (isOpenProps(props)) {
        props.open(componentProps());
      }
    }
  });

  onCleanup(() => {
    const ref = portalRef();
    if (ref) {
      if (isMountProps(props)) {
        props.unmount(ref);
      } else if (isOpenProps(props)) {
        props.close();
      }
    }
  });

  return <div ref={setPortalRef} />;
};

export const SignIn = withClerk((props: WithClerkProp<SignInProps>) => {
  const [local, rest] = splitProps(props, ['clerk']);
  return (
    <Portal
      mount={local.clerk().mountSignIn}
      unmount={local.clerk().unmountSignIn}
      updateProps={
        (local.clerk() as unknown as IsomorphicClerk).__unstable__updateProps
      }
      props={rest}
    />
  );
}, 'SignIn');

export const Waitlist = withClerk((props: WithClerkProp<SignInProps>) => {
  const [local, rest] = splitProps(props, ['clerk']);
  return (
    <Portal
      mount={local.clerk().mountWaitlist}
      unmount={local.clerk().unmountWaitlist}
      updateProps={(local.clerk() as IsomorphicClerk).__unstable__updateProps}
      props={rest}
    />
  );
}, 'Waitlist');

export const SignUp = withClerk((props: WithClerkProp<SignUpProps>) => {
  const [local, rest] = splitProps(props, ['clerk']);
  return (
    <Portal
      mount={local.clerk().mountSignUp}
      unmount={local.clerk().unmountSignUp}
      updateProps={
        (local.clerk() as unknown as IsomorphicClerk).__unstable__updateProps
      }
      props={rest}
    />
  );
}, 'SignUp');

export function UserProfilePage(props: ParentProps<UserProfilePageProps>) {
  logErrorInDevMode(userProfilePageRenderedError);
  return children(() => props.children);
}

export function UserProfileLink(props: ParentProps<UserProfileLinkProps>) {
  logErrorInDevMode(userProfileLinkRenderedError);
  return children(() => props.children);
}

const _UserProfile = withClerk(
  (
    props: WithClerkProp<ParentProps<Without<UserProfileProps, 'customPages'>>>
  ) => {
    const [local, rest] = splitProps(props, ['clerk']);
    return (
      <Portal
        mount={local.clerk().mountUserProfile}
        unmount={local.clerk().unmountUserProfile}
        updateProps={
          (local.clerk() as unknown as IsomorphicClerk).__unstable__updateProps
        }
        props={rest}
      />
    );
  },
  'UserProfile'
);

export const UserProfile: UserProfileExportType = Object.assign(_UserProfile, {
  Page: UserProfilePage,
  Link: UserProfileLink
});

const _UserButton = withClerk(
  (props: WithClerkProp<ParentProps<UserButtonPropsWithoutCustomPages>>) => {
    const [local, rest] = splitProps(props, ['clerk']);
    return (
      <Portal
        mount={local.clerk().mountUserButton}
        unmount={local.clerk().unmountUserButton}
        updateProps={
          (local.clerk() as unknown as IsomorphicClerk).__unstable__updateProps
        }
        props={rest}
      />
    );
  },
  'UserButton'
);

export const UserButton: UserButtonExportType = Object.assign(_UserButton, {
  UserProfilePage,
  UserProfileLink
});

export function OrganizationProfilePage(
  props: ParentProps<OrganizationProfilePageProps>
) {
  logErrorInDevMode(organizationProfilePageRenderedError);
  return children(() => props.children);
}

export function OrganizationProfileLink(
  props: ParentProps<OrganizationProfileLinkProps>
) {
  logErrorInDevMode(organizationProfileLinkRenderedError);
  return children(() => props.children);
}

const _OrganizationProfile = withClerk(
  (
    props: WithClerkProp<
      ParentProps<Without<OrganizationProfileProps, 'customPages'>>
    >
  ) => {
    const [local, rest] = splitProps(props, ['clerk']);
    return (
      <Portal
        mount={local.clerk().mountOrganizationProfile}
        unmount={local.clerk().unmountOrganizationProfile}
        updateProps={
          (local.clerk() as unknown as IsomorphicClerk).__unstable__updateProps
        }
        props={rest}
      />
    );
  },
  'OrganizationProfile'
);

export const OrganizationProfile: OrganizationProfileExportType = Object.assign(
  _OrganizationProfile,
  {
    Page: OrganizationProfilePage,
    Link: OrganizationProfileLink
  }
);

export const CreateOrganization = withClerk(
  (props: WithClerkProp<CreateOrganizationProps>) => {
    const [local, rest] = splitProps(props, ['clerk']);
    return (
      <Portal
        mount={local.clerk().mountCreateOrganization}
        unmount={local.clerk().unmountCreateOrganization}
        updateProps={
          (local.clerk() as unknown as IsomorphicClerk).__unstable__updateProps
        }
        props={rest}
      />
    );
  },
  'CreateOrganization'
);

const _OrganizationSwitcher = withClerk(
  (
    props: WithClerkProp<
      ParentProps<OrganizationSwitcherPropsWithoutCustomPages>
    >
  ) => {
    const [local, rest] = splitProps(props, ['clerk']);

    return (
      <Portal
        mount={local.clerk().mountOrganizationSwitcher}
        unmount={local.clerk().unmountOrganizationSwitcher}
        updateProps={
          (local.clerk() as unknown as IsomorphicClerk).__unstable__updateProps
        }
        props={rest}
      />
    );
  },
  'OrganizationSwitcher'
);

export const OrganizationSwitcher: OrganizationSwitcherExportType =
  Object.assign(_OrganizationSwitcher, {
    OrganizationProfilePage,
    OrganizationProfileLink
  });

export const OrganizationList = withClerk(
  (props: WithClerkProp<OrganizationListProps>) => {
    const [local, rest] = splitProps(props, ['clerk']);
    return (
      <Portal
        mount={local.clerk().mountOrganizationList}
        unmount={local.clerk().unmountOrganizationList}
        updateProps={
          (local.clerk() as unknown as IsomorphicClerk).__unstable__updateProps
        }
        props={rest}
      />
    );
  },
  'OrganizationList'
);

export const GoogleOneTap = withClerk(
  (props: WithClerkProp<GoogleOneTapProps>) => {
    const [local, rest] = splitProps(props, ['clerk']);
    return (
      <Portal
        open={local.clerk().openGoogleOneTap}
        close={local.clerk().closeGoogleOneTap}
        props={rest}
      />
    );
  },
  'GoogleOneTap'
);
