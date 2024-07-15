import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ClerkProvider } from "clerk-solidjs";
import { Show, Suspense } from "solid-js/web";

import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        >
          <Suspense>{props.children}</Suspense>
        </ClerkProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
