import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://097a-2404-8000-1038-82-1c9c-9cab-3316-4a37.ngrok-free.app/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
