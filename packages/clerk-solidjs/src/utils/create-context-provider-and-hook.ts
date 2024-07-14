import {
  ContextProviderProps,
  createContextProvider
} from '@solid-primitives/context';

export function createContextProviderAndHook<T, P extends ContextProviderProps>(
  name: string,
  factoryFn: Parameters<typeof createContextProvider<T, P>>[0]
) {
  const [ContextProvider, useContextUnsafe] = createContextProvider(factoryFn);

  const useContext = () => {
    const ctx = useContextUnsafe();
    if (ctx === undefined) {
      throw new Error(`${name} not found`);
    }
    return ctx as T;
  };

  return [ContextProvider, useContext, useContextUnsafe] as const;
}
