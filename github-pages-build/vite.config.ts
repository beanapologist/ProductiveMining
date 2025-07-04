import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/productive-mining-platform/",
  resolve: {
    alias: {
      "@": path.resolve("./client/src"),
      "@shared": path.resolve("./shared"),
    },
  },
  build: {
    rollupOptions: {
      input: "./client/index.html",
    },
    outDir: "./dist",
    emptyOutDir: true,
  },
});