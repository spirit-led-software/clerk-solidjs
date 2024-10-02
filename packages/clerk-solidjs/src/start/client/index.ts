export {
  /**
   * The main Clerk context provider. You must wrap your application in a `ClerkProvider` to enable Clerk features.
   *
   * @example
   * ```tsx
   * // app.tsx
   * import { ClerkProvider } from 'clerk-solidjs/start';
   *
   * export default function App() {
   *   return (
   *     <Router
   *       root={(props) => (
   *         <ClerkProvider
   *           publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
   *         >
   *           <Suspense>{props.children}</Suspense>
   *         </ClerkProvider>
   *       )}
   *     >
   *       <FileRoutes />
   *     </Router>
   *   );
   * }
   * ```
   */
  ClerkProvider
} from './clerk-provider';
