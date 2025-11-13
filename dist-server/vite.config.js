"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    resolve: {
        alias: {
            "@": path_1.default.resolve(__dirname, "client", "src"),
            "@shared": path_1.default.resolve(__dirname, "shared"),
        },
    },
    root: path_1.default.resolve(__dirname, "client"),
    base: "/",
    build: {
        outDir: path_1.default.resolve(__dirname, "dist"),
        emptyOutDir: true,
        chunkSizeWarningLimit: 2000,
        target: "es2020",
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                },
            },
        },
    },
    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
            },
        },
    },
});
