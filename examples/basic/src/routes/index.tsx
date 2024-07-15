import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "clerk-solidjs";

export default function Index() {
  return (
    <div class="flex flex-col w-screen h-screen items-center justify-center">
      <h1 class="text-3xl font-bold mb-5 font-mono bg-slate-300 rounded-md p-1">
        clerk-solidjs
      </h1>
      <ClerkLoading>
        <p>Loading...</p>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
          <SignOutButton />
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}
