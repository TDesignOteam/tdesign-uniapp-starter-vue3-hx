<template>
  <view>
    <t-empty t-class="empty-cls" t-class-image="t-empty__image" :image="image" description="描述文字" />
  </view>
</template>

<script>
import TEmpty from '../../../uni_modules/tdesign-uniapp/components/empty/empty.vue';

export default {
  options: {
    styleIsolation: 'shared',
  },
  components: {
    TEmpty,
  },
  data() {
    return {
      image: '/static/offline/mobile/demos/empty1.png',
    };
  },
  created() {},
  methods: {},
};
</script>
<style>
:deep(.t-empty__image) {
  width: 240rpx !important;
  height: 240rpx !important;
}
</style>
