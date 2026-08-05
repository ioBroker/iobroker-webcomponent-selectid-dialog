import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://techblog.skeepers.io/create-a-web-component-from-a-react-component-bbe7c5f85ee6
export default defineConfig({
    define: {
        // Must be strings: Rolldown (Vite 8) silently ignores object values, which leaves
        // `process.env.NODE_ENV` in the bundle and throws "process is not defined" in the browser.
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env': '({})',
    },
    plugins: [react()],

    // 👇 Insert these lines
    build: {
        outDir: './build',
        lib: {
            entry: './src/index.tsx',
            name: 'iobrokerSelectId',
            fileName: format => `iobrokerSelectId.${format}.js`,
        },
        target: 'esnext',
    },
});
