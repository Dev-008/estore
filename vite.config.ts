import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-popover", "@radix-ui/react-select", "@radix-ui/react-slot", "@radix-ui/react-toast"],
          "vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority"],
          
          // Feature chunks
          "pages-shop": ["./src/pages/Index.tsx", "./src/pages/Products.tsx", "./src/pages/ProductDetail.tsx"],
          "pages-cart": ["./src/pages/Cart.tsx", "./src/pages/Wishlist.tsx", "./src/pages/Checkout.tsx", "./src/pages/Orders.tsx"],
          "pages-auth": ["./src/pages/Login.tsx", "./src/pages/Register.tsx"],
          "pages-admin": ["./src/pages/admin/Dashboard.tsx", "./src/pages/admin/AdminProducts.tsx", "./src/pages/admin/AdminOrders.tsx"],
          
          // Context/State
          "context-providers": ["./src/contexts/CartContext.tsx", "./src/contexts/AuthContext.tsx", "./src/contexts/WishlistContext.tsx"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
