import { Accessor } from 'solid-js';
import type { IsomorphicClerk } from '../isomorphic-clerk';

/**
 * @internal
 */
const clerkLoaded = (isomorphicClerk: Accessor<IsomorphicClerk>) => {
  return new Promise<void>((resolve) => {
    const clerk = isomorphicClerk();
    if (clerk.loaded) {
      resolve();
    }
    clerk.addOnLoaded(resolve);
  });
};

/**
 * @internal
 */
export const createGetToken = (isomorphicClerk: Accessor<IsomorphicClerk>) => {
  return async (options: any) => {
    const clerk = isomorphicClerk();
    await clerkLoaded(isomorphicClerk);
    if (!clerk.session) {
      return null;
    }
    return clerk.session!.getToken(options);
  };
};

/**
 * @internal
 */
export const createSignOut = (isomorphicClerk: Accessor<IsomorphicClerk>) => {
  return async (...args: any) => {
    await clerkLoaded(isomorphicClerk);
    return isomorphicClerk().signOut(...args);
  };
};
