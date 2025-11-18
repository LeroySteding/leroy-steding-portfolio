import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom', 'framer-motion'],
  clean: true,
  treeshake: true,
  splitting: false,
  sourcemap: true,
});
