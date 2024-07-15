import type { SignInProps } from '@clerk/types';
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
    const [local, rest] = splitProps(props, ['children', 'clerk']);
    const children = childrenFn(() =>
      normalizeWithDefaultValue(local.children, 'Sign in')
    );
    const child = createMemo(() =>
      assertSingleChild(children())('SignInButton')
    );

    const clickHandler = async () => {
      if (rest.onClick) {
        await safeExecute(rest.onClick)();
      }
      const opts: SignInProps = {
        forceRedirectUrl: rest.forceRedirectUrl,
        fallbackRedirectUrl: rest.fallbackRedirectUrl,
        signUpFallbackRedirectUrl: rest.signUpFallbackRedirectUrl,
        signUpForceRedirectUrl: rest.signUpForceRedirectUrl
      };

      if (rest.mode === 'modal') {
        return local.clerk().openSignIn(opts);
      }
      return local.clerk().redirectToSignIn({
        ...opts,
        signInFallbackRedirectUrl: rest.fallbackRedirectUrl,
        signInForceRedirectUrl: rest.forceRedirectUrl
      });
    };

    return <button onClick={clickHandler}>{child()}</button>;
  },
  'SignInButton'
);
