<template>
  <view>
    <!-- slot实现自定义content内容 -->
    <t-notice-bar :visible="true">
      <template #content>
        <view class="inline"> 提示文字描述提示文字描述提示文字描述提示文字描述提示文字描述提示文字描述 </view>
      </template>
      <template #operation>
        <t-link content="详情" theme="primary" :underline="false" :navigator-props="navigatorProps" />
      </template>
      <template #suffix-icon>
        <t-icon name="close" size="44rpx" />
      </template>
    </t-notice-bar>
  </view>
</template>

<script>
import TIcon from '../../../uni_modules/tdesign-uniapp/components/icon/icon.vue';
import TLink from '../../../uni_modules/tdesign-uniapp/components/link/link.vue';
import TNoticeBar from '../../../uni_modules/tdesign-uniapp/components/notice-bar/notice-bar.vue';
export default {
  components: {
    TNoticeBar,
    TLink,
    TIcon,
  },
  data() {
    return {
      navigatorProps: {
        url: '/pages/home/home',
      },
    };
  },
  created() {},
  methods: {},
};
</script>
<style>
.inline {
  display: inline;
}
</style>
