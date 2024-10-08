import { VerifyTokenOptions } from '@clerk/backend';
import {
  LegacyRedirectProps,
  MultiDomainAndOrProxy,
  SignInFallbackRedirectUrl,
  SignInForceRedirectUrl,
  SignUpFallbackRedirectUrl,
  SignUpForceRedirectUrl
} from '@clerk/types';

export type LoaderOptions = {
  publishableKey?: string;
  jwtKey?: string;
  secretKey?: string;
  authorizedParties?: [];
  signInUrl?: string;
  signUpUrl?: string;
} & Pick<VerifyTokenOptions, 'audience'> &
  MultiDomainAndOrProxy &
  SignInForceRedirectUrl &
  SignInFallbackRedirectUrl &
  SignUpForceRedirectUrl &
  SignUpFallbackRedirectUrl &
  LegacyRedirectProps;

export type AdditionalStateOptions = SignInFallbackRedirectUrl &
  SignUpFallbackRedirectUrl &
  SignInForceRedirectUrl &
  SignUpForceRedirectUrl;
