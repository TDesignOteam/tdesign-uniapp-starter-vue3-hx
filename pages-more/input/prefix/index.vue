<template>
  <view>
    <t-input
      prefix-icon="app"
      label="标签文字"
      placeholder="请输入文字"
    />

    <t-input
      prefix-icon="app"
      placeholder="请输入文字"
    />
  </view>
</template>

<script>
import TInput from '../../../uni_modules/tdesign-uniapp/components/input/input.vue';
export default {
  components: {
    TInput,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style>
</style>
