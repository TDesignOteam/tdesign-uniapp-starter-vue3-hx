<template>
  <view>
    <t-radio-group default-value="radio1" :disabled="true">
      <t-radio value="radio1" label="单选" />
      <t-radio value="radio2" label="单选" />
    </t-radio-group>
  </view>
</template>

<script>
import TRadio from '../../../uni_modules/tdesign-uniapp/components/radio/radio.vue';
import TRadioGroup from '../../../uni_modules/tdesign-uniapp/components/radio-group/radio-group.vue';
export default {
  components: {
    TRadioGroup,
    TRadio,
  },
  /**
   * 组件的属性列表
   */
  props: {},
  data() {
    return {};
  },
  created() {},
  /**
   * 组件的方法列表
   */
  methods: {},
};
</script>
<style></style>
