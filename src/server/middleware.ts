import type { RequestMiddleware } from '@solidjs/start/middleware';
import {
  CreateClerkClientOptions,
  createClerkClientWithOptions
} from './clerk-client';

/**
 * Returns a middleware function that authenticates a request using Clerk.
 * This injects the auth object into Solid Start's RequestEventLocals.
 *
 * You must define Solid Start middleware. See {@link https://docs.solidjs.com/solid-start/advanced/middleware}
 *
 * @param {Object} options - An object containing optional Clerk client options.
 * @param {CreateClerkClientOptions} options.clerkOptions - The options for creating a Clerk client.
 * @return {RequestMiddleware} A middleware function that authenticates a request using Clerk.
 * @throws {Error} Throws an error if there is an unexpected handshake without a redirect.
 */
export const clerkMiddleware = (options: {
  clerkOptions?: CreateClerkClientOptions;
}): RequestMiddleware => {
  return async ({ request, locals }) => {
    const requestState = await createClerkClientWithOptions(
      options.clerkOptions
    ).authenticateRequest(request);

    const locationHeader = requestState.headers.get('location');
    if (locationHeader) {
      return new Response(null, {
        status: 307,
        headers: requestState.headers
      });
    }

    if (requestState.status === 'handshake') {
      throw new Error('Clerk: Unexpected handshake without redirect');
    }

    locals.auth = requestState.toAuth();
  };
};
