export class RealTimeSty {
    constructor() {

    }
    _theme = `dark`;
    set realTimeMode(theme) {
        this._theme = theme;
    }
    get instanceRealTimeSty() {
        return this;
    }

    realTimeItem = {
        dark: {
            activeClass: `dy_blue_dark dy_white--text`,
            tabsColor: `#171a29`,
            tabStyleColor: `#bcbdc4`,
            tabStyleBackgroundColor: `#2f354b`,
            tabsStyleBorderBottom: `1px solid #575f7d`,
            robotSelectTextColor: `#ffffff`
        },
        light: {
            activeClass: `dy_blue_light dy_white--text`,
            tabsColor: `#f6f9fc`,
            tabStyleColor: `#c1c8e0`,
            tabStyleBackgroundColor: `#566083`, 
            tabsStyleBorderBottom: `2px solid #237ffe`,
            robotSelectTextColor: `#a7acc0`
        }
    }

    get realTimeItemActiveClass() {
        if(this._theme === `dark`) {
            return this.realTimeItem.dark.activeClass;
        } else {
            return this.realTimeItem.light.activeClass;
        }
    }

    get realTimeItemTabsColor() {
        if(this._theme === `dark`) {
            return this.realTimeItem.dark.tabsColor;
        } else {
            return this.realTimeItem.light.tabsColor;
        }
    }

    get realTimeItemTabStyleColor() {
        if(this._theme === `dark`) {
            return this.realTimeItem.dark.tabStyleColor;
        } else {
            return this.realTimeItem.light.tabStyleColor;
        }
    }

