import type { JSX } from 'solid-js';
import { errorThrower } from '../errors/error-thrower';
import { multipleChildrenInButtonComponent } from '../errors/messages';

export const assertSingleChild =
  (children: JSX.Element) =>
  (
    name:
      | 'SignInButton'
      | 'SignUpButton'
      | 'SignOutButton'
      | 'SignInWithMetamaskButton'
  ) => {
    try {
      if (Array.isArray(children)) {
        throw new Error();
      } else if (children instanceof Node) {
        if (children.previousSibling || children.nextSibling) {
          throw new Error();
        }
      }
      return children;
    } catch (e) {
      return errorThrower.throw(multipleChildrenInButtonComponent(name));
    }
  };

export const normalizeWithDefaultValue = (
  children: JSX.Element | undefined,
  defaultText: string
) => {
  if (!children) {
    children = defaultText;
  }
  return children;
};

export const safeExecute =
  (cb: unknown) =>
  (...args: any) => {
    if (cb && typeof cb === 'function') {
      return cb(...args);
    }
  };
