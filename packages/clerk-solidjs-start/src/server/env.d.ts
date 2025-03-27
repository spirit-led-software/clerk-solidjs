/// <reference types="@solidjs/start/server" />

import { AuthObject } from '@clerk/backend';

declare module '@solidjs/start/server' {
  export interface RequestEventLocals {
    auth: AuthObject;
  }
}

export {};
