import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';
import {
  genVersionMpVitePlugin,
  genVersionWebVitePlugin,
} from '@plugin-light/vite-plugin-gen-version/lib/index.js';
import { BUILD_NAME_MAP } from 't-comm/lib/v-console/config';

const diffPlugins = [];

if (process.env.UNI_PLATFORM !== 'h5') {
  diffPlugins.push(genVersionMpVitePlugin());
} else {
  diffPlugins.push(genVersionWebVitePlugin({
    buildName: BUILD_NAME_MAP.build,
    commitName: BUILD_NAME_MAP.commit,
    delay: 0,
  }));
}

export default defineConfig({
  plugins: [
    uni(), 
    ...diffPlugins
  ],
  resolve: {
    alias: {
    },
  },
});
