import { getPublicEnvVariables } from '../utils/env';
import { SolidStartClerkProviderProps } from './types';

type SolidStartProviderAndInitialProps = Omit<
  SolidStartClerkProviderProps,
  'children'
>;

export const pickFromClerkInitState = (
  clerkInitState: any
): SolidStartProviderAndInitialProps & {
  clerkSsrState: any;
} => {
  const {
    __clerk_ssr_state,
    __publishableKey,
    __proxyUrl,
    __domain,
    __isSatellite,
    __signInUrl,
    __signUpUrl,
    __afterSignInUrl,
    __afterSignUpUrl,
    __clerkJSUrl,
    __clerkJSVersion,
    __telemetryDisabled,
    __telemetryDebug,
    __signInForceRedirectUrl,
    __signUpForceRedirectUrl,
    __signInFallbackRedirectUrl,
    __signUpFallbackRedirectUrl
  } = clerkInitState || {};

  return {
    clerkSsrState: __clerk_ssr_state,
    publishableKey: __publishableKey,
    proxyUrl: __proxyUrl,
    domain: __domain,
    isSatellite: !!__isSatellite,
    signInUrl: __signInUrl,
    signUpUrl: __signUpUrl,
    afterSignInUrl: __afterSignInUrl,
    afterSignUpUrl: __afterSignUpUrl,
    clerkJSUrl: __clerkJSUrl,
    clerkJSVersion: __clerkJSVersion,
    telemetry: {
      disabled: __telemetryDisabled,
      debug: __telemetryDebug
    },
    signInForceRedirectUrl: __signInForceRedirectUrl,
    signUpForceRedirectUrl: __signUpForceRedirectUrl,
    signInFallbackRedirectUrl: __signInFallbackRedirectUrl,
    signUpFallbackRedirectUrl: __signUpFallbackRedirectUrl
  };
};

export const mergeWithPublicEnvs = (restInitState: any) => {
  const publicEnvVariables = getPublicEnvVariables();
  return {
    ...restInitState,
    publishableKey:
      restInitState.publishableKey || publicEnvVariables.publishableKey,
    domain: restInitState.domain || publicEnvVariables.domain,
    isSatellite: restInitState.isSatellite || publicEnvVariables.isSatellite,
    signInUrl: restInitState.signInUrl || publicEnvVariables.signInUrl,
    signUpUrl: restInitState.signUpUrl || publicEnvVariables.signUpUrl,
    afterSignInUrl:
      restInitState.afterSignInUrl || publicEnvVariables.afterSignInUrl,
    afterSignUpUrl:
      restInitState.afterSignUpUrl || publicEnvVariables.afterSignUpUrl,
    clerkJSUrl: restInitState.clerkJSUrl || publicEnvVariables.clerkJsUrl,
    clerkJSVersion:
      restInitState.clerkJSVersion || publicEnvVariables.clerkJsVersion,
    signInForceRedirectUrl: restInitState.signInForceRedirectUrl,
    clerkJSVariant:
      restInitState.clerkJSVariant || publicEnvVariables.clerkJsVariant
  };
};
