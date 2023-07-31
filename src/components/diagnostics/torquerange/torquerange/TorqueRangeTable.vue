<template>
    <v-card class="text-xs-center torqueRangeTableCard" elevation="0" v-bind="[getTorqueRangeHeaderDatas, getTorqueRangeContentDatas, getWarningMargin]">
        <v-data-table
            class="elevation-0 torqueRangeTable"
            hide-actions
            :headers="headers"
            :items="tempDatas"
        >
                <template slot="headers" slot-scope="props">
                    <tr>
                        <th>{{'Step Number'}}</th>
                        <th v-for="(header, index) in props.headers" 
                        @click="onCreate(index)"
                        :key="index" 
                        :style="{color:(index == selectedValueIndex ? 'green' : ui.tableTextColor ), backgroundColor: setWarningIndex(index)}">{{ header.stepno }}</th>
                    </tr>
                </template>
                <template slot="items" slot-scope="props">
                    <tr>
                        <td title="torque min">{{'Min'}}</td>
                        <td class="text-xs-center" v-for="(minTorqueData, minIndex) in minTorqueDatas" :key="minIndex" :style="{color:(minIndex == selectedValueIndex ? 'green' : ui.tableTextColor ), backgroundColor: setWarningIndex(minIndex)}">{{minTorqueData.min}}</td>
                    </tr>
                    <tr>
                        <td title="torque max">{{'Max'}}</td>
                        <td class="text-xs-center"  v-for="(maxTorqueData, maxIndex) in maxTorqueDatas" :key="maxIndex" :style="{color:(maxIndex == selectedValueIndex ? 'green' : ui.tableTextColor ), backgroundColor: setWarningIndex(maxIndex)}">{{maxTorqueData.max}}</td>
                    </tr>
                    <tr>
                        <td title="warning torque min">{{'Warn Min'}}</td>
                        <td class="text-xs-center" v-for="(warningMinTorqueData, warnMinIndex) in warningMinTorqueDatas" :key="warnMinIndex" :style="{color:(warnMinIndex == selectedValueIndex ? 'yellow' : ui.tableTextColor ), backgroundColor: setWarningIndex(warnMinIndex)}">{{warningMinTorqueData.warningmin}}</td>
                    </tr>
                    <tr>
                        <td title="warning torque max">{{'Warn Max'}}</td>
                        <td class="text-xs-center" v-for="(warningMaxTorqueData, warnMaxIndex) in warningMaxTorqueDatas" :key="warnMaxIndex" :style="{color:(warnMaxIndex == selectedValueIndex ? 'yellow' : ui.tableTextColor ), backgroundColor: setWarningIndex(warnMaxIndex)}">{{warningMaxTorqueData.warningmax}}</td>
                    </tr>
                </template>
        </v-data-table>
        <v-layout>
            <v-dialog v-model="datas.event.dialog" hide-overlay persistent width="270">
                <v-card class="detailSetDlg">
                    <v-card-title class="headline">{{ui.text.stepNumber}} [{{(datas.index+1)}}] <br> {{ui.text.changeWarningValue}}</v-card-title>
                        <v-flex class="pl-4">
                        <span class="pr-4">{{ui.text.currentWarningMinValue}}</span><input class="tableInput" :readonly="true" v-model="datas.warning.min">
                        </v-flex>
                        <v-flex class="pl-4">
                        <span class="pr-4">{{ui.text.currentWarningMaxValue}}</span><input class="tableInput" :readonly="true" v-model="datas.warning.max">
                        </v-flex>
                        <v-flex class="pl-4">
                        <span class="pr-4">{{ui.text.changeWarningMinValue}}</span><input class="tableInput" v-model="datas.accept.min">
                        </v-flex>
                        <v-flex class="pl-4 pb-2">
                        <span class="pr-4">{{ui.text.changeWarningMaxValue}}</span><input class="tableInput" v-model="datas.accept.max">
                        </v-flex>
                        <v-flex class="pl-4">
                        <v-btn id="acceptBtnID" @click="accept" color="primary"><span>{{ui.text.accept}}</span></v-btn>
                        <v-btn id="cancelBtnID" @click="cancel" color="primary"><span>{{ui.text.cancel}}</span></v-btn>
                        </v-flex>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    props:['searchFlag', 'headerDatas' ,'contentDatas', 'warningMargin', 'warningFlag', 'warningTorqueDatas', 'selectedValueIndex', 'warningValueApplyFlag'],
    data() {
        return{
            headers: [],
            minTorqueDatas: [],
            maxTorqueDatas: [],
            warningMinTorqueDatas: [],
            warningMaxTorqueDatas: [],
            torqueDatas: [this.minTorqueDatas,this.maxTorqueDatas,this.warningMinTorqueDatas,this.warningMaxTorqueDatas],
            tempDatas: [{}],
            ui: {
                text: {
                    stepNumber: this.$t('diagnostics.torqueRange.child.torqueRangeTable.stepNumber'),
                    changeWarningValue: this.$t('diagnostics.torqueRange.child.torqueRangeTable.changeWarningValue'),
                    currentWarningMinValue: this.$t('diagnostics.torqueRange.child.torqueRangeTable.currentWarningMinValue'),
                    currentWarningMaxValue: this.$t('diagnostics.torqueRange.child.torqueRangeTable.currentWarningMaxValue'),
                    changeWarningMinValue: this.$t('diagnostics.torqueRange.child.torqueRangeTable.changeWarningMinValue'),
                    changeWarningMaxValue: this.$t('diagnostics.torqueRange.child.torqueRangeTable.changeWarningMaxValue'),
                    accept: this.$t('diagnostics.torqueRange.child.torqueRangeTable.accept'),
                    cancel: this.$t('diagnostics.torqueRange.child.torqueRangeTable.cancel'),
                    normalizedText: this.$t('diagnostics.torqueRange.child.torqueRangeTable.popMsg.normalizedText'),
                    notNormalizedText: this.$t('diagnostics.torqueRange.child.torqueRangeTable.popMsg.notNormalizedText')
                },
                tableTextColor: ""
            },
            datas: {
                index: 0,
                event: {
                    dialog: false,
                },
                warning: {
                    min: '0',
                    max: '0',
                },
                accept: {
                    min: '',
                    max: '',
                },
            },
        }
    },

    mounted() {
        this.initializeStyle();
    },
    
    computed: { 
        getTorqueRangeHeaderDatas() {
            if (this.headerDatas.length > 0) {
                this.headers = [];
                this.headers = this.headerDatas;
            } 
            else {
                this.headers = [];
            }
        },
        getTorqueRangeContentDatas() {        
            if (this.contentDatas.length > 0) {
                if (this.searchFlag == true) {
                    this.minTorqueDatas = [];
                    this.maxTorqueDatas = [];
                    this.warningMinTorqueDatas = [];
                    this.warningMaxTorqueDatas = [];
                    let torqueDatas = this.contentDatas;
                    let warningDatas = this.warningTorqueDatas;
                    torqueDatas.forEach(torqueData => {
                        this.minTorqueDatas.push({stepno: torqueData.stepno, min: torqueData.min});
                        this.maxTorqueDatas.push({stepno: torqueData.stepno, max: torqueData.max});
                        if(warningDatas != null && warningDatas.length != 0) {
                            warningDatas[0].stepno.forEach((warningDataStepNo, index) => {
                                if(torqueData.stepno == warningDataStepNo) {
                                    this.warningMinTorqueDatas.push({stepno: torqueData.stepno, warningmin: warningDatas[0].min[index]});
                                    this.warningMaxTorqueDatas.push({stepno: torqueData.stepno, warningmax: warningDatas[0].max[index]});
                                }
                            })
                        } else {
                            this.warningMinTorqueDatas.push({ stepno: torqueData.stepno, warningmin: '' });
                            this.warningMaxTorqueDatas.push({ stepno: torqueData.stepno, warningmax: '' });
                        }
                    })
                    this.$emit('searchFlag');
                } 
            } 
            else {
                this.minTorqueDatas = [];
                this.maxTorqueDatas = [];
                this.warningMinTorqueDatas = [];
                this.warningMaxTorqueDatas = [];
                this.initDatas();
            }
        },
        getWarningMargin() {
            if (this.warningFlag === true && this.warningMargin != '') {
                this.headers.forEach((header, index) => {
                    if(header == this.warningMinTorqueDatas[index].stepno) {
                        this.warningMinTorqueDatas[index].warningmin -= Number(this.warningMargin);
                    }
                    if(header == this.warningMaxTorqueDatas[index].stepno) {
                        this.warningMaxTorqueDatas[index].warningmin += Number(this.warningMargin);
                    }
                })
                this.$emit('warningTorqueDatas', this.warningMinTorqueDatas, this.warningMaxTorqueDatas);            
                this.$emit('warningFlag');
            }
            this.$emit('warningFlag');            
        }
    },  
    
    methods: {
        initializeStyle() {
            this.ui.tableTextColor = this.$style.diagnostics.torqueRangeTableTextColor;
            document.documentElement.style.setProperty("--tableBorderColor", this.$style.common.cardItemBorderColor);
            document.documentElement.style.setProperty("--tableHeadBackgroundColor", this.$style.diagnostics.torqueRangeTableItemBackgroundColor);
            document.documentElement.style.setProperty("--tableRowBackgroundColor", this.$style.diagnostics.torqueRangeTableItemBackgroundColor);
            document.documentElement.style.setProperty("--tableRowBorderBottomColor", this.$style.diagnostics.torqueRangeTableItemRowBorderBottomColor);
            document.documentElement.style.setProperty("--hoverBackgroundColor", this.$style.diagnostics.torqueRangeTableItemHoverBackgroundColor);
            document.documentElement.style.setProperty("--headerColTextColor", this.$style.diagnostics.torqueRangeTableHeaderColTextColor);
            document.documentElement.style.setProperty("--headerColBorderRightColor", this.$style.diagnostics.torqueRangeTableitemHeaderColBorderRightColor);
            document.documentElement.style.setProperty("--headerColBorderBottomColor", this.$style.diagnostics.torqueRangeTableItemHeaderColBorderBottomColor);
            document.documentElement.style.setProperty("--rowColBorderRightColor", this.$style.diagnostics.torqueRangeTableitemHeaderColBorderRightColor);

            document.documentElement.style.setProperty("--detailSetDlgBackgroundColor", this.$style.diagnostics.torqueRangeDetailSetDlgItemBackgroundColor);
            document.documentElement.style.setProperty("--detailSetDlgColor", this.$style.diagnostics.torqueRangeDetailSetDlgItemColor);
            document.documentElement.style.setProperty("--detailSetDlgBorderColor", this.$style.diagnostics.torqueRangeDetailSetDlgItemBorderColor);
            document.documentElement.style.setProperty("--detailSetDlgInputBackgroundColor", this.$style.diagnostics.torqueRangeDetailSetDlgItemInputBackgroundColor);
            document.documentElement.style.setProperty("--detailSetDlgInputColor", this.$style.diagnostics.torqueRangeDetailSetDlgItemColor);
            document.documentElement.style.setProperty("--detailSetDlgInputBorderColor", this.$style.diagnostics.torqueRangeDetailSetDlgItemInputBorderColor);
        },
        initDatas() {
            for (let i = 1; i <= 100; i++) {
                this.headers.push({stepno: i});
                this.minTorqueDatas.push({stepno: i, min: ''});
                this.maxTorqueDatas.push({stepno: i, max: ''});
                this.warningMinTorqueDatas.push({stepno: i, warningmin: ''});
                this.warningMaxTorqueDatas.push({stepno: i, warningmax: ''});
            }
        },
        setWarningIndex(index) {
            if(this.warningValueApplyFlag == true) {
                let backgroundColor = '';
                if(this.minTorqueDatas[index].min != '' && this.warningMinTorqueDatas[index].warningmin != '' && this.minTorqueDatas[index].min < this.warningMinTorqueDatas[index].warningmin) {
                    backgroundColor = 'red';
                }
                else if(this.maxTorqueDatas[index].max != '' && this.warningMaxTorqueDatas[index].warningmax != '' && this.maxTorqueDatas[index].max > this.warningMaxTorqueDatas[index].warningmax) {
                    backgroundColor = 'red';
                }

                return backgroundColor;
            }
        },
        onCreate(index) {
            if (this.warningValueApplyFlag) {
                this.datas.index = index;
                this.datas.warning.min = this.warningMinTorqueDatas[index].warningmin;
                this.datas.warning.max = this.warningMaxTorqueDatas[index].warningmax;
                this.setDialog(true);
            }
        },
        setDialog(flag) {
            this.datas.event.dialog = flag;
        },
        initializeInfo() {
            this.datas.accept.min = '';
            this.datas.accept.max = '';
            this.datas.index = 0;
        },
        accept() {
            const regex = /^(-?)[0-9]+$/;
            if (
                regex.test(this.datas.accept.min) && 
                regex.test(this.datas.accept.max) && 
                Number(this.datas.accept.max) > Number(this.datas.accept.min) && 
                Number(this.datas.accept.max) < 301 && 
                Number(this.datas.accept.min) > -301
                ) {
                this.warningMinTorqueDatas[this.datas.index].warningmin = this.datas.accept.min;
                this.warningMaxTorqueDatas[this.datas.index].warningmax = this.datas.accept.max;
                this.$emit('warningTorqueDatas', this.warningMinTorqueDatas, this.warningMaxTorqueDatas);            
                this.$emit('warningFlag');
                this.initializeInfo();
                this.$popmsg(this.ui.text.normalizedText);
                this.setDialog(false);
            } else {
                this.$popmsg(this.ui.text.notNormalizedText);
            }
        },
        cancel() {
            this.initializeInfo();
            this.setDialog(false);
        }
    }
}
</script>

<style scoped lang="scss">
    @import './torquerangetable';
</style>
