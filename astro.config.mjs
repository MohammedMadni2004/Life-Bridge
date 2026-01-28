// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "static", // Static mode - Vercel webhooks trigger rebuilds, no adapter needed
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
