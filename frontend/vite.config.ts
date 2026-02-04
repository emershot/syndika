import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Middleware de CORS para desenvolvimento local
    cors: true,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Minimização otimizada
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === "production",
      },
    },
    // Chunk splitting inteligente
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-select'],
          'vendor-forms': ['react-hook-form', 'zod'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-other': ['axios', 'date-fns', 'uuid', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // CSS splitting
    cssCodeSplit: true,
    // Source maps em produção para debugging
    sourcemap: mode === "production" ? "hidden" : true,
    // Tamanho do chunk warning
    chunkSizeWarningLimit: 1000,
  },
}));
