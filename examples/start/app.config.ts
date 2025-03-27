import { defineConfig } from "@solidjs/start/config";
import solidDevtools from "solid-devtools/vite";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  middleware: "./src/middleware.ts",
  vite: {
    plugins: [
      tailwind(),
      solidDevtools({
        autoname: true,
      }),
    ],
  },
});
