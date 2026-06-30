<template>
  <view class="loading-container-flex">
    <t-loading v-if="!skylineRender" theme="circular" size="40rpx" t-class="wrapper" />
    <t-loading theme="spinner" size="40rpx" t-class="wrapper" />
    <t-loading theme="dots" size="80rpx" t-class="wrapper" />
    <t-loading theme="custom" t-class="wrapper">
      <template #indicator>
        <t-image custom-style="width: 100%; height: 100%" src="/static/offline/mobile/demos/logo2.png" />
      </template>
    </t-loading>
  </view>
</template>

<script>
import TImage from '../../../uni_modules/tdesign-uniapp/components/image/image.vue';
import TLoading from '../../../uni_modules/tdesign-uniapp/components/loading/loading.vue';
import SkylineBehavior from '../../../uni_modules/tdesign-uniapp/components/mixins/skyline.js';
export default {
  options: {
    styleIsolation: 'shared',
  },
  components: {
    TLoading,
    TImage,
  },
  mixins: [SkylineBehavior],
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style>
.loading-container-flex {
  display: flex;
  align-items: center;
}

:deep(.wrapper) {
  margin-right: 40px;
}
</style>
