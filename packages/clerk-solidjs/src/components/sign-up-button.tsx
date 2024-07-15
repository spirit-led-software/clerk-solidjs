import { children as childrenFn, createMemo, splitProps } from 'solid-js';
import type { SignUpButtonProps, WithClerkProp } from '../types';
import {
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute
} from '../utils';
import { withClerk } from './with-clerk';

export const SignUpButton = withClerk(
  (props: WithClerkProp<SignUpButtonProps>) => {
    const [local, clerkProps, rest] = splitProps(
      props,
      ['children'],
      ['clerk', 'mode', 'fallbackRedirectUrl', 'forceRedirectUrl', 'onClick']
    );

    const children = childrenFn(() =>
      normalizeWithDefaultValue(local.children, 'Sign up')
    );
    const child = createMemo(() =>
      assertSingleChild(children())('SignUpButton')
    );

    const clickHandler = async () => {
      const { onClick, mode, clerk, ...opts } = clerkProps;

      if (onClick) {
        await safeExecute(clerkProps.onClick)();
      }

      if (mode === 'modal') {
        return clerk().openSignUp(opts);
      }

      return clerk().redirectToSignUp({
        ...opts,
        signUpFallbackRedirectUrl: clerkProps.fallbackRedirectUrl,
        signUpForceRedirectUrl: clerkProps.forceRedirectUrl
      });
    };

    return (
      <button {...rest} onClick={clickHandler}>
        {child()}
      </button>
    );
  },
  'SignUpButton'
);
