<template>
  <view>
    <t-avatar-group cascading="right-up" :max="5" @collapsed-item-click="onClickCollapsedAvatar">
      <t-avatar v-for="(pic, index) in pics" :key="index" :image="pic" />
    </t-avatar-group>
  </view>
</template>

<script>
import TAvatar from '../../../uni_modules/tdesign-uniapp/components/avatar/avatar.vue';
import TAvatarGroup from '../../../uni_modules/tdesign-uniapp/components/avatar-group/avatar-group.vue';
export default {
  components: {
    TAvatar,
    TAvatarGroup,
  },
  data() {
    return {
      pics: [
        '/static/offline/mobile/demos/avatar1.png',
        '/static/offline/mobile/demos/avatar2.png',
        '/static/offline/mobile/demos/avatar3.png',
        '/static/offline/mobile/demos/avatar4.png',
        '/static/offline/mobile/demos/avatar5.png',
        '/static/offline/mobile/demos/avatar1.png',
      ],
      pic: '',
    };
  },
  created() {},
  methods: {
    onAddTap() {
      uni.showToast({
        title: '您按下了添加',
        icon: 'none',
        duration: 1000,
      });
    },
    onClickCollapsedAvatar() {
      console.log('click collapsed avatar');
    },
  },
};
</script>
<style></style>
