<template>
    <div style="height: 690px;" v-bind="[getTableId, getContentDatas, getSaveFlag, getRenderFlag, getCancelFlag]">
        <c-grid
            :ref="tableId"
            :data="datas.contentDatas"
            :theme="warningSetTableTheme"
            :frozen-col-count="tableId === 'accum'? 9:0"
        > 
            <c-grid-input-column
                v-for="headerData in headerDatas" 
                :key="headerData.field" 
                :field="headerData.field" 
                :readonly="headerData.readonly"
                :column-style="headerData.style"
                width="auto"
                @changed-value="onChangeInputValue"
                @click-cell="onClickCell"
            >
                {{headerData.name}}
            </c-grid-input-column>
           
            <c-grid-button-column width="auto" caption="AUTO SET" @click="onclickAutoSetBtn" @click-cell="onClickAllAutoSetBtn">
               <div>All AUTO SET</div>
            </c-grid-button-column>
        </c-grid>
    </div>
</template>

<script>
export default {
    props: ['tableId','headerDatas', 'contentDatas', 'warningRate', 'saveFlag', 'renderFlag', 'cancelFlag'],
    data() {
        return {
            ui: {
              cGridStyle: null
            },
            datas: {
                tableId: "",
                headerDatas: [],
                contentDatas: [],
                tempContentData: {},
                changeRowDatas: [],
                currRow: ""
            },
            colors: {

            },
            flags: {
                rerender: false
            }
        }
    },

    created() {
        this.datas.tableId = this.tableId;
    },

    mounted() {
        this.initializeStyle();
    },

    updated() {
      
    },

    destroyed() {

    },
    computed: {
        getTableId() {
            if(this.datas.tableId !== this.tableId) {
                this.$nextTick(() => {
                    this.datas.tableId = this.tableId;
                    this.datas.changeRowDatas = [];
                    this.$refs[this.tableId].invalidate();
                    this.$refs[this.tableId].updateSize();
                })
            }
        },

        getContentDatas() {
            if(this.contentDatas.length > 0) {
                this.datas.selectRowNum = "";
                this.datas.contentDatas = this.contentDatas;
            } else {
                this.datas.contentDatas = [];
            }
        },
        
        warningSetTableTheme() {
            const _this = this;
            let userTheme = {
                frozenRowsColor: _this.$style.common.warningSetTableItemCheetahGridFrozenRowsColor, // header text color
                frozenRowsBgColor({row,col,grid}) {
                    let color = "";
                    if(_this.datas.tableId === 'accum') {
                        if(col === 12) {
                            color = _this.$style.common.warningSetTableItemCheetahGridFrozenRowsDefaultBgColor;
                        } else {
                            color = _this.$style.common.warningSetTableItemCheetahGridFrozenRowsSpecificBgColor;
                        }
                    } else {
                        if(col === 6) {
                            color = _this.$style.common.warningSetTableItemCheetahGridFrozenRowsDefaultBgColor;
                        } else {
                            color = _this.$style.common.warningSetTableItemCheetahGridFrozenRowsSpecificBgColor;
                        }
                    }
                    return color;
                },
                // frozenRowsBgColor: '#313b56', // header bg color
                frozenRowsBorderColor: _this.$style.common.warningSetTableItemCheetahGridFrozenRowsBorderColor,  // header border color
                defaultBgColor({row, col, grid}) { // grid background color
                    let record = _this.datas.contentDatas[row - grid.frozenRowCount];
                    let color = "";
                    if(_this.datas.tableId === 'accum') {
                        if(col >= 9 && col < 12) {
                            color =_this.$style.common.warningSetTableItemCheetahGridSpecificBgColor;
                        } else {
                            color = _this.$style.common.warningSetTableItemCheetahGridDefaultBgColor;
                        }
                    } else if(_this.datas.tableId === 'range') {
                        if(col === 5) {
                            color = _this.$style.common.warningSetTableItemCheetahGridSpecificBgColor;
                        } else {
                            color = _this.$style.common.warningSetTableItemCheetahGridDefaultBgColor;
                        }
                    }
                    if(record.check === true) {
                        color = _this.$style.common.warningSetTableItemCheetahGridCheckBgColor;
                    } 
                    return color;
                },
                color: _this.$style.common.warningSetTableItemCheetahGridTextColor, // grid text color
                underlayBackgroundColor: _this.$style.common.warningSetTableItemCheetahGridUnderlayBackgroundColor,
                borderColor(args) {
                    if(args.row > 0) {
                       return [null, null, _this.$style.common.warningSetTableItemCheetahGridBorderColor, null];
                    }
                },
                button: {
                    color: _this.$style.common.warningSetTableItemCheetahGridButtonColor,
                    bgColor: _this.$style.common.warningSetTableItemCheetahGridButtonBgColor
                },
            }
            return userTheme;
        },

        getSaveFlag() {
            if(this.saveFlag === true) {
                let tmpChangeRowDatas = [];
                this.datas.changeRowDatas.slice().reverse().forEach((changeRowData, index) =>{
                    if(index === 0) {
                        tmpChangeRowDatas.push(changeRowData);
                    } else {
                        let flag = false;
                        tmpChangeRowDatas.forEach(tmpChangeRowData => {
                            if(changeRowData.boothid === tmpChangeRowData.boothid && changeRowData.zoneid === tmpChangeRowData.zoneid && changeRowData.robotid === tmpChangeRowData.robotid &&
                            changeRowData.axis === tmpChangeRowData.axis && changeRowData.jobname === tmpChangeRowData.jobname)
                            {
                                flag = true;   
                            }
                        })
                        if(flag === false) {
                            tmpChangeRowDatas.push(changeRowData);
                        }
                    }
                })
                this.$emit('saveWarningDatas', tmpChangeRowDatas);
            }
        },

        getRenderFlag() {
            if(this.renderFlag === true) {
                this.$refs[this.tableId].invalidate();
                this.$emit('renderFlag');
            }
        },

        getCancelFlag() {
            if(this.cancelFlag === true) {
                this.datas.contentDatas.forEach((contentData, index) => {
                    if(contentData.boothid === this.datas.tempContentData.boothid && contentData.zoneid === this.datas.tempContentData.zoneid && contentData.robotid === this.datas.tempContentData.robotid &&
                    contentData.axis === this.datas.tempContentData.axis && contentData.jobname === this.datas.tempContentData.jobname
                    ) {
                        this.datas.tempContentData.check = false;
                        this.datas.contentDatas[index] = JSON.parse(JSON.stringify(this.datas.tempContentData));
                        this.datas.tempContentData = {};
                        this.datas.changeRowDatas = [];
                        this.$refs[this.tableId].invalidate();
                    }
                })
                this.$emit('cancelFlag');
            }
        }
    },

    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty('--warningSetTableItemInputColor', this.$style.common.warningSetTableItemInputColor);
        },

        onClickCell(event) {
            if(this.datas.tableId === 'range') {
                this.datas.contentDatas.forEach((contentData, index) => {
                    if(index === event.row-1) {
                        contentData.check = true;
                        this.datas.currRow = index;
                        this.$emit('selectedDetailRangeData', this.datas.contentDatas[index]);
                    } else {
                        contentData.check = false;
                    }
                });
                this.$refs[this.tableId].invalidate();
            }
        },

        onChangeInputValue(rec) {
            this.datas.contentDatas[rec.row-1] = rec.record;
            this.datas.changeRowDatas.push(rec.record);
        },

        onClickAllAutoSetBtn(event) {
            if(this.contentDatas.length > 0) {
                if(this.tableId === 'accum') {
                    if(event.row === 0) {
                        this.datas.contentDatas.forEach((contentData, index) => {
                            contentData.maxwarning = String(Math.ceil(Number(contentData.maxsum)*(1+(this.warningRate.max*0.01))));
                            contentData.minwarning = String(Math.floor(Number(contentData.minsum)*(1-(this.warningRate.min*0.01))));
                            contentData.cyclewarning = String(contentData.avgcycle);
                            contentData.flag = (Number(contentData.maxsum) > Number(contentData.maxwarning) || Number(contentData.minsum) < Number(contentData.minwarning))? true : false;
                            this.datas.changeRowDatas.push(contentData);
                        })
                        this.$refs[this.tableId].invalidate();
                    }
                } 
                else if(this.tableId === 'range') {
                    if(event.row === 0) {
                        this.datas.contentDatas.forEach((contentData, index) => {
                            contentData.maxwarning = [];
                            contentData.minwarning = [];
                            contentData.stepno.forEach(stepno => {
                                if(Number(contentData.max[stepno-1]) >= 0) {
                                    contentData.maxwarning[stepno-1] = String(Math.ceil(Number(contentData.max[stepno-1]) * (1+(this.warningRate.max*0.01))));
                                } else {
                                    contentData.maxwarning[stepno-1] = String(Math.ceil(Number(contentData.max[stepno-1]) - (Number(contentData.max[stepno-1])*(this.warningRate.max*0.01))));
                                }
                                if(Number(contentData.min[stepno-1]) >= 0) {
                                   contentData.minwarning[stepno-1] = String(Math.floor(Number(contentData.min[stepno-1]) * (1-(this.warningRate.min*0.01))));
                                } else {
                                    contentData.minwarning[stepno-1] = String(Math.floor(Number(contentData.min[stepno-1]) + (Number(contentData.min[stepno-1])*(this.warningRate.min*0.01))));
                                }
                            })
                            contentData.violationstep = "0";
                            this.datas.changeRowDatas.push(contentData);
                        })
                        this.$refs[this.tableId].invalidate();
                    }
                }
            }
        },
    
        onclickAutoSetBtn(rec, index) {
            if(this.tableId === 'accum') {
                if(index.row !== 0) {
                    this.datas.contentDatas[index.row-1].maxwarning = String(Math.ceil(Number(rec.maxsum)*(1+(this.warningRate.max*0.01))));
                    this.datas.contentDatas[index.row-1].minwarning = String(Math.floor(Number(rec.minsum)*(1-(this.warningRate.min*0.01))));
                    this.datas.contentDatas[index.row-1].cyclewarning = String(rec.avgcycle);
                    this.datas.contentDatas[index.row-1].flag = (Number(this.datas.contentDatas[index.row-1].maxsum) > Number(this.datas.contentDatas[index.row-1].maxwarning) || Number(this.datas.contentDatas[index.row-1].minsum) < Number(this.datas.contentDatas[index.row-1].minwarning))? true : false;
                    this.datas.changeRowDatas.push(this.datas.contentDatas[index.row-1]);
                    this.$refs[this.tableId].invalidate();
                }
            } 
            else if(this.tableId === 'range') {
                if(index.row !== 0) {
                    if(this.datas.contentDatas[index.row-1].maxwarning !== undefined && this.datas.contentDatas[index.row-1].minwarning !== undefined) {
                        this.datas.tempContentData = JSON.parse(JSON.stringify(this.datas.contentDatas[index.row-1]));
                        this.datas.contentDatas[index.row-1].stepno.forEach(stepno => {
                            if(this.datas.contentDatas[index.row-1].max[stepno-1] !== null) {
                                if(Number(this.datas.contentDatas[index.row-1].max[stepno-1]) >= 0) {
                                    this.datas.contentDatas[index.row-1].maxwarning[stepno-1] = String(Math.ceil(Number(this.datas.contentDatas[index.row-1].max[stepno-1]) * (1+(this.warningRate.max*0.01))));
                                } else {
                                    this.datas.contentDatas[index.row-1].maxwarning[stepno-1] = String(Math.ceil(Number(this.datas.contentDatas[index.row-1].max[stepno-1]) - (Number(this.datas.contentDatas[index.row-1].max[stepno-1])*(this.warningRate.max*0.01))));
                                }
                            }
                            if(this.datas.contentDatas[index.row-1].min[stepno-1] !== null) {
                                if(Number(this.datas.contentDatas[index.row-1].min[stepno-1]) >= 0) {
                                    this.datas.contentDatas[index.row-1].minwarning[stepno-1] = String(Math.floor(Number(this.datas.contentDatas[index.row-1].min[stepno-1]) * (1-(this.warningRate.min*0.01))));
                                } else {
                                    this.datas.contentDatas[index.row-1].minwarning[stepno-1] = String(Math.floor(Number(this.datas.contentDatas[index.row-1].min[stepno-1]) + (Number(this.datas.contentDatas[index.row-1].min[stepno-1])*(this.warningRate.min*0.01))));
                                }
                            }
                        })
                        this.datas.contentDatas[index.row-1].violationstep = "0";
                        this.datas.changeRowDatas.push(this.datas.contentDatas[index.row-1]);
                    } else {
                        this.datas.contentDatas[index.row-1].maxwarning = [];
                        this.datas.contentDatas[index.row-1].minwarning = [];
                        this.datas.tempContentData = JSON.parse(JSON.stringify(this.datas.contentDatas[index.row-1]));
                        this.datas.contentDatas[index.row-1].stepno.forEach(stepno => {
                            if(this.datas.contentDatas[index.row-1].max[stepno-1] !== null) {
                                if(Number(this.datas.contentDatas[index.row-1].max[stepno-1]) >= 0) {
                                    this.datas.contentDatas[index.row-1].maxwarning[stepno-1] = String(Math.ceil(Number(this.datas.contentDatas[index.row-1].max[stepno-1]) * (1+(this.warningRate.max*0.01))));
                                } else {
                                    this.datas.contentDatas[index.row-1].maxwarning[stepno-1] = String(Math.ceil(Number(this.datas.contentDatas[index.row-1].max[stepno-1]) - (Number(this.datas.contentDatas[index.row-1].max[stepno-1])*(this.warningRate.max*0.01))));
                                }
                            }
                            if(this.datas.contentDatas[index.row-1].min[stepno-1] !== null) {
                                if(Number(this.datas.contentDatas[index.row-1].min[stepno-1]) >= 0) {
                                    this.datas.contentDatas[index.row-1].minwarning[stepno-1] = String(Math.floor(Number(this.datas.contentDatas[index.row-1].min[stepno-1]) * (1-(this.warningRate.min*0.01))));
                                } else {
                                    this.datas.contentDatas[index.row-1].minwarning[stepno-1] = String(Math.floor(Number(this.datas.contentDatas[index.row-1].min[stepno-1]) + (Number(this.datas.contentDatas[index.row-1].min[stepno-1])*(this.warningRate.min*0.01))));
                                }
                            }
                        })
                        this.datas.changeRowDatas.push(this.datas.contentDatas[index.row-1]);
                    }
                    this.$emit('rangeOnAutoSetBtnClicked',this.datas.contentDatas[index.row-1]);
                    this.$refs[this.tableId].invalidate();
                }
               
            }
            
        }
    }
}
</script>

<style scoped lang="scss">
    /deep/ .cheetah-grid__small-dialog-input--shown {
      color: var(--warningSetTableItemInputColor) !important;
    }
    .c-grid-button-column {
      cursor: pointer !important;
    }
</style>