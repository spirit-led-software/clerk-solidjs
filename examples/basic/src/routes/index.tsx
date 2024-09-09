import { useWindowSize } from "@solid-primitives/resize-observer";
import { A } from "@solidjs/router";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "clerk-solidjs";

export default function Home() {
  const size = useWindowSize();

  return (
    <div class="flex flex-col w-screen h-screen items-center justify-center gap-2">
      <h1 class="text-3xl font-bold mb-5 font-mono bg-slate-300 rounded-md p-1">
        clerk-solidjs
      </h1>
      <ClerkLoading>
        <p>Loading...</p>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton class="bg-slate-200 rounded-md px-3 py-1" />
        </SignedOut>
        <SignedIn>
          <UserButton showName={size.width > 768} />
          <SignOutButton class="bg-slate-200 rounded-md px-3 py-1" />
        </SignedIn>
      </ClerkLoaded>
      <A href="/protected" class="bg-slate-200 rounded-md px-3 py-1">
        Protected Page
      </A>
    </div>
  );
}
