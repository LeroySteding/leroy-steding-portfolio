import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'framer-motion'],
  sourcemap: true,
  minify: false,
  treeshake: true,
  bundle: true,
  splitting: false,
  // Add "use client" and copy CSS
  onSuccess: async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    // Add "use client" directive to JS files
    const mjsFile = path.join(__dirname, 'dist', 'index.mjs');
    const jsFile = path.join(__dirname, 'dist', 'index.js');
    
    const mjsContent = fs.readFileSync(mjsFile, 'utf-8');
    const jsContent = fs.readFileSync(jsFile, 'utf-8');
    
    fs.writeFileSync(mjsFile, `"use client";\n${mjsContent}`);
    fs.writeFileSync(jsFile, `"use client";\n${jsContent}`);
    
    // Copy CSS file
    const sourceFile = path.join(__dirname, 'src', 'styles.css');
    const destFile = path.join(__dirname, 'dist', 'styles.css');
    fs.copyFileSync(sourceFile, destFile);
  },
});
