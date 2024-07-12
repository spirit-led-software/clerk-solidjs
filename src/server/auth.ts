import { getRequestEvent } from 'solid-js/web';

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
export const auth = () => {
  const event = getRequestEvent();
  if (!event) {
    throw new Error('auth() must be called from within a server function');
  }

  return event.locals.auth;
};
