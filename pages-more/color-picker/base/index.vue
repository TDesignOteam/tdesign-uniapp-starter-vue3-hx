<template>
  <view>
    <t-color-picker @change="onChange" />
  </view>
</template>

<script>
import TColorPicker from '../../../uni_modules/tdesign-uniapp/components/color-picker/color-picker.vue';
export default {
  components: {
    TColorPicker,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onChange(...args) {
      console.log('change:', ...args);
    },
  },
};
</script>
<style>
</style>