    get realTimeItemTabStyleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.realTimeItem.dark.tabStyleBackgroundColor;
        } else {
            return this.realTimeItem.light.tabStyleBackgroundColor;
        }
    }

    get realTimeItemTabsStyleBorderBottom() {
        if(this._theme === `dark`) {
            return this.realTimeItem.dark.tabsStyleBorderBottom;
        } else {
            return this.realTimeItem.light.tabsStyleBorderBottom;
        }
    }

    get realTimeItemRobotSelectTextColor() {
        if(this._theme === `dark`) {
            return this.realTimeItem.dark.robotSelectTextColor;
        } else {
            return this.realTimeItem.light.robotSelectTextColor;
        }
    }

    warningSettingDlgItem = {
        dark: {
            backgrondColor: "#393e55",
            color: "#ffffff",
            borderColor: "#393e55",
            inputBackgroundColor: "#393e55",
            inputBorderColor: "#ffffff"
        },
        light: {
            backgrondColor: "#d2d7e5",
            color: "#353544",
            borderColor: "#a6aebf",
            inputBackgroundColor: "#ffffff",
            inputBorderColor: "#313547"
        }
    }

    get warningSettingDlgItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.warningSettingDlgItem.dark.backgrondColor;
        } else {
            return this.warningSettingDlgItem.light.backgrondColor;
        }
    }

    get warningSettingDlgItemColor() {
        if(this._theme === `dark`) {
            return this.warningSettingDlgItem.dark.color;
        } else {
            return this.warningSettingDlgItem.light.color;
        }
    }

    get warningSettingDlgItemBorderColor() {
        if(this._theme === `dark`) {
            return this.warningSettingDlgItem.dark.borderColor;
        } else {
            return this.warningSettingDlgItem.light.borderColor;
        }
    }

    get warningSettingDlgItemInputBackgroundColor() {
        if(this._theme === `dark`) {
            return this.warningSettingDlgItem.dark.inputBackgroundColor;
        } else {
            return this.warningSettingDlgItem.light.inputBackgroundColor;
        }
    }

    get warningSettingDlgItemInputBorderColor() {
        if(this._theme === `dark`) {
            return this.warningSettingDlgItem.dark.inputBorderColor;
        } else {
            return this.warningSettingDlgItem.light.inputBorderColor;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 아이템
     */
    realTimeTorqueItem = {
        dark: {
            axisButton: {
                color: `#0ca889`
            },
            chartLineColor: {
                robot: {
                    selected: `#12d48d`,
                    realtion: `#9608bf`
                },
                axis: {
                    axis_1: `#a1df49`,
                    axis_2: `#39ea09`,
                    axis_3: `#0d7687`,
                    axis_4: `#0c79be`,
                    axis_5: `#0842ff`,
                    axis_6: `#8501ad`,
                    aixs_7: `#5c658c`,
                },
                setting: {
                    forwardWarning: `#ff5d40`,
                    forwardViolation: `#ffa422`,
                    reverseWarning: `#ff5d40`,
                    reverseViolation: `#ffa422`
                }
            }
        },
        light: {
            axisButton: {
                color: `#3297ff`
            },
            chartLineColor: {
                robot: {
                    selected: `#3297ff`,
                    realtion: `#08ba64`
                },
                axis: {
                    axis_1: `#9add3b`,
                    axis_2: `#0bb881`,
                    axis_3: `#3297ff`,
                    axis_4: `#0371e3`,
                    axis_5: `#0baeb8`,
                    axis_6: `#0d7687`,
                    aixs_7: `#a2b1ca`,
                },
                setting: {
                    forwardWarning: `#ff5d40`,
                    forwardViolation: `#ffa422`,
                    reverseWarning: `#ff5d40`,
                    reverseViolation: `#ffa422`
                }
            }
        }
    }

    /**
     * 
     * 실시간 토크 부하율 아이템 축 버튼 색상 가져오기
     */
    get realTimeTorqueAxisButtonColor() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueItem.dark.axisButton.color;
        } else {
            return this.realTimeTorqueItem.light.axisButton.color;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 아이템 로봇 차트 라인 색상
     * selected, relation
     */
    get realTimeTorqueRobotChartLineColors() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueItem.dark.chartLineColor.robot;
        } else {
            return this.realTimeTorqueItem.light.chartLineColor.robot;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 아이템 축 차트 라인 색상 
     * axis_1 ... axis_7
     */
    get realTimeTorqueAxisChartLineColors() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueItem.dark.chartLineColor.axis;
        } else {
            return this.realTimeTorqueItem.light.chartLineColor.axis;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 아이템 설정 값 차트 라인 색상
     *  forwardWarning, forwardViolation, reverseWarning, reverseViolation
     */
    get realTimeTorqueSettingChartLineColors() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueItem.dark.chartLineColor.setting;
        } else {
            return this.realTimeTorqueItem.light.chartLineColor.setting;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 차트 아이템
     */
    realTimeTorqueChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
            },
            axis: {
                labelFontColor: `#ffffff`,
                axisX: {
                    lineColor: `#575f7d`
                },
                axisY: {
                    gridColor: `#575f7d`
                },
            },
            legend: {
                fontColor: `#ffffff`
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
            },
            axis: {
                labelFontColor: `#60676f`,
                axisX: {
                    lineColor: `#b6b9c3`
                },
                axisY: {
                    gridColor: `#b6b9c3`
                },
            },
            legend: {
                fontColor: `#60676f`
            }
        }
    }

    /**
     * 
     * 실시간 토크 부하율 차트 배경 색상 가져오기
     */
    get realTimeTorqueChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueChartItem.dark.default.backgroundColor;
        } else {
            return this.realTimeTorqueChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 차트 축 라벨 색상 가져오기
     */
    get realTimeTorqueChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueChartItem.dark.axis.labelFontColor;
        } else {
            return this.realTimeTorqueChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 차트 X축 라인 색상 가져오기
     */
    get realTimeTorqueChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.realTimeTorqueChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 차트 Y축 그리드 색상 가져오기
     */
    get realTimeTorqueChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.realTimeTorqueChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * 실시간 토크 부하율 레전드 색상 가져오기
     */
    get realTimeTorqueChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.realTimeTorqueChartItem.dark.legend.fontColor;
        } else {
            return this.realTimeTorqueChartItem.light.legend.fontColor;
        }
    }

    realTimeLogListItem = {
        dark: {
            backgroundColor: "#2c3247",
            borderColor: "#575f7d",
            listBackgroundColor: "#2c3247",
            listWarningColor: "#ff5d40",
            listViolationColor: "#ffa422"
        },
        light: {
            backgroundColor: "#d2d7e5",
            borderColor: "#575f7d",
            listBackgroundColor: "#d2d7e5",
            listWarningColor: "#ff5d40",
            listViolationColor: "#ffa422"
        }
    }
   
    get realTimeLogListItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.realTimeLogListItem.dark.backgroundColor;
        } else {
            return this.realTimeLogListItem.light.backgroundColor;
        }
    }

    get realTimeLogListItemBorderColor() {
        if(this._theme === `dark`) {
            return this.realTimeLogListItem.dark.borderColor;
        } else {
            return this.realTimeLogListItem.light.borderColor;
        }
    }

    get realTimeLogListItemListBackgroundColor() {
        if(this._theme === `dark`) {
            return this.realTimeLogListItem.dark.listBackgroundColor;
        } else {
            return this.realTimeLogListItem.light.listBackgroundColor;
        }
    }

    get realTimeLogListItemListWarningColor() {
        if(this._theme === `dark`) {
            return this.realTimeLogListItem.dark.listWarningColor;
        } else {
            return this.realTimeLogListItem.light.listWarningColor;
        }
    }

    get realTimeLogListItemListViolationColor() {
        if(this._theme === `dark`) {
            return this.realTimeLogListItem.dark.listViolationColor;
        } else {
            return this.realTimeLogListItem.light.listViolationColor;
        }
    }
}