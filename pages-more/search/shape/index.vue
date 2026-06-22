<template>
  <view>
    <view class="example-search">
      <t-search placeholder="搜索预设文案" />
    </view>

    <view class="example-search">
      <t-search placeholder="搜索预设文案" shape="round" />
    </view>
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
    onChange(e) {
      console.log(e.value);
    },
  },
};
</script>
<style>
.example-search {
  background-color: var(--bg-color-demo);
  padding: 16rpx 32rpx;
}

.example-search:not(:last-child) {
  margin-bottom: 32rpx;
}
</style>
