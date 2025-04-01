import { createContext, ParentProps, splitProps, useContext } from 'solid-js';
import type { TanstackStartClerkProviderProps as ClerkProviderProps } from './types';

type ClerkContextValue = Partial<Omit<ClerkProviderProps, 'children'>>;

const ClerkOptionsCtx = createContext<{ value: ClerkContextValue } | undefined>(
  undefined
);

const useClerkOptions = (): ClerkContextValue => {
  const ctx = useContext(ClerkOptionsCtx) as { value: ClerkContextValue };
  return ctx.value;
};

const ClerkOptionsProvider = (
  props: ParentProps<{ options: ClerkContextValue }>
) => {
  const [local, rest] = splitProps(props, ['children']);
  return (
    <ClerkOptionsCtx.Provider value={{ value: rest.options }}>
      {local.children}
    </ClerkOptionsCtx.Provider>
  );
};

export { ClerkOptionsProvider, useClerkOptions };
