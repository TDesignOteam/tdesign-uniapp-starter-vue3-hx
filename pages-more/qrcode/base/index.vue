<template>
  <t-qrcode value="https://tdesign.tencent.com/" level="M" status="active" />
</template>

<script>
import TQrcode from '../../../uni_modules/tdesign-uniapp/components/qrcode/qrcode.vue';

export default {
  name: 'QRCodeBase',
  components: {
    TQrcode,
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
