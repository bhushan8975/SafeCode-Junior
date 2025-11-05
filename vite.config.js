import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // ✅ This base path fixes GitHub Pages white screen + 404 issues
  base: "/SafeCode-Junior/",

  root: ".", // frontend root
  publicDir: "public", // static assets

  server: {
    open: "/pages/login.html",
    port: 5173,
    watch: {
      usePolling: true,
    },
  },

  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "pages/login.html"),
        signup: resolve(__dirname, "pages/signup.html"),
        dashboard: resolve(__dirname, "pages/dashboard.html"),
        profile: resolve(__dirname, "pages/profile.html"), // ✅ use exact filename
        lessons: resolve(__dirname, "pages/lessons.html"),
        newsfeed: resolve(__dirname, "pages/newsfeed.html"),
        compiler: resolve(__dirname, "pages/compiler.html"),
        leaderboard: resolve(__dirname, "pages/leaderboard.html"),
        notes: resolve(__dirname, "pages/notes.html"),
        roadmap: resolve(__dirname, "pages/roadmap.html"),
        videos: resolve(__dirname, "pages/videos.html"),
      },
    },
  },
});
