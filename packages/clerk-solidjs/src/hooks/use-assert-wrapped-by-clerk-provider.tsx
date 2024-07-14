import { useContext } from 'solid-js';
import { ClerkInstanceContext } from '../contexts/clerk-instance';

export function useAssertWrappedByClerkProvider(
  displayNameOrFn: string | (() => void)
): void {
  const ctx = useContext(ClerkInstanceContext);

  if (!ctx) {
    if (typeof displayNameOrFn === 'function') {
      displayNameOrFn();
      return;
    }

    throw new Error(
      `${displayNameOrFn} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
    );
  }
}
