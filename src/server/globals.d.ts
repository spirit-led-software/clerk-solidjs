/// <reference types="@solidjs/start/server" />
declare module '@solidjs/start/server' {
  export interface RequestEventLocals {
    auth: NonNullable<
      ReturnType<
        Awaited<
          ReturnType<
            import('@clerk/backend').ClerkClient['authenticateRequest']
          >
        >['toAuth']
      >
    >;
  }
}

export {};
