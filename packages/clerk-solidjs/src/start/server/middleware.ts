import { stripPrivateDataFromObject } from '@clerk/backend/internal';
import type { RequestMiddleware } from '@solidjs/start/middleware';
import { authenticateRequest } from './authenticate-request';
import { loadOptions } from './load-options';
import { LoaderOptions } from './types';
import { getResponseClerkState } from './utils';

/**
 * Returns a middleware function that authenticates a request using Clerk.
 * This injects the auth object into Solid Start's RequestEventLocals.
 *
 * After implementing this middleware you can access the auth object from `RequestEvent.locals`,
 * or using the `auth()` helper function.
 *
 * You must define Solid Start middleware. See {@link https://docs.solidjs.com/solid-start/advanced/middleware}
 *
 * @param {LoaderOptions} options - The options for creating a Clerk client.
 * @return {RequestMiddleware} A middleware function that authenticates a request using Clerk.
 * @throws {Error} Throws an error if there is an unexpected handshake without a redirect.
 *
 * @example
 * ```ts
 * import { createMiddleware } from "@solidjs/start/middleware";
 * import { clerkMiddleware } from 'clerk-solidjs/start/server';
 *
 * export default createMiddleware({
 *   onRequest: [
 *     clerkMiddleware({
 *       publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
 *       secretKey: import.meta.env.CLERK_SECRET_KEY,
 *     }),
 *   ],
 * });
 * ```
 */
export const clerkMiddleware = (
  options: LoaderOptions = {}
): RequestMiddleware => {
  return async ({ request, locals }) => {
    try {
      const loadedOptions = loadOptions(request, options);
      const requestState = await authenticateRequest(request, loadedOptions);
      const state = getResponseClerkState(requestState, loadedOptions);
      locals.auth = stripPrivateDataFromObject(requestState.toAuth());
      locals.clerkInitialState = state.clerkInitialState;
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      throw error;
    }
  };
};
