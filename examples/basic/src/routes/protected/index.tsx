import { Protect, useAuth } from "clerk-solidjs";
import { Show } from "solid-js";

export default function ProtectedPage() {
  const { userId } = useAuth();

  return (
    <div class="flex flex-col w-screen h-screen items-center justify-center">
      <Show
        when={userId()}
        fallback={<p>You are not signed in. Please sign in to continue.</p>}
      >
        Welcome, {userId()}
      </Show>
    </div>
  );
}
