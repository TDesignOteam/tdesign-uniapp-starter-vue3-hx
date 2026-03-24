import App from './App'
import './style/app.less';
import DemoBaseMixin from './mixins/demo-base.js';

import TDemo from './uni_modules/tdesign-uniapp/components/demo/demo.vue';
import TNavbar from './uni_modules/tdesign-uniapp/components/navbar/navbar.vue';
import TDemoHeader from './uni_modules/tdesign-uniapp/components/demo-header/demo-header.vue';
import TDemoNavbar from './uni_modules/tdesign-uniapp/components/demo-navbar/demo-navbar.vue';

const chooseImage = uni.chooseImage || {};
uni.chooseImage = chooseImage;

import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.mixin(DemoBaseMixin);
  app.component('t-demo', TDemo);
  app.component('t-demo-header', TDemoHeader);
  app.component('t-demo-navbar', TDemoNavbar);
  app.component('t-navbar', TNavbar);
  return {
    app
  }
}
