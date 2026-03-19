import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/students/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "public"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT ?? "22488"),
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port: Number(process.env.PORT ?? "22488"),
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
