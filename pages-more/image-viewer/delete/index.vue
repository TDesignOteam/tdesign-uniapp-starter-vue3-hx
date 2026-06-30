<template>
  <view>
    <t-button theme="primary" size="large" variant="outline" block @click="onClick"> 带操作图片预览 </t-button>

    <t-action-sheet ref="t-action-sheet" />

    <t-image-viewer
      :using-custom-navbar="!isMPAlipay"
      :delete-btn="deleteBtn"
      :close-btn="closeBtn"
      :show-index="showIndex"
      :visible="visible"
      :images="images"
      :custom-navbar-height="gCustomNavbarHeight"
      @change="onChange"
      @delete="onDelete"
      @close="onClose"
    />
  </view>
</template>

<script>
import { ActionSheetPlugin } from '../../../uni_modules/tdesign-uniapp/components/index';
import TActionSheet from '../../../uni_modules/tdesign-uniapp/components/action-sheet/action-sheet.vue';
import TButton from '../../../uni_modules/tdesign-uniapp/components/button/button.vue';
import TImageViewer from '../../../uni_modules/tdesign-uniapp/components/image-viewer/image-viewer.vue';

export default {
  components: {
    TButton,
    TActionSheet,
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
      this.closeBtn = true;
      this.deleteBtn = true;
    },
    onChange(e) {
      const { index } = e;
      console.log(index);
    },
    onDelete(e) {
      const { index } = e;
      console.log(index);
      ActionSheetPlugin.show({
        context: this,
        selector: '#t-action-sheet',
        description: '要删除这张照片吗？',
        items: [
          {
            label: '删除',
            color: '#d54941',
          },
        ],
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
