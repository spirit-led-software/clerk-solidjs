export {
  /**
   * The main Clerk context provider. You must wrap your application in a `ClerkProvider` to enable Clerk features.
   *
   * If using SolidStart, import from `clerk-solidjs/start` instead.
   *
   * @example
   * ```tsx
   * // App.tsx
   * import { ClerkProvider } from 'clerk-solidjs';
   *
   * const App = () => (
   *   <Router root={(props) => (
   *     <ClerkProvider>
   *       <Suspense>{props.children}</Suspense>
   *     </ClerkProvider>
   *   )}>
   *     <Routes>
   *       <Route path="/" component={Home} />
   *     </Routes>
   *   </Router>
   * );
   * ```
   */
  ClerkProvider
} from './clerk';
