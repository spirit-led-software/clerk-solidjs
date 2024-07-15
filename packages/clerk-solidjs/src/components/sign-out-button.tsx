import { children as childrenFn, createMemo, splitProps } from 'solid-js';
import type { SignOutButtonProps, WithClerkProp } from '../types';
import {
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute
} from '../utils';
import { withClerk } from './with-clerk';

export const SignOutButton = withClerk(
  (props: WithClerkProp<SignOutButtonProps>) => {
    const [local, clerk, rest] = splitProps(
      props,
      ['children'],
      ['clerk', 'redirectUrl', 'sessionId', 'onClick']
    );

    const children = childrenFn(() =>
      normalizeWithDefaultValue(local.children, 'Sign out')
    );
    const child = createMemo(() =>
      assertSingleChild(children())('SignOutButton')
    );

    const clickHandler = async () => {
      if (clerk.onClick) {
        await safeExecute(clerk.onClick)();
      }
      clerk.clerk().signOut({
        redirectUrl: clerk.redirectUrl,
        sessionId: clerk.sessionId
      });
    };

    return (
      <button {...rest} onClick={clickHandler}>
        {child()}
      </button>
    );
  },
  'SignOutButton'
);
