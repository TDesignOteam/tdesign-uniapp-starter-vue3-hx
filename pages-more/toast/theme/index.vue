<template>
  <view>
    <t-toast
      ref="t-toast"
    />

    <view class="box">
      <t-button
        theme="primary"
        size="large"
        variant="outline"
        block
        @click="showSuccessToast"
      >
        成功提示
      </t-button>
      <t-button
        theme="primary"
        size="large"
        variant="outline"
        block
        @click="showWarningToast"
      >
        警告提示
      </t-button>
      <t-button
        theme="primary"
        size="large"
        variant="outline"
        block
        @click="showErrorToast"
      >
        错误提示
      </t-button>
    </view>
  </view>
</template>

<script>
import TToast from '../../../uni_modules/tdesign-uniapp/components/toast/toast.vue';
import TButton from '../../../uni_modules/tdesign-uniapp/components/button/button.vue';
import Toast from '../../../uni_modules/tdesign-uniapp/components/toast/index';
export default {
  components: {
    TToast,
    TButton,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    showSuccessToast() {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '成功文案',
        theme: 'success',
        direction: 'column',
      });
    },
    showWarningToast() {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '警告文案',
        theme: 'warning',
        direction: 'column',
      });
    },
    showErrorToast() {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '错误文案',
        theme: 'error',
        direction: 'column',
      });
    },
  },
};
</script>
<style>
</style>
