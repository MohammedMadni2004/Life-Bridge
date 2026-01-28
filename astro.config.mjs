// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "static", // Static site generation (change to "hybrid" if you need API routes)
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
