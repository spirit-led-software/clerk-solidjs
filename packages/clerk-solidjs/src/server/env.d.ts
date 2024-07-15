/// <reference types="@solidjs/start/server" />

import { AuthReturn } from '.';

declare module '@solidjs/start/server' {
  export interface RequestEventLocals {
    auth: AuthReturn;
  }
}

export {};
