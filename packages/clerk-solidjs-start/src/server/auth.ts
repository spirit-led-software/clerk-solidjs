import { AuthObject } from '@clerk/backend';
import { getRequestEvent } from 'solid-js/web';

export type AuthHelper = () => AuthObject;

/**
 * Function that retrieves the authentication information from the event object.
 * You must implement `clerkMiddleware` to use this function.
 *
 * Must be called from within a server function.
 *
 * @example
 * async function myServerFunction() {
 *   'use server';
 *   const { userId } = auth();
 *   // ...
 * }
 *
 * @return The authentication information stored in the event object.
 */
export const auth: AuthHelper = () => {
  const event = getRequestEvent();
  if (!event) {
    throw new Error('auth() must be called from within a server function');
  }

  if (!event.locals.auth) {
    throw new Error('auth() returned null. Did you implement clerkMiddleware?');
  }

  return event.locals.auth;
};
