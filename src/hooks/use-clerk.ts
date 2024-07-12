import { useClerkInstanceContext } from '../contexts/clerk-instance';
import { useAssertWrappedByClerkProvider } from './use-assert-wrapped-by-clerk-provider';

export const useClerk = () => {
  useAssertWrappedByClerkProvider('useClerk');
  return useClerkInstanceContext();
};
