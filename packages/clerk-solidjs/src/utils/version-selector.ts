/**
 * Select the version of clerk-js to use
 * @param clerkJSVersion - The optional clerkJSVersion prop on the provider
 * @param packageVersion - The version of `@clerk/clerk-solidjs` that will be used if an explicit version is not provided
 * @returns The npm tag, version or major version to use
 */
export const versionSelector = (clerkJSVersion: string | undefined) => {
  if (clerkJSVersion) {
    return clerkJSVersion;
  }

  return JS_PACKAGE_VERSION;
};
