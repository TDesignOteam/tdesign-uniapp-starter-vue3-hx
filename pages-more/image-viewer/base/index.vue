<template>
  <view>
    <t-button theme="primary" size="large" variant="outline" block @click="onClick"> 基础图片预览 </t-button>
    <t-toast ref="t-toast" />
    <t-image-viewer
      :using-custom-navbar="!isMPAlipay"
      :custom-navbar-height="gCustomNavbarHeight"
      :delete-btn="deleteBtn"
      :close-btn="closeBtn"
      :show-index="showIndex"
      :visible="visible"
      :images="images"
      @change="onChange"
      @delete="onDelete"
      @close="onClose"
    />
  </view>
</template>

<script>
import { ToastPlugin } from '../../../uni_modules/tdesign-uniapp/components/index';
import TButton from '../../../uni_modules/tdesign-uniapp/components/button/button.vue';
import TImageViewer from '../../../uni_modules/tdesign-uniapp/components/image-viewer/image-viewer.vue';
import TToast from '../../../uni_modules/tdesign-uniapp/components/toast/toast.vue';

export default {
  components: {
    TButton,
    TToast,
    TImageViewer,
  },
  data() {
    return {
      visible: false,
      showIndex: false,
      closeBtn: false,
      deleteBtn: false,
      images: [],
    };
  },
  created() {},
  methods: {
    onClick() {
      this.images = [
        '/static/offline/mobile/demos/swiper1.png',
        '/static/offline/mobile/demos/swiper2.png',
      ];
      this.showIndex = true;
      this.visible = true;
    },
    onChange(e) {
      const { index } = e;
      console.log('change', index);
    },
    onDelete(e) {
      const { index } = e;
      ToastPlugin({
        context: this,
        selector: '#t-toast',
        message: `删除第${index + 1}个`,
      });
    },
    onClose(e) {
      const { trigger } = e;
      console.log(trigger);
      this.visible = false;
    },
  },
};
</script>
<style></style>
