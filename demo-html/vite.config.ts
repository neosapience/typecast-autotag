import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'inline-demo-assets',
      enforce: 'post',
      generateBundle(_options, bundle) {
        const html = bundle['index.html'];
        if (!html || html.type !== 'asset') this.error('Missing demo HTML');
        let source = String(html.source);
        source = source.replace(
          /<script\b([^>]*?)\s+src="\.\/([^"]+)"[^>]*><\/script>/g,
          (_tag, attributes, file) => {
            const chunk = bundle[file];
            if (!chunk || chunk.type !== 'chunk') this.error(`Missing script: ${file}`);
            const code = chunk.code.replace(
              /<\/script|<!--/gi,
              (match) => '\\x3C' + match.slice(1)
            );
            delete bundle[file];
            return `<script${attributes}>${code}</script>`;
          }
        );
        source = source.replace(/<link\b[^>]*href="\.\/([^"]+\.css)"[^>]*>/g, (_tag, file) => {
          const css = bundle[file];
          if (!css || css.type !== 'asset') this.error(`Missing stylesheet: ${file}`);
          const code = String(css.source).replace(
            /<\/style/gi,
            (match) => '\\3C ' + match.slice(1)
          );
          delete bundle[file];
          return `<style>${code}</style>`;
        });
        html.source = source;
        if (Object.keys(bundle).some((file) => file !== 'index.html'))
          this.error('Demo must be a single HTML file');
      },
    },
  ],
  resolve: {
    alias: {
      '@neosapience/typecast-autotag/english': path.resolve(__dirname, '../src/english'),
      '@neosapience/typecast-autotag': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsInlineLimit: () => true,
    cssCodeSplit: false,
    rolldownOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
});
