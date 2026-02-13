import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // Don't error on class name suggestions in CI
      // eslint-disable-next-line no-undef
      quiet: typeof process !== "undefined" && process.env?.CI === "true",
    }),
  ],
});
