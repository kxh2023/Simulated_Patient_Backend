import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      path.resolve(__dirname, "node_modules/regenerator-runtime/runtime.js"),
      path.resolve(
        __dirname,
        "node_modules/@babel/runtime/regenerator/index.js"
      ),
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
