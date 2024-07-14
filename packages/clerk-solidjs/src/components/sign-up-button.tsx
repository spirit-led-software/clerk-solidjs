import type { SignUpProps } from '@clerk/types';
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
    const [local, rest] = splitProps(props, ['clerk', 'children']);

    const children = childrenFn(() =>
      normalizeWithDefaultValue(local.children, 'Sign up')
    );
    const child = createMemo(() =>
      assertSingleChild(children())('SignUpButton')
    );

    const clickHandler = async () => {
      if (rest.onClick) {
        await safeExecute(rest.onClick)();
      }

      const opts: SignUpProps = {
        ...rest
      };
      if (rest.mode === 'modal') {
        return local.clerk.openSignUp(opts);
      }
      return local.clerk.redirectToSignUp({
        ...opts,
        signUpFallbackRedirectUrl: rest.fallbackRedirectUrl,
        signUpForceRedirectUrl: rest.forceRedirectUrl
      });
    };

    return (
      <button type="button" onClick={clickHandler}>
        {child()}
      </button>
    );
  },
  'SignUpButton'
);
