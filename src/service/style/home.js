
/**
 *
 * 홈 화면 스타일 지정 클래스
 * @export
 * @class HomeSty
 */
export class HomeSty {

    /**
     *Creates an instance of HomeSty.
     * @memberof HomeSty
     */
    constructor() {
        
    }

    /**
     *
     * 기본 테마 세팅
     * @memberof HomeSty
     */
    _theme = `dark`
    /**
     *
     * 부스모니터링 자세히보기 텍스트 아이템
     * @memberof HomeSty
     */
    boothMonitoringDetailShowTextItem = {
        dark: {
            color: `#ffffff`,
        },
        light: {
            color: `#5c738c`,
        },
    }

    /**
     *
     * 부스 모니터링 원형 차트 카드 아이템
     * @memberof HomeSty
     */
    boothMonitoringCardItem = {
        dark: {
            backgroundColor: `#21263a`,
            borderColor: `#393e55`,
            fontColor: `#ffffff`,
            loadingColor: `#237ffe`,
            tdColor: `#ffffff`,
        },
        light: {
            backgroundColor: `#ffffff`,
            borderColor: `#c5cfd9`,
            fontColor: `#111111`,
            loadingColor: `#237ffe`,
            tdColor: `#2b2e3a`,
        },
    }

    get boothMonitoringCardItemTdColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardItem.dark.tdColor;
        } else {
            return this.boothMonitoringCardItem.light.tdColor;
        }
    }

    /**
     *
     * 부스 모니터링 원형 차트 색 아이템 (변경불가)
     * @memberof HomeSty
     */
    boothMonitoringCardChartItem = {
        dark: {
            offline: `#53636F`,
            ready: `#FEC706`,
            action: `#06A43E`,
            alarm: `#E64107`,
            indexLabel: {
                fontColor: "#ffffff"
            }
        },
        light: {
            offline: `#c7cdd2`,
            ready: `#fed557`,
            action: `#5bc76c`,
            alarm: `#ff6145`,
            indexLabel: {
                fontColor: "#5b617a"
            }
        },
    }

    /**
     *
     * 테이블 카드 상단 아이템
     * @memberof HomeSty
     */
    tableCardTopItem = {
        dark: {
            backgroundColor: `#171a29`,
        },
        light: {
            backgroundColor: `#f6f9fc`,
        },
    }
    /**
     *
     * 테이블 헤드 아이템
     * @memberof HomeSty
     */
    tableTHeadItem = {
        dark: {
            backgroundColor: `#21263a`,
            borderBottomColor: `#21263a`,
        },
        light: {
            backgroundColor: `#FFFFFF`,
            borderBottomColor: `#cdd6df`,
        },
    }

    /**
     *
     * 테이블 바디 odd 아이템
     * @memberof HomeSty
     */
    tableTBodyOddItem = {
        dark: {
            backgroundColor: `#2a2f44`,
            borderBottomColor: `#2a2f44`,
        },
        light: {
            backgroundColor: `#ffffff`,
            borderBottomColor: `#cdd6df`,
        },
    }

    /**
     *
     * 테이블 바디 even 아이템
     * @memberof HomeSty
     */
    tableTBodyEvenItem = {
        dark: {
            backgroundColor: `#21263a`,
            borderBottomColor: `#21263a`,
        },
        light: {
            backgroundColor: `#ecf2f9`,
            borderBottomColor: `#cdd6df`,
        },
    }

    /**
     *
     * 테이블 바디 hover 아이템
     * @memberof HomeSty
     */
    tableTBodyHoverItem = {
        dark: {
            backgroundColor: `#393B58`,
        },
        light: {
            backgroundColor: `#83a7cd`,
        },
    }

    /**
     *
     * 테이블 페이지네이션 아이템
     * @memberof HomeSty
     */
    tablePaginationItem = {
        dark: {
            background: `#2c3146`,
        },
        light: {
            background: `#cfdae7`,
        }
    }

    /**
     *
     * 테이블 하단 아이템
     * @memberof HomeSty
     */
    tableCardBottomItem = {
        dark: {
            backgroundColor: `#21263a`,
        },
        light: {
            backgroundColor: `#ffffff`,
        },
    }
    /**
     *
     * 오늘 알람 발생 건 및 정지 시간 스타일 템플릿
     * @memberof HomeSty
     */
    chartAlarmItem = {
        dark: {
            default: {
                backgroundColor: "#171a29",
                fontColor: "#ffffff"
            },
            axis: {
                axisX: {
                    labelFontColor: "#ffffff",
                    lineColor: "#575f7d"
                },
                axisY: {
                    gridColor: "#575f7d",
                    axisY1: {
                        labelFontColor: "#18c2fa"
                    },
                    axisY2: {
                        labelFontColor: "#cf9e48"
                    }
                }
            },
            legend: {
                fontColor: "#ffffff"
            }
        },
        light: {
            default: {
                backgroundColor: "#ffffff",
                fontColor: "#60676f"
            },
            axis: {
                axisX: {
                    labelFontColor: "#60676f",
                    lineColor: "#b6b9c3"
                },
                axisY: {
                    gridColor: "#b6b9c3",
                    axisY1: {
                        labelFontColor: "#3297ff"
                    },
                    axisY2: {
                        labelFontColor: "#ffa422"
                    }
                }
            },
            legend: {
                fontColor: "#60676f"
            }
        },
    }
    /**
     *
     * 유지보수 테이블 아이템
     * @memberof HomeSty
     */
    tableMaintenanceItem = {
        dark: {
            backgroundColor: `#171A29`,
            showDetailTextColor: `#FFFFFF`,
            warningStatus :{
                low: "#0bb881",
                mid: "#fec500",
                high: "#fd5f5f"
            }
        },
        light: {
            backgroundColor: `#f6f9fc`,
            showDetailTextColor: `#5c738c`,
            warningStatus :{
                low: "#0bb881",
                mid: "#fec500",
                high: "#fd5f5f"
            }
        },
    }
    /**
     *
     * 예지 알람 테이블 아이템
     * @memberof HomeSty
     */
    tablePredictAlarmItem = {
        dark: {
            backgroundColor: `#171A29`,
            showDetailTextColor: `#FFFFFF`,
        },
        light: {
            backgroundColor: `#f6f9fc`,
            showDetailTextColor: `#7f92a7`,
        },
    }
    /**
     *
     * 홈 테마 설정
     * @memberof HomeSty
     */
    set homeMode(theme) {
        this._theme = theme;
    }

    /**
     *
     * HomeStl 인스턴스 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get instanceHomeSty() {
        return this;
    }

    /**
     *
     * 부스모니터링 자세히 보기 텍스트
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringDetailShowTextColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringDetailShowTextItem.dark.color;
        } else {
            return this.boothMonitoringDetailShowTextItem.light.color;
        }
    }
   
    /**
     *
     * 부스 모니터링 카드 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringCardColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardItem.dark.backgroundColor;
        } else {
            return this.boothMonitoringCardItem.light.backgroundColor;
        }
    }

    /**
     *
     * 부스 모니터링 카드 border 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringCardBorderColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardItem.dark.borderColor;
        } else {
            return this.boothMonitoringCardItem.light.borderColor;
        }
    }

    /**
     *
     * 부스 모니터링 카드 font 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringCardFontColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardItem.dark.fontColor;
        } else {
            return this.boothMonitoringCardItem.light.fontColor;
        }
    }
    
    /**
     *
     * 부스 모니터링 원형 차트 로딩 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringCardLoadingColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardItem.dark.loadingColor;
        } else {
            return this.boothMonitoringCardItem.light.loadingColor;
        }
    }

    /**
     *
     * 부스 모니터링 원형 차트 오프라인 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringCardChartOfflineColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardChartItem.dark.offline;
        } else {
            return this.boothMonitoringCardChartItem.light.offline;
        }
    }

    /**
     *
     * 부스 모니터링 원형 차트 레디 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringCardChartReadyColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardChartItem.dark.ready;
        } else {
            return this.boothMonitoringCardChartItem.light.ready;
        }
    }
    /**
     *
     * 부스 모니터링 원형 차트 액션 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringCardChartActionColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardChartItem.dark.action;
        } else {
            return this.boothMonitoringCardChartItem.light.action;
        }
    }

    /**
     *
     * 부스 모니터링 원형 차트 알람 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get boothMonitoringCardChartAlarmColor() {
        if (this._theme === `dark`) {
            return this.boothMonitoringCardChartItem.dark.alarm;
        } else {
            return this.boothMonitoringCardChartItem.light.alarm;
        }
    }

    /**
     * 
     * 부스 모니터링 원형 차트 Index Label Font 색상 가져오기
     */
    get boothMonitoringCardChartIndexLabelFontColor() {
        if(this._theme === `dark`) {
            return this.boothMonitoringCardChartItem.dark.indexLabel.fontColor;
        } else {
            return this.boothMonitoringCardChartItem.light.indexLabel.fontColor;
        }
    }

    /**
     *
     * 알람 차트 배경 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get chartAlarmBackgroundColor() {
        if (this._theme === `dark`) {
            return this.chartAlarmItem.dark.default.backgroundColor;
        } else {
            return this.chartAlarmItem.light.default.backgroundColor;
        }
    }

    /**
     *
     * 알람 차트 기본 문구 색상 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get chartAlarmFontColor() {
        if (this._theme === `dark`) {
            return this.chartAlarmItem.dark.default.fontColor;
        } else {
            return this.chartAlarmItem.light.default.fontColor;
        }
    }

    /**
     * 
     * 알람 차트 X축 라벨 색상 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get chartAlarmAxisXLabelFontColor() {
        if(this._theme === `dark`) {
            return this.chartAlarmItem.dark.axis.axisX.labelFontColor;
        } else {
            return this.chartAlarmItem.light.axis.axisX.labelFontColor;
        }
    }

    /**
     * 
     * 알람 차트 X축 라인 색상 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get chartAlarmAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.chartAlarmItem.dark.axis.axisX.lineColor;
        } else {
            return this.chartAlarmItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * 알람 차트 Y축 그리드 색상 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get chartAlarmAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.chartAlarmItem.dark.axis.axisY.gridColor;
        } else {
            return this.chartAlarmItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * 알람 차트 Y축 발생 건 색상 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get chartAlarmAxisY1LabelFontColor() {
        if(this._theme === `dark`) {
            return this.chartAlarmItem.dark.axis.axisY.axisY1.labelFontColor;
        } else {
            return this.chartAlarmItem.light.axis.axisY.axisY1.labelFontColor;
        }
    }

    /**
     * 
     * 알람 차트 Y축 정지 시간 색상 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get chartAlarmAxisY2LabelFontColor() {
        if(this._theme === `dark`) {
            return this.chartAlarmItem.dark.axis.axisY.axisY2.labelFontColor;
        } else {
            return this.chartAlarmItem.light.axis.axisY.axisY2.labelFontColor;
        }
    }

    /**
     * 
     * 알람 차트 레전드 색상 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get chartAlarmLegendFontColor() {
        if(this._theme === `dark`) {
            return this.chartAlarmItem.dark.legend.fontColor;
        } else {
            return this.chartAlarmItem.light.legend.fontColor;
        }
    }
  
    /**
     *
     * 유지보수 자세히 보기 글자 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get tableMaintenanceShowDetailTextColor() {
        if (this._theme === `dark`) {
            return this.tableMaintenanceItem.dark.showDetailTextColor;
        } else {
            return this.tableMaintenanceItem.light.showDetailTextColor;
        }
    }
    /**
     *
     * 유지보수 백그라운드 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get tableMaintenanceBackgroundColor() {
        if (this._theme === `dark`) {
            return this.tableMaintenanceItem.dark.backgroundColor;
        } else {
            return this.tableMaintenanceItem.light.backgroundColor;
        }
    }

    get tableMaintenanceWarningStatus() {
        if(this._theme === `dark`) {
            return this.tableMaintenanceItem.dark.warningStatus;
        } else {
            return this.tableMaintenanceItem.light.warningStatus;
        }
    }
    /**
     *
     * 예지알람 자세히 보기 글자 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get tablePredictAlarmShowDetailTextColor() {
        if (this._theme === `dark`) {
            return this.tablePredictAlarmItem.dark.showDetailTextColor;
        } else {
            return this.tablePredictAlarmItem.light.showDetailTextColor;
        }
    }
    /**
     *
     * 예지알람 백그라운드 색 가져오기
     * @readonly
     * @memberof HomeSty
     */
    get tablePredictAlarmBackgroundColor() {
        if (this._theme === `dark`) {
            return this.tablePredictAlarmItem.dark.backgroundColor;
        } else {
            return this.tablePredictAlarmItem.light.backgroundColor;
        }
    }
}