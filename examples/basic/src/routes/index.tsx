import { SignedIn, SignedOut, SignInButton, UserButton } from "clerk-solidjs";

export default function Index() {
  return (
    <div class="flex flex-col w-screen h-screen items-center justify-center">
      <h1 class="text-3xl font-bold">
        <span class="font-mono">clerk-solidjs</span> Example
      </h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
