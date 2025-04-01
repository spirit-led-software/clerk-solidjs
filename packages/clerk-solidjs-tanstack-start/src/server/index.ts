export * from './middleware-handler';

export { clerkClient } from './clerk-client';
export * from './get-auth';

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
  OrganizationDomain,
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
