import { LoadedClerk } from '@clerk/types';
import { Accessor, createContext, createMemo, JSX, useContext } from 'solid-js';

const ClerkInstanceContext = createContext<Accessor<LoadedClerk>>();

const ClerkInstanceContextProvider = (props: {
  clerk: LoadedClerk;
  children: JSX.Element;
}) => {
  const clerk = createMemo(() => props.clerk);

  return (
    <ClerkInstanceContext.Provider value={clerk}>
      {props.children}
    </ClerkInstanceContext.Provider>
  );
};

function useClerkInstanceContext() {
  const ctx = useContext(ClerkInstanceContext);

  if (!ctx) {
    throw new Error(
      `ClerkInstanceProvider can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
    );
  }

  return ctx;
}

export {
  ClerkInstanceContext,
  ClerkInstanceContextProvider,
  useClerkInstanceContext
};
