import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repot ligger på https://github.com/norahaggstrom/Binice
// så sidan serveras från https://norahaggstrom.github.io/Binice/
// Därför måste alla asset-länkar peka relativt /Binice/.
export default defineConfig({
  base: "/Binice/",
  plugins: [react()],
});
