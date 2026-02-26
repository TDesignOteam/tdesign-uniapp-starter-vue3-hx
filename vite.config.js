import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@tdesign/uniapp': path.resolve(__dirname, './uni_modules/tdesign-uniapp/components'),
      '@tdesign/uniapp-chat': path.resolve(__dirname, './uni_modules/tdesign-uniapp-chat/components'),
    },
  },
});
