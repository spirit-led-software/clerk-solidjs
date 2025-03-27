import { A, Navigate } from "@solidjs/router";
import {
  Protect,
  SignInButton,
  SignOutButton,
  useAuth,
  useUser,
} from "@clerk-solidjs/start";
import { auth } from "@clerk-solidjs/start/server";
import { createResource, Show } from "solid-js";
import { getRequestEvent } from "solid-js/web";

async function getSignedIn() {
  "use server";
  const { userId } = auth();
  return !!userId;
}

export default function ProtectedPage() {
  const [isSignedIn] = createResource(getSignedIn);
  const { user } = useUser();

  return (
    <div class="flex flex-col w-screen h-screen items-center justify-center gap-2">
      <Show
        when={isSignedIn()}
        fallback={
          <div class="flex flex-col justify-center items-center">
            You are not signed in
          </div>
        }
      >
        Welcome, {user()?.fullName}
      </Show>
      <A href="/" class="bg-slate-200 rounded-md px-3 py-1">
        Back
      </A>
    </div>
  );
}
