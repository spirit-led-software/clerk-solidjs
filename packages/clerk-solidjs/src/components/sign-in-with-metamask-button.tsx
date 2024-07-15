import { children as childrenFn, createMemo, splitProps } from 'solid-js';
import type { SignInWithMetamaskButtonProps, WithClerkProp } from '../types';
import {
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute
} from '../utils';
import { withClerk } from './with-clerk';

export const SignInWithMetamaskButton = withClerk(
  (props: WithClerkProp<SignInWithMetamaskButtonProps>) => {
    const [local, clerkProps, rest] = splitProps(
      props,
      ['children'],
      ['clerk', 'redirectUrl', 'onClick']
    );

    const children = childrenFn(() =>
      normalizeWithDefaultValue(local.children, 'Sign in with Metamask')
    );
    const child = createMemo(() =>
      assertSingleChild(children())('SignInWithMetamaskButton')
    );

    const clickHandler = async () => {
      const { onClick, clerk, ...opts } = clerkProps;
      if (onClick) {
        await safeExecute(onClick)();
      }
      async function authenticate() {
        await clerk().authenticateWithMetamask({
          ...opts,
          redirectUrl: opts.redirectUrl || undefined
        });
      }
      void authenticate();
    };

    return (
      <button {...rest} onClick={clickHandler}>
        {child()}
      </button>
    );
  },
  'SignInWithMetamask'
);
