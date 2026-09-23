import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// VITE_BASE задаётся в GitHub Actions (например, "/booking-app/") для деплоя на GitHub Pages.
// Локально и на своём домене остаётся "/".
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  test: {
    environment: "node",
  },
});
