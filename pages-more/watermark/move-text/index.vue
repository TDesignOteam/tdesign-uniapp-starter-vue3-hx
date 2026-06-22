<template>
  <view>
    <t-watermark :watermark-content="watermark" :width="120" :height="60" :y="200" :x="210" movable>
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
      watermark: { text: '文字水印' },
    };
  },
};
</script>
<style scoped></style>
