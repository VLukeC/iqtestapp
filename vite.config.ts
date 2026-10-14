import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5000",
    },
    watch: {
      ignored: ["**/*.backup", "**/*.backup.gz", "**/supabase/.temp/**"],
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
