<template>
  <view>
    <t-watermark :watermark-content="watermark" :x="100" :y="140" :width="120" :height="30" movable>
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
      watermark: { url: '/static/offline/site/baseLogo-light.png' },
    };
  },
};
</script>
<style scoped></style>
