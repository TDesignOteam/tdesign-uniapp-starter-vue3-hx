<template>
  <view class="stepper-example">
    <t-stepper
      disabled
      theme="filled"
    />
  </view>
</template>

<script>
import TStepper from '../../../uni_modules/tdesign-uniapp/components/stepper/stepper.vue';
export default {
  components: {
    TStepper,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style>
.stepper-example {
    padding: 32rpx;
    background-color: var(--bg-color-demo);
}
</style>
