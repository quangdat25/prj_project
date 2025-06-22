import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dns from "dns";
import path from "path";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
        silenceDeprecations: [
          "mixed-decls",
          "color-functions",
          "global-builtin",
          "import",
        ],
      },
    },
  },

  resolve: {
    alias: {
      services: path.resolve(__dirname, "src/services"),
      pages: path.resolve(__dirname, "src/pages"),
      components: path.resolve(__dirname, "src/components"),
      layout: path.resolve(__dirname, "src/layout.tsx"),
      // THÊM ALIAS NÀY VÀO ĐÂY
      styles: path.resolve(__dirname, "src/styles"), // Đảm bảo thư mục 'styles' nằm ngay trong 'src'
    },
  },
});
