<template>
  <view>
    <t-notice-bar
      :visible="visible"
      :prefix-icon="false"
      content="提示文字描述提示文字描述提示文字描述"
    >
      <template
        #prefix-icon
      >
        <view>
          <t-icon name="error-circle-filled" />
        </view>
      </template>
    </t-notice-bar>
  </view>
</template>

<script>
import TIcon from '../../../uni_modules/tdesign-uniapp/components/icon/icon.vue';
import TNoticeBar from '../../../uni_modules/tdesign-uniapp/components/notice-bar/notice-bar.vue';
export default {
  components: {
    TNoticeBar,
    TIcon,
  },
  data() {
    return {
      visible: true,
    };
  },
  created() {},
  methods: {},
};
</script>
<style>
</style>
