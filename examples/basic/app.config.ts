import { defineConfig } from "@solidjs/start/config";
import solidDevtools from "solid-devtools/vite";

export default defineConfig({
  middleware: "./src/middleware.ts",
  vite: {
    plugins: [
      solidDevtools({
        autoname: true,
      }),
    ],
  },
});
