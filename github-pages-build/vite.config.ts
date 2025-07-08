import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/ProductiveMining/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
    outDir: "./dist",
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ["@replit/vite-plugin-runtime-error-modal", "@replit/vite-plugin-cartographer"]
  },
});