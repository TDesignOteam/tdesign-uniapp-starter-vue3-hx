<template>
  <view>
    <t-input label="左对齐" placeholder="请输入文字" />
    <t-input label="居中" placeholder="请输入文字" align="center" />
    <t-input label="右对齐" placeholder="请输入文字" align="right" />
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
<style></style>
