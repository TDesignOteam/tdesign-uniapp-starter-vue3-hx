<template>
  <view>
    <t-watermark
      :watermark-content="watermark"
      :width="120"
      :height="20"
      :x="56"
      :y="76"
    >
      <view style="width: 100%; height: 300px" />
    </t-watermark>
  </view>
</template>

<script>
import TWatermark from '../../../uni_modules/tdesign-uniapp/components/watermark/watermark.vue';

export default {
  components: {
    TWatermark,
  },
  data() {
    return {
      watermark: {
        url: 'https://tdesign.gtimg.com/starter/brand-logo-light.png',
      },
    };
  },
};
</script>
<style scoped></style>
