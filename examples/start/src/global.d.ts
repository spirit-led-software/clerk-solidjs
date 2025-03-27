/// <reference types="@solidjs/start/env" />
/// <reference types="@solidjs/start/server" />
import { AuthReturn } from "clerk-solidjs/server";

declare module "@solidjs/start/server" {
  export interface RequestEventLocals {
    auth: AuthReturn;
  }
}

export {};
