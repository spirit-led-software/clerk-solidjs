import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { ClerkProvider } from 'clerk-solidjs';
import { Show, Suspense } from 'solid-js/web';

import './app.css';

export default function App() {
  return (
    <Router
      root={(props) => (
        <ClerkProvider
          publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <Suspense>
            <main
              id="main"
              class={cn(
                'flex min-h-dvh w-full flex-col',
                `${props.location.pathname.startsWith('/chat') ? 'h-dvh' : ''}`
              )}
            >
              <Show when={props.location.pathname !== '/'}>
                <NavigationHeader />
              </Show>
              {props.children}
            </main>
          </Suspense>
        </ClerkProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
