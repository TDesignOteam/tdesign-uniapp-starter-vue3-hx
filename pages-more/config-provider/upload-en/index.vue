<template>
  <t-config-provider :global-config="globalConfig">
    <view class="upload-demo">
      <t-upload
        :media-type="['video', 'image']"
        :files="originFiles"
        :grid-config="gridConfig"
        @success="handleSuccess"
        @remove="handleRemove"
        @click="handleClick"
      />
    </view>
  </t-config-provider>
</template>

<script>
import TConfigProvider from '../../../uni_modules/tdesign-uniapp/components/config-provider/config-provider.vue';
import enUS from '../../../uni_modules/tdesign-uniapp/components/locale/en_US';
import TUpload from '../../../uni_modules/tdesign-uniapp/components/upload/upload.vue';

export default {
  components: {
    TConfigProvider,
    TUpload,
  },
  data() {
    return {
      globalConfig: enUS,
      originFiles: [
        {
          url: '/static/offline/mobile/demos/example4.png',
          name: 'uploaded1.png',
          type: 'image',
          status: 'loading',
        },
        {
          url: '/static/offline/mobile/demos/example5.png',
          name: 'uploaded2.png',
          type: 'image',
          percent: 68,
          status: 'loading',
        },
        {
          url: '/static/offline/mobile/demos/example5.png',
          name: 'uploaded4.png',
          type: 'image',
          status: 'failed',
        },
      ],
      gridConfig: {
        column: 4,
        width: 160,
        height: 160,
      },
    };
  },
  methods: {
    handleSuccess(e) {
      const { files } = e;
      this.originFiles = files;
    },
    handleRemove(e) {
      const { index } = e;
      this.originFiles.splice(index, 1);
    },
    handleClick(e) {
      console.log(e.file);
    },
  },
};
</script>
<style scoped lang="less">
.upload-demo {
  background-color: var(--td-bg-color-container);
  padding: 32rpx;
}
</style>
