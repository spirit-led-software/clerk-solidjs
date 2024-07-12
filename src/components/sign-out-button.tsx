import type { SignOutOptions } from '@clerk/types';
import {
  children as childrenFn,
  createMemo,
  JSX,
  ParentProps,
  splitProps
} from 'solid-js';
import type { WithClerkProp } from '../types';
import {
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute
} from '../utils';
import { withClerk } from './with-clerk';

export type SignOutButtonProps = {
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  redirectUrl?: string;
  signOutOptions?: SignOutOptions;
  children?: JSX.Element;
};

export const SignOutButton = withClerk(
  (props: ParentProps<WithClerkProp<SignOutButtonProps>>) => {
    const [local, rest] = splitProps(props, [
      'clerk',
      'redirectUrl',
      'signOutOptions'
    ]);

    const children = childrenFn(() =>
      normalizeWithDefaultValue(rest.children, 'Sign out')
    );
    const child = createMemo(() =>
      assertSingleChild(children())('SignOutButton')
    );

    const clickHandler = async () => {
      if (rest.onClick) {
        await safeExecute(rest.onClick)();
      }
      local.clerk.signOut({
        redirectUrl: local.redirectUrl,
        ...local.signOutOptions
      });
    };

    return (
      <button type="button" onClick={clickHandler}>
        {child()}
      </button>
    );
  },
  'SignOutButton'
);
