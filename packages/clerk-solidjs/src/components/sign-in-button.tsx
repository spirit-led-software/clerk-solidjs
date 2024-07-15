import { children as childrenFn, createMemo, splitProps } from 'solid-js';
import type { SignInButtonProps, WithClerkProp } from '../types';
import {
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute
} from '../utils';
import { withClerk } from './with-clerk';

export const SignInButton = withClerk(
  (props: WithClerkProp<SignInButtonProps>) => {
    const [local, clerkProps, rest] = splitProps(
      props,
      ['children'],
      [
        'clerk',
        'signUpFallbackRedirectUrl',
        'signUpForceRedirectUrl',
        'forceRedirectUrl',
        'fallbackRedirectUrl',
        'mode',
        'onClick'
      ]
    );
    const children = childrenFn(() =>
      normalizeWithDefaultValue(local.children, 'Sign in')
    );
    const child = createMemo(() =>
      assertSingleChild(children())('SignInButton')
    );

    const clickHandler = async () => {
      const { onClick, mode, clerk, ...opts } = clerkProps;
      if (onClick) {
        await safeExecute(onClick)();
      }

      if (mode === 'modal') {
        return clerk().openSignIn(opts);
      }
      return clerk().redirectToSignIn(opts);
    };

    return (
      <button {...rest} onClick={clickHandler}>
        {child()}
      </button>
    );
  },
  'SignInButton'
);
