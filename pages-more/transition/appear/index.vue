<template>
  <view>
    <t-button size="large" variant="outline" block theme="primary" @click="onTriggerClick"> Toggle attach </t-button>

    <view v-if="visible">
      <t-transition visible appear>
        <view class="block" />
      </t-transition>
    </view>
  </view>
</template>

<script>
import TButton from '../../../uni_modules/tdesign-uniapp/components/button/button.vue';
import TTransition from '../../../uni_modules/tdesign-uniapp/components/transition/transition.vue';
export default {
  components: {
    TButton,
    TTransition,
  },
  data() {
    return {
      visible: false,
    };
  },
  created() {},
  methods: {
    onTriggerClick() {
      this.visible = !this.visible;
    },
    onClose() {
      this.visible = false;
    },
  },
};
</script>
<style></style>
