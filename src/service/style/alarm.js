export class AlarmSty {
    constructor() {

    }
    _theme = `dark`
    set alarmMode(theme) {
        this._theme = theme;
    }
    get instanceAlarmSty() {
        return this;
    }

    alarmViewDataItem = {
        dark: {
            cardBackgroundColor: "#25273e",
            cardTitleBackgroundColor: "#2F3758",
            alarmDescBackgroundColor: "#25273e",
            alarmDescColor: "#ffffff"
        },
        light: {
            cardBackgroundColor: "#ccd2e2",
            cardTitleBackgroundColor: "#313b55",
            alarmDescBackgroundColor: "#ffffff",
            alarmDescColor: "#1b223d"
        }
    }

    get alarmViewDataItemCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataItem.dark.cardBackgroundColor;
        } else {
            return this.alarmViewDataItem.light.cardBackgroundColor;
        }
    }

    get alarmViewDataItemCardTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataItem.dark.cardTitleBackgroundColor;
        } else {
            return this.alarmViewDataItem.light.cardTitleBackgroundColor;
        }
    }

    get alarmViewDataItemAlarmDescBackgroundColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataItem.dark.alarmDescBackgroundColor;
        } else {
            return this.alarmViewDataItem.light.alarmDescBackgroundColor;
        }
    }

    get alarmViewDataItemAlarmDescColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataItem.dark.alarmDescColor;
        } else {
            return this.alarmViewDataItem.light.alarmDescColor;
        }
    }

       // 조치 사항 리스트
       actionListItem = {
        dark: {
            cardBackgroundColor: "#25273e",
            cardTitleBackgroundColor: "#2F3758",
            expansionPanelTitleBackgroundColor: "#1f243b",
            expansionPanelContentBackgroundColor: "#2f3758",
            expansionPanelBorderBottomColor: "#ccd2e2",
            expansionPanelSubTitleColor: "#727b9b"
        },
        light: {
            cardBackgroundColor: "#ffffff",
            cardTitleBackgroundColor: "#313b55",
            expansionPanelTitleBackgroundColor: "#ffffff",
            expansionPanelContentBackgroundColor: "#d2d7e5",
            expansionPanelBorderBottomColor: "#ccd2e2",
            expansionPanelSubTitleColor: "#727b9b"
        }
    }

    get actionListItemCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.actionListItem.dark.cardBackgroundColor;
        } else {
            return this.actionListItem.light.cardBackgroundColor;
        }
    }

    get actionListItemCardTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.actionListItem.dark.cardTitleBackgroundColor;
        } else {
            return this.actionListItem.light.cardTitleBackgroundColor;
        }
    }

    get actionListItemExpansionPanelTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.actionListItem.dark.expansionPanelTitleBackgroundColor;
        } else {
            return this.actionListItem.light.expansionPanelTitleBackgroundColor;
        }
    }

    get actionListItemExpansionPanelContentBackgroundColor() {
        if(this._theme === `dark`) {
            return this.actionListItem.dark.expansionPanelContentBackgroundColor;
        } else {
            return this.actionListItem.light.expansionPanelContentBackgroundColor;
        }
    }

    get actionListItemExpansionPanelBorderBottomColor() {
        if(this._theme === `dark`) {
            return this.actionListItem.dark.expansionPanelBorderBottomColor;
        } else {
            return this.actionListItem.light.expansionPanelBorderBottomColor;
        }
    }

    get actionListItemExpansionPanelSubTitleColor() {
        if(this._theme === `dark`) {
            return this.actionListItem.dark.expansionPanelSubTitleColor;
        } else {
            return this.actionListItem.light.expansionPanelSubTitleColor;
        }
    }

    // 알람 정지 시간(해제된 알람) 차트 아이템 
    alarmViewDataMixedChartItem = {
        dark: {
            default: {
                backgroundColor: "#1f243b",
                fontColor: "#ffffff",
            },
            axis: {
                labelFontColor: "#ffffff",
                axisX: {
                    lineColor: "#575f7d",
                },
                axisY: {
                    gridColor: "#575f7d",
                    axisY1: {
                        color: "#18c2fa"
                    },
                    axisY2: {
                        color: "#cf9e48"
                    }
                },
            },
            legend: {
                fontColor: "#ffffff"
            }
        },
        light: {
            default: {
                backgroundColor: "#ffffff",
                fontColor: "#60676f",
            },
            axis: {
                labelFontColor: "#60676f",
                axisX: {
                    lineColor: "#b6b9c3",
                },
                axisY: {
                    gridColor: "#b6b9c3",
                    axisY1: {
                        color: "#3297ff"
                    },
                    axisY2: {
                        color: "#ffa422"
                    }
                },
            },
            legend: {
                fontColor: "#60676f"
            }
        }
    }

    /**
     * 
     *  알람 정지 시간(해제된 알람) 차트 배경 색상 가져오기
     */
    get alarmViewDataMixedChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataMixedChartItem.dark.default.backgroundColor;
        } else {
            return this.alarmViewDataMixedChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     *  알람 정지 시간(해제된 알람) 차트 기본 문구 색상 가져오기
     */

    get alarmViewDataMixedChartFontColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataMixedChartItem.dark.default.fontColor;
        } else {
            return this.alarmViewDataMixedChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     *  알람 정지 시간(해제된 알람) 차트 축 라벨 색상 가져오기
     */
    get alarmViewDataMixedChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataMixedChartItem.dark.axis.labelFontColor;
        } else {
            return this.alarmViewDataMixedChartItem.light.axis.labelFontColor;
        }
    }

    
    /**
     * 
     *  알람 정지 시간(해제된 알람) 차트 X축 라인 색상 가져오기
     */
    get alarmViewDataMixedChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataMixedChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.alarmViewDataMixedChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     *  알람 정지 시간(해제된 알람) 차트 Y축 그리드 색상 가져오기
     */
    get alarmViewDataMixedChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataMixedChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.alarmViewDataMixedChartItem.light.axis.axisY.gridColor;
        }
    } 

    /**
     * 
     *  알람 정지 시간(해제된 알람) 차트 Y1축 색상 가져오기
     */
    get alarmViewDataMixedChartAxisY1Color() {
        if(this._theme === `dark`) {
            return this.alarmViewDataMixedChartItem.dark.axis.axisY.axisY1.color;
        } else {
            return this.alarmViewDataMixedChartItem.light.axis.axisY.axisY1.color;
        }
    }

    /**
     * 
     *  알람 정지 시간(해제된 알람) 차트 Y2축 색상 가져오기
     */
    get alarmViewDataMixedChartAxisY2Color() {
        if(this._theme === `dark`) {
            return this.alarmViewDataMixedChartItem.dark.axis.axisY.axisY2.color;
        } else {
            return this.alarmViewDataMixedChartItem.light.axis.axisY.axisY2.color;
        }
    }

    /**
     * 
     *  알람 정지 시간(해제된 알람) 차트 Y2축 색상 가져오기
     */
    get alarmViewDataMixedChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataMixedChartItem.dark.legend.fontColor;
        } else {
            return this.alarmViewDataMixedChartItem.light.legend.fontColor;
        }
    }

    // 공정 간 경보 발생 비율 차트 아이템
    alarmViewDataPieChartItem = {
        dark: {
            default: {
                backgroundColor: "#1f243b",
                fontColor: "#ffffff",
            },
            indexLabel: {
                fontColor: "white"
            },
            dataPoints: {
                color: {
                    boothColor_1: `#43aea8`,
                    boothColor_2: `#5fadef`,
                    boothColor_3: `#6c85bd`,
                    boothColor_4: `#cfa448`,
                    boothColor_5: `#bac3d2`
                }
            }
        },
        light: {
            default: {
                backgroundColor: "#ffffff",
                fontColor: "#60676f",
            },
            indexLabel: {
                fontColor: "#60676f"
            },
            dataPoints: {
                color: {
                    boothColor_1: `#3297ff`,
                    boothColor_2: `#ffa422`,
                    boothColor_3: `#0bb881`,
                    boothColor_4: `#0baeb8`,
                    boothColor_5: `#a2b1ca`
                }
            }
        }
    }

    /**
     * 
     * 공정 간 경보 발생 비율 차트 배경 색상 가져오기
     */
    get alarmViewDataPieChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataPieChartItem.dark.default.backgroundColor;
        } else {
            return this.alarmViewDataPieChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * 공정 간 경보 발생 비율 차트 기본 문구 색상 가져오기
     */
    get alarmViewDataPieChartFontColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataPieChartItem.dark.default.fontColor;
        } else {
            return this.alarmViewDataPieChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * 공정 간 경보 발생 비율 차트 인덱스 라벨 색상 가져오기
     */
    get alarmViewDataPieChartIndexLabelFontColor() {
        if(this._theme === `dark`) {
            return this.alarmViewDataPieChartItem.dark.indexLabel.fontColor;
        } else {
            return this.alarmViewDataPieChartItem.light.indexLabel.fontColor;
        }
    }

    /**
     * 
     * 공정 간 경보 발생 비율 차트 데이터 포인트 색상 가져오기
     * boothColor_1 ... boothColor_5
     */
    get alarmViewDataPieChartDataPointsColors() {
        if(this._theme === `dark`) {
            return this.alarmViewDataPieChartItem.dark.dataPoints.color;
        } else {
            return this.alarmViewDataPieChartItem.light.dataPoints.color;
        }
    }
    
    alarmItem = {
        dark: {
            activeClass: `dy_blue_dark dy_white--text`,
            tabsColor: `#171a29`,
            tabStyleColor: `#bcbdc4`,
            tabStyleBackgroundColor: `#2f354b`,
            tabsStyleBorderBottom: `1px solid #575f7d`,
        },
        light: {
            activeClass: `dy_blue_light dy_white--text`,
            tabsColor: `#f6f9fc`,
            tabStyleColor: `#c1c8e0`,
            tabStyleBackgroundColor: `#566083`,
            tabsStyleBorderBottom: `2px solid #237ffe`,
        }
    }
    get alarmItemActiveClass() {
        if (this.themeStatus === `dark`) {
            return this.alarmItem.dark.activeClass;
        }
        else {
            return this.alarmItem.light.activeClass;
        }
    }
    get alarmItemTabsColor() {
        if (this.themeStatus === `dark`) {
            return this.alarmItem.dark.tabsColor;
        }
        else {
            return this.alarmItem.light.tabsColor;
        }
    }
    get alarmItemTabStyleColor() {
        if (this.themeStatus === `dark`) {
            return this.alarmItem.dark.tabStyleColor;
        }
        else {
            return this.alarmItem.light.tabStyleColor;
        }
    }
    get alarmItemTabStyleBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.alarmItem.dark.tabStyleBackgroundColor;
        }
        else {
            return this.alarmItem.light.tabStyleBackgroundColor;
        }
    }
    get alarmItemTabsStyleBorderBottom() {
        if (this.themeStatus === `dark`) {
            return this.alarmItem.dark.tabsStyleBorderBottom;
        }
        else {
            return this.alarmItem.light.tabsStyleBorderBottom;
        }
    }
    AlarmViewItem = {
        dark: {
            inputStyleBackgroundColor: `#171A29`,
            inputStyleBorder: `solid 1px #4e546c`,
            buttonStyleBackgroundColor: `#237ffe`,
            tableBackgroundColor: `#203556`,
        },
        light: {
            inputStyleBackgroundColor: `#ffffff`,
            inputStyleBorder: `solid 1px #9099b0`,
            buttonStyleBackgroundColor: `#237ffe`,
            tableBackgroundColor: `#ffffff`,
        }
    }
    get inputStyleBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.AlarmViewItem.dark.inputStyleBackgroundColor;
        }
        else {
            return this.AlarmViewItem.light.inputStyleBackgroundColor;
        }
    }
    get inputStyleBorder() {
        if (this.themeStatus === `dark`) {
            return this.AlarmViewItem.dark.inputStyleBorder;
        }
        else {
            return this.AlarmViewItem.light.inputStyleBorder;
        }
    }
    get buttonStyleBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.AlarmViewItem.dark.buttonStyleBackgroundColor;
        }
        else {
            return this.AlarmViewItem.light.buttonStyleBackgroundColor;
        }
    }
    get alarmViewItemTableBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.AlarmViewItem.dark.tableBackgroundColor;
        }
        else {
            return this.AlarmViewItem.light.tableBackgroundColor;
        }
    }
    gridTableWithDialogItem = {
        dark: {
            cardColor: `#21263a`,
            paginationColor: `#005bac !important`,
            tableBackgroundColor: `#203556`,
        },
        light: {
            cardColor: `#ffffff`,
            paginationColor: `#ffffff !important`,
            tableBackgroundColor: `#ffffff`,
        }
    }
    get gridTableWithDialogItemCardColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithDialogItem.dark.cardColor;
        }
        else {
            return this.gridTableWithDialogItem.light.cardColor;
        }
    }
    get gridTableWithDialogItemPaginationColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithDialogItem.dark.paginationColor;
        }
        else {
            return this.gridTableWithDialogItem.light.paginationColor;
        }
    }
    get gridTableWithDialogItemTableBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.gridTableWithDialogItem.dark.tableBackgroundColor;
        }
        else {
            return this.gridTableWithDialogItem.light.tableBackgroundColor;
        }
    }
    titleColorItem = {
        dark: {
            backgroundColor: `#171A29`,
        },
        light: {
            backgroundColor: `#ffffff`,
        }
    }
    get titleColorItemBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.titleColorItem.dark.backgroundColor;
        }
        else {
            return this.titleColorItem.light.backgroundColor;
        }
    }
    b001AlarmDlgItem = {
        dark: {
            subCardBackgroundColor: `#2a2f43`,
            selectChangeListColor: `green`,
            nonSelectChangeListColor: `#171A29`,
            alarmDlgBackgroundColor: `#171A29`,
            listAreaBackgroundColor: `#171A29`,
            listTileBackgroundColor: `#171A29`,
        },
        light: {
            subCardBackgroundColor: `#ffffff`,
            selectChangeListColor: `green`,
            nonSelectChangeListColor: `#ffffff`,
            alarmDlgBackgroundColor: `#ffffff`,
            listAreaBackgroundColor: `#ffffff`,
            listTileBackgroundColor: `#ffffff`,
        }
    }
    get b001AlarmDlgItemSubCardBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.b001AlarmDlgItem.dark.subCardBackgroundColor;
        }
        else {
            return this.b001AlarmDlgItem.light.subCardBackgroundColor;
        }
    }
    get b001AlarmDlgItemAlarmDlgBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.b001AlarmDlgItem.dark.alarmDlgBackgroundColor;
        }
        else {
            return this.b001AlarmDlgItem.light.alarmDlgBackgroundColor;
        }
    }
    b002AlarmDlgItem = {
        dark: {
            subCardBackgroundColor: `#2a2f43`,
            selectChangeListColor: `green`,
            nonSelectChangeListColor: `#171A29`,
            alarmDlgBackgroundColor: `#171A29`,
            listAreaBackgroundColor: `#171A29`,
            listTileBackgroundColor: `#171A29`,
        },
        light: {
            subCardBackgroundColor: `#ffffff`,
            selectChangeListColor: `green`,
            nonSelectChangeListColor: `#ffffff`,
            alarmDlgBackgroundColor: `#ffffff`,
            listAreaBackgroundColor: `#ffffff`,
            listTileBackgroundColor: `#ffffff`,
        }
    }
    get b002AlarmDlgItemSubCardBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.b002AlarmDlgItem.dark.subCardBackgroundColor;
        }
        else {
            return this.b002AlarmDlgItem.light.subCardBackgroundColor;
        }
    }
    get b002AlarmDlgItemSelectChangeListColor() {
        if (this.themeStatus === `dark`) {
            return this.b002AlarmDlgItem.dark.selectChangeListColor;
        }
        else {
            return this.b002AlarmDlgItem.light.selectChangeListColor;
        }
    }
    get b002AlarmDlgItemNonSelectChangeListColor() {
        if (this.themeStatus === `dark`) {
            return this.b002AlarmDlgItem.dark.nonSelectChangeListColor;
        }
        else {
            return this.b002AlarmDlgItem.light.nonSelectChangeListColor;
        }
    }
    get b002AlarmDlgItemAlarmDlgBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.b002AlarmDlgItem.dark.alarmDlgBackgroundColor;
        }
        else {
            return this.b002AlarmDlgItem.light.alarmDlgBackgroundColor;
        }
    }
    get b002AlarmDlgItemListAreaBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.b002AlarmDlgItem.dark.listAreaBackgroundColor;
        }
        else {
            return this.b002AlarmDlgItem.light.listAreaBackgroundColor;
        }
    }
    get b002AlarmDlgItemListTileBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.b002AlarmDlgItem.dark.listTileBackgroundColor;
        }
        else {
            return this.b002AlarmDlgItem.light.listTileBackgroundColor;
        }
    }
    codeTableItem = {
        dark: {
            cardColor: `#21263a`,
            spreadSheetTableBackgroundColor: `#171A29`,
            theadBackgroundColor: `#21263a`,
            theadBorderBottomColor: `#21263a`,
            hoverBackgroundColor: `#203556`,
            lineNumberBackgroundColor: `#21263a`,
            codeAreaBackgroundColor: `#c7ced6`,
        },
        light: {
            cardColor: `#ffffff`,
            spreadSheetTableBackgroundColor: `#ffffff`,
            theadBackgroundColor: `#ffffff`,
            theadBorderBottomColor: `#ffffff`,
            hoverBackgroundColor: `#ffffff`,
            lineNumberBackgroundColor: `#ffffff`,
            codeAreaBackgroundColor: `#ffffff`,
        }
    }
    get codeTableItemCardColor() {
        if (this.themeStatus === `dark`) {
            return this.codeTableItem.dark.cardColor;
        }
        else {
            return this.codeTableItem.light.cardColor;
        }
    }
    get codeTableItemSpreadSheetTableBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.codeTableItem.dark.spreadSheetTableBackgroundColor;
        }
        else {
            return this.codeTableItem.light.spreadSheetTableBackgroundColor;
        }
    }
    get codeTableItemTheadBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.codeTableItem.dark.theadBackgroundColor;
        }
        else {
            return this.codeTableItem.light.theadBackgroundColor;
        }
    }
    get codeTableItemTheadBorderBottomColor() {
        if (this.themeStatus === `dark`) {
            return this.codeTableItem.dark.theadBorderBottomColor;
        }
        else {
            return this.codeTableItem.light.theadBorderBottomColor;
        }
    }
    get codeTableItemHoverBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.codeTableItem.dark.hoverBackgroundColor;
        }
        else {
            return this.codeTableItem.light.hoverBackgroundColor;
        }
    }
    get codeTableItemLineNumberBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.codeTableItem.dark.lineNumberBackgroundColor;
        }
        else {
            return this.codeTableItem.light.lineNumberBackgroundColor;
        }
    }
    get codeTableItemCodeAreaBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.codeTableItem.dark.codeAreaBackgroundColor;
        }
        else {
            return this.codeTableItem.light.codeAreaBackgroundColor;
        }
    }
    alarmInfosItem = {
        dark: {
            alarmPhraseStyleColor: `#3d4259`,
            searchBtn: `#237ffe`,
            vcard: `#2a2f43`,
            vbtn: `#4090fe`,
            alarmDetailList: `#2a2f43`,
            vdivider: `#666e88`,
            alarmInfoListBackgroundColor: `#2a2f43`,
            alarmDetailListBackgroundColor: `#3d4359`,
            inputAlarmCodeBackgroundColor: `#171A29`,
            inputAlarmCodeBorder: `#4e546c`,
        },
        light: {
            alarmPhraseStyleColor: `#9ea0b5`,
            searchBtn: `#3086fe`,
            vcard: `#ccd2e2`,
            vbtn: `#1b223d`,
            alarmDetailList: `#ccd2e2`,
            vdivider: `#dee3f0`,
            alarmInfoListBackgroundColor: `#ccd2e2`,
            alarmDetailListBackgroundColor: `#abb1c2`,
            inputAlarmCodeBackgroundColor: `#ffffff`,
            inputAlarmCodeBorder: `#9099b0`,
        },
    }
    get alarmInfosItemAlarmPhraseStyleColor() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.alarmPhraseStyleColor;
        }
        else {
            return this.alarmInfosItem.light.alarmPhraseStyleColor;
        }
    }
    get alarmInfosItemSearchBtn() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.searchBtn;
        }
        else {
            return this.alarmInfosItem.light.searchBtn;
        }
    }
    get alarmInfosItemVcard() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.vcard;
        }
        else {
            return this.alarmInfosItem.light.vcard;
        }
    }
    get alarmInfosItemVbtn() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.vbtn;
        }
        else {
            return this.alarmInfosItem.light.vbtn;
        }
    }
    get alarmInfosItemAlarmDetailList() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.alarmDetailList;
        }
        else {
            return this.alarmInfosItem.light.alarmDetailList;
        }
    }
    get alarmInfosItemVdivider() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.vdivider;
        }
        else {
            return this.alarmInfosItem.light.vdivider;
        }
    }
    get alarmInfosItemAlarmInfoListBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.alarmInfoListBackgroundColor;
        }
        else {
            return this.alarmInfosItem.light.alarmInfoListBackgroundColor;
        }
    }
    get alarmInfosItemAlarmDetailListBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.alarmDetailListBackgroundColor;
        }
        else {
            return this.alarmInfosItem.light.alarmDetailListBackgroundColor;
        }
    }
    get alarmInfosItemInputAlarmCodeBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.inputAlarmCodeBackgroundColor;
        }
        else {
            return this.alarmInfosItem.light.inputAlarmCodeBackgroundColor;
        }
    }
    get alarmInfosItemInputAlarmCodeBorder() {
        if (this.themeStatus === `dark`) {
            return this.alarmInfosItem.dark.inputAlarmCodeBorder;
        }
        else {
            return this.alarmInfosItem.light.inputAlarmCodeBorder;
        }
    }
    alarmManualItem = {
        dark: {
            vbtn: `#237ffe`,
            backgroundColor: `#171a29`,
        },
        light: {
            vbtn: `#3086fe`,
            backgroundColor: `#f6fafd`,
        }
    }
    get alarmManualItemVbtn() {
        if (this.themeStatus === `dark`) {
            return this.alarmManualItem.dark.vbtn;
        }
        else {
            return this.alarmManualItem.light.vbtn;
        }
    }
    get alarmManualItemBackgroundColor() {
        if (this.themeStatus === `dark`) {
            return this.alarmManualItem.dark.backgroundColor;
        }
        else {
            return this.alarmManualItem.light.backgroundColor;
        }
    }
}