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
    const [local, rest] = splitProps(props, ['redirectUrl']);

    const children = childrenFn(() =>
      normalizeWithDefaultValue(rest.children, 'Sign in with Metamask')
    );
    const child = createMemo(() =>
      assertSingleChild(children())('SignInWithMetamaskButton')
    );

    const clickHandler = async () => {
      if (rest.onClick) {
        await safeExecute(rest.onClick)();
      }
      async function authenticate() {
        await rest.clerk().authenticateWithMetamask({
          redirectUrl: local.redirectUrl || undefined
        });
      }
      void authenticate();
    };

    return <button onClick={clickHandler}>{child()}</button>;
  },
  'SignInWithMetamask'
);
