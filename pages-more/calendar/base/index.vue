<template>
  <view>
    <t-calendar
      :visible="visible"
      @update:visible="(e) => visible = e"
      @confirm="handleConfirm"
      @close="onClose"
    />
    <t-cell
      arrow
      title="单个选择日历"
      :note="formatTimestamp(value)"
      @click="handleCalendar"
    />
  </view>
</template>
<script>
import TCalendar from '../../../uni_modules/tdesign-uniapp/components/calendar/calendar.vue';
import TCell from '../../../uni_modules/tdesign-uniapp/components/cell/cell.vue';

import { formatTimestamp } from '../computed';


export default {
  components: {
    TCalendar,
    TCell,
  },
  data() {
    return {
      visible: false,
      value: null,
    };
  },
  created() {},
  methods: {
    formatTimestamp,
    handleCalendar() {
      this.visible = true;
    },
    handleConfirm(e) {
      const { value } = e;
      console.log(value);
      this.value = value;
    },
    onClose(detail) {
      console.log(detail.trigger);
    },
  },
};
</script>
<style>
</style>
