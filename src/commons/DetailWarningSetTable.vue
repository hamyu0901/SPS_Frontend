<template>
    <div style="height: 690px;" v-bind="[getContentDatas, getCheckDetailDataFlag, getAutoSetFlag]">
        <c-grid
            :ref="'detailWarningSetTable'"
            :data="datas.contentDatas"
            :theme="detailWarningSetTableTheme"
        > 
            <c-grid-input-column
                v-for="headerData in headerDatas" 
                :key="headerData.field" 
                :field="headerData.field" 
                :readonly="headerData.readonly"
                :column-style="headerData.style"
                width="auto"
                @changed-value="onChangeInputValue"
            >
                {{headerData.name}}
            </c-grid-input-column>
        </c-grid>
    </div>
</template>

<script>
export default {
    props: ['headerDatas', 'contentDatas', 'checkDetailDataFlag', 'autoSetFlag'],
    data() {
       return {
           ui: {

           },
           datas: {
               configDatas: {},
               contentDatas: []
           }
       }
   },

   craeted() {

   },

   mounted() {
       this.initializeStyle();
   },

   computed: {
       getContentDatas() {
           if(this.contentDatas.length > 0) {
               this.setContentDatas(this.contentDatas[this.contentDatas.length - 1]);
               this.setConfigDatas(this.contentDatas[this.contentDatas.length - 1]);
           } else {
               this.datas.contentDatas = [];
           }
       },
       detailWarningSetTableTheme() {
           const _this = this;
           let userTheme = {
                frozenRowsColor: _this.$style.common.detailWarningSetTableItemCheetahGridFrozenRowsColor, // header text color
                frozenRowsBgColor: _this.$style.common.detailWarningSetTableItemCheetahGridFrozenRowsBgColor, // header bg color
                frozenRowsBorderColor: _this.$style.common.detailWarningSetTableItemCheetahGridFrozenRowsBorderColor,  // header border color
                defaultBgColor({row, col, grid}) {
                    let color = "";
                    if(col > 2) {
                        color = _this.$style.common.detailWarningSetTableItemCheetahGridSpecificBgColor;
                    } else {
                        color = _this.$style.common.detailWarningSetTableItemCheetahGridDefaultBgColor;
                    }
                    return color;
                },
                color: _this.$style.common.detailWarningSetTableItemCheetahGridTextColor, // grid text color
                underlayBackgroundColor: _this.$style.common.detailWarningSetTableItemCheetahGridUnderlayBackgroundColor,
                borderColor(args) {
                   if(args.row > 0) {
                       return [null, null, _this.$style.common.detailWarningSetTableItemCheetahGridBorderColor, null];
                   }
                },
                button: {
                    color: _this.$style.common.detailWarningSetTableItemCheetahGridButtonColor,
                    bgColor: _this.$style.common.detailWarningSetTableItemCheetahGridButtonBgColor
                },
            }
            return userTheme;
       },
       getCheckDetailDataFlag() {
           if(this.checkDetailDataFlag === true) {
               let configData = {};
               configData['boothid'] = this.contentDatas[this.contentDatas.length-1].boothid;
               configData['zoneid'] = this.contentDatas[this.contentDatas.length-1].zoneid;
               configData['robotid'] = this.contentDatas[this.contentDatas.length-1].robotid;
               configData['axis'] = this.contentDatas[this.contentDatas.length-1].axis;
               configData['jobname'] = this.contentDatas[this.contentDatas.length-1].jobname;
               this.$emit('detailWarningSetDatas',{config: configData, datas:this.datas.contentDatas.sort((a,b) => {
                   if (Number(a.stepno) > Number(b.stepno)) {
                    return 1;
                    }
                    if (Number(a.stepno) < Number(b.stepno)) {
                        return -1;
                    }
                    return 0;
                })});
            }
        },
        getAutoSetFlag() {
            if(this.autoSetFlag === true) {
                this.$emit('changeDetailWarningSetDatas', {configDatas: this.datas.configDatas, changeDatas: this.datas.contentDatas});
                this.$emit('autoSetFlag'); 
            }
        }
    },

   methods: {
       initializeStyle() {
           document.documentElement.style.setProperty('--detailWarningSetTableItemInputColor', this.$style.common.detailWarningSetTableItemInputColor);
       },

        setContentDatas(contentDatas) {
            this.datas.contentDatas = [];
            let contentData = {};
            contentDatas.stepno.forEach((stepno, index) => {
                if(stepno > 0) {
                    contentData = {};
                    contentData['stepno'] = stepno;
                    if(contentDatas.max[stepno-1] !== null && contentDatas.min[stepno-1] !== null) {
                        contentData['max'] = contentDatas.max[stepno-1];
                        contentData['min'] = contentDatas.min[stepno-1];
                        if(contentDatas.maxwarning !== undefined && contentDatas.minwarning !== undefined) {
                            contentData['maxwarning'] = contentDatas.maxwarning[stepno-1];
                            contentData['minwarning'] = contentDatas.minwarning[stepno-1];
                            contentData['flag'] = (Number(contentData.max) > Number(contentData.maxwarning) || Number(contentData.min) < Number(contentData.minwarning));
                        }
                        this.datas.contentDatas.push(contentData);
                    }
                    if(contentDatas.stepno.length-1 === index) {
                        this.datas.contentDatas.sort(contentData => {
                            return contentData.flag === true? -1 : 1;
                        })
                    }
                }
            })
        },

        setConfigDatas(contentDatas) {
            this.datas.configDatas['boothid'] = this.contentDatas[this.contentDatas.length-1].boothid;
            this.datas.configDatas['zoneid'] = this.contentDatas[this.contentDatas.length-1].zoneid;
            this.datas.configDatas['robotid'] = this.contentDatas[this.contentDatas.length-1].robotid;
            this.datas.configDatas['axis'] = this.contentDatas[this.contentDatas.length-1].axis;
            this.datas.configDatas['jobname'] = this.contentDatas[this.contentDatas.length-1].jobname;
        },

        onChangeInputValue(rec) {
            this.datas.contentDatas[rec.row-1] = rec.record;
            this.$emit('changeDetailWarningSetDatas', {configDatas: this.datas.configDatas, changeDatas: this.datas.contentDatas});
        }
   }
}
</script>

<style scoped lang="scss">
    /deep/ .cheetah-grid__small-dialog-input--shown {
      color: var(--detailWarningSetTableItemInputColor) !important;
    }
</style>