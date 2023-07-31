<template>
  <div>
    <span v-if="params.value === this.$t(`settingDlg.datas.reportItems.alarmLevel`)[0]"><img class="mt-2" src="@/images/img_alarm_high.png"/></span>
    <span v-if="params.value === this.$t(`settingDlg.datas.reportItems.alarmLevel`)[1]"><img class="mt-2" src="@/images/img_alarm_middle.png"/></span>
    <span v-if="params.value === this.$t(`settingDlg.datas.reportItems.alarmLevel`)[2]"><img class="mt-2" src="@/images/img_alarm_low.png"/></span>
  </div>

</template>
<script>
    export default {
    data: function () {
      return {
      };
    },
    beforeMount() {
    },
    mounted() {},
    methods: {},
  };
</script>