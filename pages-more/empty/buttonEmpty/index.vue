<template>
  <view>
    <t-empty
      icon="info-circle-filled"
      description="描述文字"
    >
      <template
        #action
      >
        <t-button
          theme="primary"
          size="large"
        >
          操作按钮
        </t-button>
      </template>
    </t-empty>
  </view>
</template>

<script>
import TEmpty from '../../../uni_modules/tdesign-uniapp/components/empty/empty.vue';
import TButton from '../../../uni_modules/tdesign-uniapp/components/button/button.vue';


export default {
  components: {
    TEmpty,
    TButton,
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
