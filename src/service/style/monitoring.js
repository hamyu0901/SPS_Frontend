export class MonitoringSty {
    constructor() {

    }
    _theme = `dark`;
    set monitoringMode(theme) {
        this._theme = theme;
    }
    get instanceMonitoringSty() {
        return this;
    }

    allMonitoringItem = {
        dark: {
            backgroundColor: "#171a29",
            statusBarBorderColor: "#3b3f58",
            hscMenuStyle: {
                backgroundColor: "#21263a",
                color: "#ffffff"
            },
            boothInfo: {
                backgroundColor: "#415288",
                color: "#ffffff"
            },
            zoneLayout: {
                backgroundColor: "#171a29"
            },
            alarmDlg: {
                backgroundColor: "#171a29",
                titleBackgroundColor: "#fd4f2d",
                titleColor: "#ffffff"
            }
        },
        light: {
            backgroundColor: "#ccd2e2",
            statusBarBorderColor: "#b2bad0",
            hscMenuStyle: {
                backgroundColor: "#3086ff",
                color: "#ffffff"
            },
            boothInfo: {
                backgroundColor: "#6c93be",
                color: "#ffffff"
            },
            zoneLayout: {
                backgroundColor: "#ccd2e2"
            },
            alarmDlg: {
                backgroundColor: "#a5b1bd",
                titleBackgroundColor: "#fd4f2d",
                titleColor: "#ffffff"
            }
        }
    }

    get allMonitoringItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.backgroundColor;
        } else {
            return this.allMonitoringItem.light.backgroundColor;
        }
    }

    get allMonitoringItemStatusBarBorderColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.statusBarBorderColor;
        } else {
            return this.allMonitoringItem.light.statusBarBorderColor;
        }
    }
    
    get allMonitoringItemHscMenuStyleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.hscMenuStyle.backgroundColor;
        } else {
            return this.allMonitoringItem.light.hscMenuStyle.backgroundColor;
        }
    }
    get allMonitoringItemHscMenuStyleColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.hscMenuStyle.color;
        } else {
            return this.allMonitoringItem.light.hscMenuStyle.color;
        }
    }
    get allMonitoringItemBoothInfoBackgroundColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.boothInfo.backgroundColor;
        } else {
            return this.allMonitoringItem.light.boothInfo.backgroundColor;
        }
    }
    get allMonitoringItemBoothInfoColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.boothInfo.color;
        } else {
            return this.allMonitoringItem.light.boothInfo.color;
        }
    }
    get allMonitoringItemZoneLayoutBackgroundColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.zoneLayout.backgroundColor;
        } else {
            return this.allMonitoringItem.light.zoneLayout.backgroundColor;
        }
    }
    get allMonitoringItemAlarmDlgBackgroundColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.alarmDlg.backgroundColor;
        } else {
            return this.allMonitoringItem.light.alarmDlg.backgroundColor;
        }
    }

    get allMonitoringItemAlarmDlgTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.alarmDlg.titleBackgroundColor;
        } else {
            return this.allMonitoringItem.light.alarmDlg.titleBackgroundColor;
        }
    }

    get allMonitoringItemAlarmDlgTitleColor() {
        if(this._theme === `dark`) {
            return this.allMonitoringItem.dark.alarmDlg.titleColor;
        } else {
            return this.allMonitoringItem.light.alarmDlg.titleColor;
        }
    }

    miniZoneItem = {
        dark: {
            backgroundColor: "#1d202f",
            borderColor: "#3B3F58",
            conveyorColor: "#3b3f58",
            loadingColor: "#ffffff",
            bodyMoveTextColor: "#ffffff",
            zoneNameTag: {
                backgroundColor: "#374876",
                color: "#ffffff"
            }
        },
        light: {
            backgroundColor: "#1d202f",
            borderColor: "#3B3F58",
            conveyorColor: "#3b3f58",
            loadingColor: "#111111",
            bodyMoveTextColor: "#ffffff",
            zoneNameTag: {
                backgroundColor: "#6c93be",
                color: "#ffffff"
            }
        }
    }

    get miniZoneItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.miniZoneItem.dark.backgroundColor;
        } else {
            return this.miniZoneItem.light.backgroundColor;
        }
    }

    get miniZoneItemBorderColor() {
        if(this._theme === `dark`) {
            return this.miniZoneItem.dark.borderColor;
        } else {
            return this.miniZoneItem.light.borderColor;
        }
    }

    get miniZoneItemConveyorColor() {
        if(this._theme === `dark`) {
            return this.miniZoneItem.dark.conveyorColor;
        } else {
            return this.miniZoneItem.light.conveyorColor;
        }
    }

    get miniZoneItemLoadingColor() {
        if(this._theme === `dark`) {
            return this.miniZoneItem.dark.loadingColor;
        } else {
            return this.miniZoneItem.light.loadingColor;
        }
    }

    get miniZoneItemBodyMoveTextColor() {
        if(this._theme === `dark`) {
            return this.miniZoneItem.dark.bodyMoveTextColor;
        } else {
            return this.miniZoneItem.light.bodyMoveTextColor;
        }
    }

    get miniZoneItemZoneNameTagBackgroundColor() {
        if(this._theme === `dark`) {
            return this.miniZoneItem.dark.zoneNameTag.backgroundColor;
        } else {
            return this.miniZoneItem.light.zoneNameTag.backgroundColor;
        }
    }

    get miniZoneItemZoneNameTagColor() {
        if(this._theme === `dark`) {
            return this.miniZoneItem.dark.zoneNameTag.color;
        } else {
            return this.miniZoneItem.light.zoneNameTag.color;
        }
    }
    
    robotAlarmDlgItem = {
        dark: {
            backgroundColor: "#21263a",
            borderColor: "#393e55",
            thBackgroundColor: "#2a2f44",
            tdBackgroundColor: "#21263a",
            tdBorderColor: "#2a2f44"
        },
        light: {
            backgroundColor: "#ffffff",
            borderColor: "#c5cfd9",
            thBackgroundColor: "#d8e2ee",
            tdBackgroundColor: "#ffffff",
            tdBorderColor: "#d8e2ee"
        }
    }

    get robotAlarmDlgItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotAlarmDlgItem.dark.backgroundColor;
        } else {
            return this.robotAlarmDlgItem.light.backgroundColor;
        }
    }

    get robotAlarmDlgItemBorderColor() {
        if(this._theme === `dark`) {
            return this.robotAlarmDlgItem.dark.borderColor;
        } else {
            return this.robotAlarmDlgItem.light.borderColor;
        }
    }

    get robotAlarmDlgItemThBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotAlarmDlgItem.dark.thBackgroundColor;
        } else {
            return this.robotAlarmDlgItem.light.thBackgroundColor;
        }
    }

    get robotAlarmDlgItemTdBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotAlarmDlgItem.dark.tdBackgroundColor;
        } else {
            return this.robotAlarmDlgItem.light.tdBackgroundColor;
        }
    }

    get robotAlarmDlgItemTdBorderColor() {
        if(this._theme === `dark`) {
            return this.robotAlarmDlgItem.dark.tdBorderColor;
        } else {
            return this.robotAlarmDlgItem.light.tdBorderColor;
        }
    }

    zoneMonitoringItem = {
        dark: {
            backgroundColor: "#171a29",
            borderColor: "#203556",
            activeModeColor: "#237ffe",
            loadingColor: "#237ffe",
            conveyorColor: "#3b3f58",
            hscMenuStyle: {
                backgroundColor: "#21263a",
                color: "#ffffff"
            },
            infoStyle: {
                backgroundColor: "#21263a",
                color: "#ffffff",
                borderColor: "#21263a"
            },
            robotStyle: {
                backgroundColor: "#171a29",
                color: "#ffffff",
            },
            atomizerStyle: {
                externalColor: "#ffffff"
            },
            bodyStyle: {
                color: "#25273e"
            }

        },
        light: {
            backgroundColor: "#171a29",
            borderColor: "#203556",
            activeModeColor: "#237ffe",
            loadingColor: "#237ffe",
            conveyorColor: "#3b3f58",
            hscMenuStyle: {
                backgroundColor: "#3086ff",
                color: "#ffffff"
            },
            infoStyle: {
                backgroundColor: "#ffffff",
                color: "#111111",
                borderColor: "#c5cfd9"
            },
            robotStyle: {
                backgroundColor: "#171a29",
                color: "#ffffff"
            },
            atomizerStyle: {
                externalColor: "#ffffff"
            },
            bodyStyle: {
                color: "#25273e"
            }
        }
    }

    get zoneMonitoringItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.backgroundColor;
        } else {
            return this.zoneMonitoringItem.light.backgroundColor;
        }
    }

    get zoneMonitoringItemBorderColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.borderColor;
        } else {
            return this.zoneMonitoringItem.light.borderColor;
        }
    }

    get zoneMonitoringItemActiveModeColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.activeModeColor;
        } else {
            return this.zoneMonitoringItem.light.activeModeColor;
        }
    }

    get zoneMonitoringItemHscMenuStyleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.hscMenuStyle.backgroundColor;
        } else {
            return this.zoneMonitoringItem.light.hscMenuStyle.backgroundColor;
        }
    }

    get zoneMonitoringItemLoadingColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.loadingColor;
        } else {
            return this.zoneMonitoringItem.light.loadingColor;
        }
    }

    get zoneMonitoringItemConveyorColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.conveyorColor;
        } else {
            return this.zoneMonitoringItem.light.conveyorColor;
        }
    }

    get zoneMonitoringItemHscMenuStyleColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.hscMenuStyle.color;
        } else {
            return this.zoneMonitoringItem.light.hscMenuStyle.color;
        }
    }

    get zoneMonitoringItemInfoStyleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.infoStyle.backgroundColor;
        } else {
            return this.zoneMonitoringItem.light.infoStyle.backgroundColor;
        }
    }

    get zoneMonitoringItemInfoStyleColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.infoStyle.color;
        } else {
            return this.zoneMonitoringItem.light.infoStyle.color;
        }
    }

    get zoneMonitoringItemInfoStyleBorderColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.infoStyle.borderColor;
        } else {
            return this.zoneMonitoringItem.light.infoStyle.borderColor;
        }
    }

    get zoneMonitoringItemRobotStyleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.robotStyle.backgroundColor;
        } else {
            return this.zoneMonitoringItem.light.robotStyle.backgroundColor;
        }
    }

    get zoneMonitoringItemRobotStyleColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.robotStyle.color;
        } else {
            return this.zoneMonitoringItem.light.robotStyle.color;
        }
    }

    get zoneMonitoringItemAtomizerStyleExternalColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.atomizerStyle.externalColor;
        } else {
            return this.zoneMonitoringItem.light.atomizerStyle.externalColor;
        }
    }

    get zoneMonitoringItemBodyStyleColor() {
        if(this._theme === `dark`) {
            return this.zoneMonitoringItem.dark.bodyStyle.color;
        } else {
            return this.zoneMonitoringItem.light.bodyStyle.color;
        }
    }

    robotDetailItem = {
        dark: {
            hscMenuStyle: {
                backgroundColor: "#21263a",
                color: "#ffffff",
                borderColor: "#393e55"
            },
            infoStyle: {
                backgroundColor: "#21263a",
                color: "#ffffff",
                borderColor: "#393e55"
            },
            temperatureCard: {
                backgroundColor: "#21263a",
                color: "#ffffff",
                borderColor: "#393e55"
            },
            temperatureCardTitle: {
                backgroundColor: "#171a29",
                color: "#ffffff"
            }
        },
        light: {
            hscMenuStyle: {
                backgroundColor: "#3086ff",
                color: "#ffffff",
                borderColor: "#c5cfd9"
            },
            infoStyle: {
                backgroundColor: "#ffffff",
                color: "#111111",
                borderColor: "#c5cfd9"
            },
            temperatureCard: {
                backgroundColor: "#ffffff",
                color: "#111111",
                borderColor: "#c5cfd9"
            },
            temperatureCardTitle: {
                backgroundColor: "#f6fafd",
                color: "#111111"
            }
        }
    }

    get robotDetailItemHscMenuStyleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.hscMenuStyle.backgroundColor;
        } else {
            return this.robotDetailItem.light.hscMenuStyle.backgroundColor;
        }
    }

    get robotDetailItemHscMenuStyleColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.hscMenuStyle.color;
        } else {
            return this.robotDetailItem.light.hscMenuStyle.color;
        }
    }

    get robotDetailItemHscMenuStyleBorderColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.hscMenuStyle.borderColor;
        } else {
            return this.robotDetailItem.light.hscMenuStyle.borderColor;
        }
    }

    get robotDetailItemInfoStyleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.infoStyle.backgroundColor;
        } else {
            return this.robotDetailItem.light.infoStyle.backgroundColor;
        }
    }

    get robotDetailItemInfoStyleColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.infoStyle.color;
        } else {
            return this.robotDetailItem.light.infoStyle.color;
        }
    }

    get robotDetailItemInfoStyleBorderColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.infoStyle.borderColor;
        } else {
            return this.robotDetailItem.light.infoStyle.borderColor;
        }
    }

    get robotDetailItemTemperatureCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.temperatureCard.backgroundColor;
        } else {
            return this.robotDetailItem.light.temperatureCard.backgroundColor;
        }
    }

    get robotDetailItemTemperatureCardColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.temperatureCard.color;
        } else {
            return this.robotDetailItem.light.temperatureCard.color;
        }
    }

    get robotDetailItemTemperatureCardBorderColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.temperatureCard.borderColor;
        } else {
            return this.robotDetailItem.light.temperatureCard.borderColor;
        }
    }

    get robotDetailItemTemperatureCardTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.temperatureCardTitle.backgroundColor;
        } else {
            return this.robotDetailItem.light.temperatureCardTitle.backgroundColor;
        }
    }

    get robotDetailItemTemperatureCardTitleColor() {
        if(this._theme === `dark`) {
            return this.robotDetailItem.dark.temperatureCardTitle.color;
        } else {
            return this.robotDetailItem.light.temperatureCardTitle.color;
        }
    }

    pastRobotStateTimeItem = {
        dark: {
            backgroundColor: "#21263a",
            color: "#ffffff",
            borderColor: "#121623",
            titleBackgroundColor: "#171a29",
            titleColor: "#ffffff",
            chart: {
                fontColor: "#ffffff",
                robotStatus: {
                    playback: "#06a43e",
                    manual: "#fec706",
                    alarm: "#e64107",
                    offline: "#53636f"
                }
            }
        },
        light: {
            backgroundColor: "#ffffff",
            color: "#111111",
            borderColor: "#c5cfd9",
            titleBackgroundColor: "#f6fafd",
            titleColor:  "#111111",
            chart: {
                fontColor: "#111111",
                robotStatus: {
                    playback: "#06a43e",
                    manual: "#fec706",
                    alarm: "#e64107",
                    offline: "#53636f"
                }
            }
        }
    }

    get pastRobotStateTimeItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.pastRobotStateTimeItem.dark.backgroundColor;
        } else {
            return this.pastRobotStateTimeItem.light.backgroundColor;
        }
    }

    get pastRobotStateTimeItemColor() {
        if(this._theme === `dark`) {
            return this.pastRobotStateTimeItem.dark.color;
        } else {
            return this.pastRobotStateTimeItem.light.color;
        }
    }

    get pastRobotStateTimeItemBorderColor() {
        if(this._theme === `dark`) {
            return this.pastRobotStateTimeItem.dark.borderColor;
        } else {
            return this.pastRobotStateTimeItem.light.borderColor;
        }
    }

    get pastRobotStateTimeItemTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.pastRobotStateTimeItem.dark.titleBackgroundColor;
        } else {
            return this.pastRobotStateTimeItem.light.titleBackgroundColor;
        }
    }

    get pastRobotStateTimeItemTitleColor() {
        if(this._theme === `dark`) {
            return this.pastRobotStateTimeItem.dark.titleColor;
        } else {
            return this.pastRobotStateTimeItem.light.titleColor;
        }
    }

    get pastRobotStateTimeItemChartFontColor() {
        if(this._theme === `dark`) {
            return this.pastRobotStateTimeItem.dark.chart.fontColor;
        } else {
            return this.pastRobotStateTimeItem.light.chart.fontColor;
        }
    }

    get pastRobotStateTimeItemChartRobotStatusColor() {
        if(this._theme === `dark`) {
            return this.pastRobotStateTimeItem.dark.chart.robotStatus;
        } else {
            return this.pastRobotStateTimeItem.light.chart.robotStatus;
        }
    }

    robotInfosItem = {
        dark: {
            cardBorderColor: "#393e55",
            thBackgroundColor: "#171a29",
            tdBackgroundColor: "#21263a",
            color: "#ffffff",
            borderColor: "#171a29"
        },
        light: {
            cardBorderColor: "#c5cfd9",
            thBackgroundColor: "#d8e2ee",
            tdBackgroundColor: "#ffffff",
            color: "#111111",
            borderColor: "#c5cfd9"
        }
    }

    get robotInfosItemCardBorderColor() {
        if(this._theme === `dark`) {
            return this.robotInfosItem.dark.cardBorderColor;
        } else {
            return this.robotInfosItem.light.cardBorderColor;
        }
    }

    get robotInfosItemThBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotInfosItem.dark.thBackgroundColor;
        } else {
            return this.robotInfosItem.light.thBackgroundColor;
        }
    }

    get robotInfosItemTdBackgroundColor() {
        if(this._theme === `dark`) {
            return this.robotInfosItem.dark.tdBackgroundColor;
        } else {
            return this.robotInfosItem.light.tdBackgroundColor;
        }
    }

    get robotInfosItemColor() {
        if(this._theme === `dark`) {
            return this.robotInfosItem.dark.color;
        } else {
            return this.robotInfosItem.light.color;
        }
    }

    get robotInfosItemBorderColor() {
        if(this._theme === `dark`) {
            return this.robotInfosItem.dark.borderColor;
        } else {
            return this.robotInfosItem.light.borderColor;
        }
    }

    /**
     * 
     * 도장기 실시간 차트 아이템
     */
    atomizerRealTimeChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: "#ffffff"
            },
            axis: {
                labelFontColor: `#ffffff`,
                axisX: {
                    lineColor: `#575f7d`
                },
                axisY: {
                    gridColor: `#575f7d`
                }
            },
            legend: {
                fontColor: `#ffffff`
            },
            dataPoints: {
                colors: {
                    cmd: `#509aff`,
                    feedback: `#f48a38`
                }
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: "#60676f"
            },
            axis: {
                labelFontColor: `#60676f`,
                axisX: {
                    lineColor: `#b6b9c3`
                },
                axisY: {
                    gridColor: `#b6b9c3`
                }
            },
            legend: {
                fontColor: `#60676f`
            },
            dataPoints: {
                colors: {
                    cmd: `#3297ff`,
                    feedback: `#ffa422`
                }
            }
        }
    }


    /**
     * 
     *  도장기 실시간 차트 배경색 가져오기
     */
    get atomizerRealTimeChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.atomizerRealTimeChartItem.dark.default.backgroundColor;
        }
        else {
            return this.atomizerRealTimeChartItem.light.default.backgroundColor;
        }
    } 

    /**
     * 
     * 도장기 실시간 차트 기본 문구 색상 가져오기
     */
    get atomizerRealTimeChartDefaultFontColor() {
        if(this._theme === `dark`) {
            return this.atomizerRealTimeChartItem.dark.default.fontColor;
        }
        else {
            return this.atomizerRealTimeChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * 도장기 실시간 차트 축 라벨 색상 가져오기
     */
    get atomizerRealTimeChartAxisLabelColor() {
        if(this._theme === `dark`) {
            return this.atomizerRealTimeChartItem.dark.axis.labelFontColor;
        }
        else {
            return this.atomizerRealTimeChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * 도장기 실시간 차트 X축 라인 색상 가져오기
     */
    get atomizerRealTimeChartXAxisLineColor() {
        if(this._theme === `dark`) {
            return this.atomizerRealTimeChartItem.dark.axis.axisX.lineColor;
        }
        else {
            return this.atomizerRealTimeChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * 도장기 실시간 차트 Y축 그리드 색상 가져오기
     */
    get atomizerRealTimeChartYAxisGridColor() {
        if(this._theme === `dark`) {
            return this.atomizerRealTimeChartItem.dark.axis.axisY.gridColor;
        }
        else {
            return this.atomizerRealTimeChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * 도장기 실시간 차트 레전드 색상 가져오기
     */
    get atomizerRealTimeChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.atomizerRealTimeChartItem.dark.legend.fontColor;
        }
        else {
            return this.atomizerRealTimeChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     * 도장기 실시간 차트 데이터 포인트 색상 가져오기
     */
    get atomizerRealTimeChartDataPointColors() {
        if(this._theme === `dark`) {
            return this.atomizerRealTimeChartItem.dark.dataPoints.colors;
        }
        else {
            return this.atomizerRealTimeChartItem.dark.dataPoints.colors;
        }
    }

    statusTableItem = {
        dark: {
            borderColor: '#3b3f58',
            predictIconColor: '#4bc652'
        },
        light: {
            borderColor: '#b2bad0',
            predictIconColor: '#4bc652'
        }
    }

    get statusTableItemBorderColor() {
        if(this._theme === `dark`) {
            return this.statusTableItem.dark.borderColor;
        } else {
            return this.statusTableItem.light.borderColor;
        }
    }

    get statusTableItemPredictIconColor() {
        if(this._theme === `dark`) {
            return this.statusTableItem.dark.predictIconColor;
        } else {
            return this.statusTableItem.light.predictIconColor;
        }
    }

    predictStatusItem = {
        normal: "#4bc652",
        alarm: "#f44336"
    }

    get predictStatusItemNormalColor() {
        return this.predictStatusItem.normal;
    }

    get predictStatusItemAlarmColor() {
        return this.predictStatusItem.alarm;
    }

    selectOptionDlgItem = {
        dark: {
            card: {
                backgroundColor: "#25273e",
                color: "#ffffff"
            },
            cardContents: {
                backgroundColor: "#34364e"
            },
            cardPredictStatus: {
                borderColor: "#595c86"
            }
        },
        light: {
            card: {
                backgroundColor: "#ccd2e2",
                color: "#111111"
            },
            cardContents: {
                backgroundColor: "#ffffff"
            },
            cardPredictStatus: {
                borderColor: "#b2bad0"
            }
        }
    }

    get selectOptionDlgItemCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.selectOptionDlgItem.dark.card.backgroundColor;
        } else {
            return this.selectOptionDlgItem.light.card.backgroundColor;
        }
    }

    get selectOptionDlgItemCardColor() {
        if(this._theme === `dark`) {
            return this.selectOptionDlgItem.dark.card.color;
        } else {
            return this.selectOptionDlgItem.light.card.color;
        }
    }

    get selectOptionDlgItemCardContentsBackgroundColor() {
        if(this._theme === `dark`) {
            return this.selectOptionDlgItem.dark.cardContents.backgroundColor;
        } else {
            return this.selectOptionDlgItem.light.cardContents.backgroundColor;
        }
    }

    get selectOptionDlgItemCardPredictStatusBorderColor() {
        if(this._theme === `dark`) {
            return this.selectOptionDlgItem.dark.cardPredictStatus.borderColor;
        } else {
            return this.selectOptionDlgItem.light.cardPredictStatus.borderColor;
        }
    }
}