<template>
  <view class="example-search">
    <t-search
      v-model="value"
      center
      placeholder="搜索预设文案"
      @change="onChange"
    />
  </view>
</template>

<script>
import TSearch from '../../../uni_modules/tdesign-uniapp/components/search/search.vue';
export default {
  components: {
    TSearch,
  },
  data() {
    return {
      value: '',
    };
  },
  created() {},
  methods: {
    onChange(detail) {
      console.log(`modelValue: ${detail.value}`);
    },
  },
};
</script>
<style>
.example-search {
    background-color: var(--bg-color-demo);
    padding: 16rpx 32rpx;
}
</style>
