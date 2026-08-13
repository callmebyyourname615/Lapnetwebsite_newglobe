import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: "/",

  html: {
    // Replace this placeholder per request at the hosting/reverse-proxy layer
    // when you move to header-based nonce CSP in production.
    cspNonce: "__CSP_NONCE__",
  },

  build: {
    sourcemap: false,
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    target: "es2020",
  },

  server: {
    port: 5173,
    host: "127.0.0.1",
    strictPort: true,
    proxy: {
      "/uploads": {
        target: "https://www.lapnet.com.la",
        changeOrigin: true,
        secure: true,
      },
    },
    cors: {
      origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
    },
    headers: {
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  },

  preview: {
    host: "127.0.0.1",
    strictPort: true,
    cors: false,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  },
});
