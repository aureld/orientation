import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    root: __dirname,
    globals: true,
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "src/test-setup.ts")],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
