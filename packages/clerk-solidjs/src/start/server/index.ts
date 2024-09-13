export * from './auth';
export * from './middleware';

export { clerkClient } from './clerk-client';

/**
 * Re-export resource types from @clerk/backend
 */
export type {
  // Resources
  AllowlistIdentifier,
  Client,
  EmailAddress,
  ExternalAccount,
  Invitation,
  OauthAccessToken,
  Organization,
  OrganizationInvitation,
  OrganizationMembership,
  OrganizationMembershipPublicUserData,
  OrganizationMembershipRole,
  PhoneNumber,
  SMSMessage,
  Session,
  SignInToken,
  Token,
  User,
  // Webhook event types
  WebhookEvent,
  WebhookEventType
} from '@clerk/backend';
