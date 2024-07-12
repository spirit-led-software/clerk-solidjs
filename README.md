# clerk-solidjs

<div align="center">

This is an unofficial community-port of the [Clerk React SDK](https://www.npmjs.com/package/@clerk/clerk-react) for [SolidJS](https://solidjs.com) and [SolidStart](https://start.solidjs.com).

[![Clerk documentation](https://img.shields.io/badge/documentation-clerk-green.svg)](https://clerk.com/docs?utm_source=github&utm_medium=clerk_solidjs)

</div>

---

## Overview

Clerk is the easiest way to add authentication and user management to your SolidJS application. Add sign up, sign in, and profile management to your application in minutes.

## Getting Started

### Prerequisites

- SolidJS v1+
- Node.js `>=18` or later OR Bun `>=1`

### Installation

```sh
npm install clerk-solidjs
# or
yarn add clerk-solidjs
# or
pnpm add clerk-solidjs
# or
bun add clerk-solidjs
```

### Build

```sh
bun run build
```

To build the package in watch mode, run the following:

```sh
bun run dev
```

## Usage

Clerk requires your application to be wrapped in the `<ClerkProvider />` context.

If using Vite, set `VITE_CLERK_PUBLISHABLE_KEY` to your Publishable key in your `.env.local` file to make the environment variable accessible on `process.env` and pass it as the `publishableKey` prop.

```jsx
// App.tsx

import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js/web';
import { ClerkProvider } from 'clerk-solidjs';

import './app.css';

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
```

### Middleware

Clerk provides the `clerkMiddleware` helper function which can be used in `solid-start` middleware.

See [SolidStart middleware](https://docs.solidjs.com/solid-start/advanced/middleware) for how to enable middleware.

```js
// middleware.ts

import { createMiddleware } from '@solidjs/start/middleware';
import { clerkMiddleware } from 'clerk-solidjs';

export default createMiddleware({
  onRequest: [
    clerkMiddleware({
        publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
        secretKey: import.meta.env.CLERK_SECRET_KEY
    }),
    // ... other middleware
});
```

Then you can use the `auth` helper function to access the auth object.

## Support

You can get in touch in any of the following ways:

- Join the Clerk official community [Discord server](https://clerk.com/discord)
- Create a [GitHub Discussion](https://github.com/ian-pascoe/clerk-solidjs/discussions)
- Contact options listed on [the Clerk Support page](https://clerk.com/support?utm_source=github&utm_medium=clerk_solidjs)

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read [our contribution guidelines](https://github.com/ian-pascoe/clerk-solidjs/blob/master/docs/CONTRIBUTING.md).

## Security

`clerk-solidjs` follows good practices of security, but 100% security cannot be assured.

`clerk-solidjs` is provided **"as is"** without any **warranty**. Use at your own risk.

_For more information and to report security issues, please refer to our [security documentation](https://github.com/ian-pascoe/clerk-solidjs/blob/main/docs/SECURITY.md)._

## License

This project is licensed under the **MIT license**.

See [LICENSE](https://github.com/ian-pascoe/clerk-solidjs/blob/main/packages/react/LICENSE) for more information.
