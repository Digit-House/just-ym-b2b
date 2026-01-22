import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    build: {
      // Ensure that environment variables are properly exposed in production builds
      sourcemap: mode === 'development',
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
