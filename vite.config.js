import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".", // root of your project (frontend)
  publicDir: "public", // assets like images, icons
  server: {
    open: "/pages/login.html", // open login by default
    port: 5173,
    watch: {
      usePolling: true, // fixes live reload on Windows
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),

        // ✅ Ensure all your pages exist and names match exactly
        login: resolve(__dirname, "pages/login.html"),
        signup: resolve(__dirname, "pages/signup.html"),
        dashboard: resolve(__dirname, "pages/dashboard.html"), // ✅ capital D if file name has capital
        profile: resolve(__dirname, "pages/Profile.html"), // ✅ same here if capitalized
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
