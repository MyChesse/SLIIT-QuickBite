import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["jspdf", "jspdf-autotable", "html2canvas"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
