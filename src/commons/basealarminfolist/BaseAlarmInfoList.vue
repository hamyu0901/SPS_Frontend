<template>
  <v-layout :class="['base-alarm-info-list']">
      <v-layout :class="['base-alarm-info-list__title']">
          <v-chip :class="['base-alarm-info-list__title-chip']">{{datas.robotAlarmInfoItem.code}}</v-chip>
          <v-spacer></v-spacer>
          <v-btn v-if="!datas.robotAlarmInfoItem.robot_id" :flat="true" @click="clickPdfBtn" :class="['base-alarm-info-list__title-button']">
              <img width="20" src="@/images/pdf.png" alt="pdf" class="mr-2">
              {{ ui.solution }}
          </v-btn>
      </v-layout>
      <base-modal
          :title="`${datas.robotAlarmInfoItem.spc_code}.pdf`"
          :is-open="datas.isPdfOpen"
          @onCloseModal="datas.isPdfOpen=false"
      >
          <pdf-view :src="datas.src"></pdf-view>
      </base-modal>
      <v-layout :class="['base-alarm-info-list__contents']">
          <v-expansion-panel v-model="datas.expandPanelKey" expand>
              <v-expansion-panel-content
                :class="['base-alarm-info-list__contents-item']"
                v-for="(robotAlarmInfoHeaderItem, robotAlarmInfoHeaderItemIndex) in datas.robotAlarmInfoHeaderItems"
                :key="robotAlarmInfoHeaderItemIndex"
                :disabled="(robotAlarmInfoHeaderItem.id !== datas.robotAlarmInfoHeaderItems[4].id)"
              >
                  <template v-slot:header>
                      <v-layout :class="['base-alarm-info-list__contents-item-title']">
                          <span>{{robotAlarmInfoHeaderItem.title}}</span>
                          <p>{{robotAlarmInfoHeaderItem.id !== datas.robotAlarmInfoHeaderItems[4].id ? datas.robotAlarmInfoItem[robotAlarmInfoHeaderItem.id] : ''}}</p>
                      </v-layout>
                  </template>
                  <v-layout :class="['base-alarm-info-list__contents-item-expand']" v-if="robotAlarmInfoHeaderItem.id === datas.robotAlarmInfoHeaderItems[4].id">
                      <base-alarm-remedy-item
                          v-for="(robotAlarmRemedyItem, robotAlarmRemedyItemIndex) in datas.robotAlarmInfoItem[robotAlarmInfoHeaderItem.id]" :key="'robotAlarmRemedyItem' + robotAlarmRemedyItemIndex"
                          :robot-alarm-remedy-item="robotAlarmRemedyItem"
                          :style="robotAlarmRemedyItemIndex !== datas.robotAlarmInfoItem[robotAlarmInfoHeaderItem.id].length-1 && `border-bottom: 1px dotted #FFFFFF`"
                      />
                  </v-layout>
              </v-expansion-panel-content>
          </v-expansion-panel>
      </v-layout>
  </v-layout>
</template>



<script>
import BaseAlarmRemedyItem from "@/commons/basealarmremedyitem/BaseAlarmRemedyItem.vue";
import pdf from "vue-pdf";
import BaseModal from "@/commons/basemodal/BaseModal.vue";
import PdfView from "@/commons/pdf/PdfView.vue";
import { getSpcAlarmFileAPI } from "@/api/alarmAPI";
import { isEmpty } from "lodash";

export default {
  props: {
    robotAlarmInfoItems : Array
  },
  components: {PdfView, BaseModal, BaseAlarmRemedyItem},
  data(vm) {
    return {
      ui: {
          solution: vm.$t('common.alarmInfoList.header.solution')
      },
      datas: {
          robotAlarmInfoHeaderItems: [
              { id: 'name', title: vm.$t('common.alarmInfoList.header.factory')},
              { id: 'type_name', title: vm.$t('common.alarmInfoList.header.alarmType') },
              { id: 'sub_code', title: vm.$t('common.alarmInfoList.header.subCode') },
              { id: 'contents', title: vm.$t('common.alarmInfoList.header.contents') },
              { id: 'solution', title: vm.$t('common.alarmInfoList.header.solution') },
          ],
          robotAlarmInfoItem: {},
          expandPanelKey: [false, false, false, false, true],
          isPdfOpen: false,
          src: null,
      }
    }
  },

  computed: {

  },
  mounted() {},
  watch: {
    robotAlarmInfoItems: {
      handler(val) {
        this.datas.robotAlarmInfoItem = val.length > 0 ? val[0] : {};
        isEmpty(val) && (this.datas.expandPanelKey = [false, false, false, false, true]);
      }
    }
  },

  methods: {
      async clickPdfBtn() {
          this.datas.isPdfOpen = true;
          await getSpcAlarmFileAPI({
              alarm_code: this.datas.robotAlarmInfoItem.spc_code
          }).then((res) => {
              this.datas.isPdfOpen = true;
              this.datas.src = pdf.createLoadingTask(URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' })));

          }).catch(() => {
              window.alert(this.$t('common.window.noFile'));
              this.datas.src = null;
              this.datas.isPdfOpen = false;
          })
      }

  }
}
</script>
<style scoped lang="scss">
@import 'BaseAlarmInfoList';
</style>
