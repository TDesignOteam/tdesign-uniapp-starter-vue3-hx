<template>
  <t-qrcode
    value="https://tdesign.tencent.com/"
    :borderless="true"
  />
</template>

<script>
import TQrcode from '../../../uni_modules/tdesign-uniapp/components/qrcode/qrcode.vue';

export default {
  name: 'QRCodeBorderless',
  components: {
    TQrcode,
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
