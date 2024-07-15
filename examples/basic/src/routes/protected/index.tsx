import {
  Protect,
  SignInButton,
  SignOutButton,
  useAuth,
  useUser,
} from "clerk-solidjs";
import { Show } from "solid-js";

export default function ProtectedPage() {
  const { user } = useUser();

  return (
    <div class="flex flex-col w-screen h-screen items-center justify-center">
      <Show
        when={user()}
        fallback={
          <p>
            You are not signed in. Please <SignInButton /> to continue.
          </p>
        }
      >
        Welcome, {user()?.fullName}
        <SignOutButton />
      </Show>
    </div>
  );
}
