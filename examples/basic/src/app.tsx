import solidLogo from "./assets/solid.svg";
import viteLogo from "/vite.svg";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "clerk-solidjs";

import "./App.css";

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <ClerkLoading>
        <p>Loading...</p>
      </ClerkLoading>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          "align-items": "center",
          "justify-content": "center",
        }}
      >
        <ClerkLoaded>
          <SignedOut>
            <SignInButton class="bg-slate-200 rounded-md px-3 py-1" />
          </SignedOut>
          <SignedIn>
            <UserButton />
            <SignOutButton class="bg-slate-200 rounded-md px-3 py-1" />
          </SignedIn>
        </ClerkLoaded>
      </div>
    </ClerkProvider>
  );
}

export default App;
