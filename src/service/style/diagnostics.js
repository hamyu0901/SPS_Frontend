
export class DiagnosticsSty {
    constructor() {

    }
    _theme = `light`

    sideMenuItem = {
        dark: {
            menuBackgroundColor: `#25273e`,
            borderRightColor: `#121425`
        },
        light: {
            menuBackgroundColor: `#f1f6fc`,
            borderRightColor: `#bcc2d0`
        },
    }

    set diagnosticsMode(theme) {
        this._theme = theme;
    }
    get instanceDiagnosticsSty() {
        return this;
    }
    get sideMenuBackgroundColor() {
        if (this._theme === `dark`) {
            return this.sideMenuItem.dark.menuBackgroundColor;
        } else {
            return this.sideMenuItem.light.menuBackgroundColor;
        }
    }

    get sideMenuBorderRightColor() {
        if(this._theme === `dark`) {
            return this.sideMenuItem.dark.borderRightColor;
        } else {
            return this.sideMenuItem.light.borderRightColor;
        }
    }

    // predict
    predict = {
        dark: {
            subTitleColor: `grey`,
        },
        light: {
            subTitleColor: `grey`,
        }
    }

    get predictSubTitleColor() {
        if (this._theme === `dark`) {
            return this.predict.dark.subTitleColor;
        } else {
            return this.predict.light.subTitleColor;
        }
    }
    
    predictCodeSumChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: `#ffffff`,
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
            indexLabel: {
                fontColor: `#ffffff`,
            },
            legend: {
                fontColor: `#ffffff`
            },
            dataPoints: {
                color: {
                    p001: `#5F00FF`,
                    p002: `#aae472`,
                    p003: `#00D8FF`,
                    p004: `#246faf`,
                    p005: `#FF5E00`,
                    total: `#2c63c8` 
                }
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`,
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
            indexLabel: {
                fontColor: `#60676f`,
            },
            legend: {
                fontColor: `#60676f`
            },
            dataPoints: {
                color: {
                    p001: `#f174db`,
                    p002: `#9bd547`,
                    p003: `#52d9f1`,
                    p004: `#08ba64`,
                    p005: `#ffa200`,
                    total: `#3297ff` 
                }
            }
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 배경 색상 가져오기
     */
    get predictCodeSumChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.default.backgroundColor;
        } else {
            return this.predictCodeSumChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 기본 문구 색상 가져오기
     */
    get predictCodeSumChartFontColor() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.default.fontColor;
        } else {
            return this.predictCodeSumChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 축 라벨 색상 가져오기
     */
    get predictCodeSumChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.axis.labelFontColor;
        } else {
            return this.predictCodeSumChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 X축 라인 색상 가져오기
     */
    get predictCodeSumChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.predictCodeSumChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 Y축 그리드 색상 가져오기
     */
    get predictCodeSumChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.predictCodeSumChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 인덱스 라벨 색상 가져오기
     */
    get predictCodeSumChartIndexLabelFontColor() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.indexLabel.fontColor;
        } else {
            return this.predictCodeSumChartItem.light.indexLabel.fontColor;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 레전드 색상 가져오기
     */
    get predictCodeSumChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.legend.fontColor;
        } else {
            return this.predictCodeSumChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 P001(토크 범위 경고) 색상 가져오기
     */
    get predictCodeSumChartDataPointsP001Color() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.dataPoints.color.p001;
        } else {
            return this.predictCodeSumChartItem.light.dataPoints.color.p001;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 P002(온도 제한 경고) 색상 가져오기
     */
    get predictCodeSumChartDataPointsP002Color() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.dataPoints.color.p002;
        } else {
            return this.predictCodeSumChartItem.light.dataPoints.color.p002;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 P003(토크 주간 평균 경고) 색상 가져오기
     */
    get predictCodeSumChartDataPointsP003Color() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.dataPoints.color.p003;
        } else {
            return this.predictCodeSumChartItem.light.dataPoints.color.p003;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 P004(토크 유사도 경고) 색상 가져오기
     */
    get predictCodeSumChartDataPointsP004Color() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.dataPoints.color.p004;
        } else {
            return this.predictCodeSumChartItem.light.dataPoints.color.p004;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 P005(토크 범위 경고) 색상 가져오기
     */
    get predictCodeSumChartDataPointsP005Color() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.dataPoints.color.p005;
        } else {
            return this.predictCodeSumChartItem.light.dataPoints.color.p005;
        }
    }

    /**
     * 
     * [예지 보전] 최근 한달 간 발생한 예지 알람 개수 차트 전체 경고 합계 색상 가져오기
     */
    get predictCodeSumChartDataPointsTotalColor() {
        if(this._theme === `dark`) {
            return this.predictCodeSumChartItem.dark.dataPoints.color.total;
        } else {
            return this.predictCodeSumChartItem.light.dataPoints.color.total;
        }
    }

    /**
     * 
     * p001(토크 범위 경고) 차트 아이템
     */
    p001ViolationChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: `#ffffff`,
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
            },
            dataPoints: {
                color: {
                    torqueData: `#0bb881`,
                    maxConfigData: `#ff4e00`,
                    minConfigData: `#ff8000`,
                    violation: `#f63c1e`
                }
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`,
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
            },
            dataPoints: {
                color: {
                    torqueData: `#3297ff`,
                    maxConfigData: `#ffa422`,
                    minConfigData: `#0bb881`,
                    violation: `#ff5d40`
                }
            }
        }
    }

    /**
     * 
     *  p001(토크 범위 경고) violation chart 배경 색상 가져오기
     */
    get p001ViolationChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.p001ViolationChartItem.dark.default.backgroundColor;
        } else {
            return this.p001ViolationChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * p001(토크 범위 경고) violation chart 기본 문구 색상 가져오기
     */
    get p001ViolationChartFontColor() {
        if(this._theme === `dark`) {
            return this.p001ViolationChartItem.dark.default.fontColor;
        } else {
            return this.p001ViolationChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * p001(토크 범위 경고) violation chart 축 라벨 색상 가져오기
     */
    get p001ViolationChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.p001ViolationChartItem.dark.axis.labelFontColor;
        } else {
            return this.p001ViolationChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * p001(토크 범위 경고) violation chart X축 라인 색상 가져오기
     */
    get p001ViolationChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.p001ViolationChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.p001ViolationChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * p001(토크 범위 경고) violation chart Y축 그리드 색상 가져오기
     */
    get p001ViolationChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.p001ViolationChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.p001ViolationChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * p001(토크 범위 경고) violation chart 레전드 색상 가져오기
     */
    get p001ViolationChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.p001ViolationChartItem.dark.legend.fontColor;
        } else {
            return this.p001ViolationChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     * p001(토크 범위 경고) violation chart 데이터 포인트 색상 가져오기
     * torqueData, maxConfigData, minConfigData, violation
     */
    get p001ViolationChartDataPointsColors() {
        if(this._theme === `dark`) {
            return this.p001ViolationChartItem.dark.dataPoints.color;
        } else {
            return this.p001ViolationChartItem.light.dataPoints.color;
        }
    }

    /**
     * 
     * p002(온도 제한 경고) 차트 아이템
     */
    p002ViolationChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: `#ffffff`,
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
            indexLabel: {
                fontColor: `#ffffff`
            },
            legend: {
                fontColor: `#ffffff`
            },
            dataPoints: {
                color: {
                    tmpData: `#13d6e6`,
                    tmpConfigData: `#f8ba03`
                }
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`,
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
            indexLabel: {
                fontColor: `#60676f`
            },
            legend: {
                fontColor: `#60676f`
            },
            dataPoints: {
                color: {
                    tmpData: `#3297ff`,
                    tmpConfigData: `#ffa422`
                }
            }
        }
    }

    /**
     * 
     * p002(온도 제한 경고) violation chart 배경 색상 가져오기
     */
    get p002ViolationChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.p002ViolationChartItem.dark.default.backgroundColor;
        } else {
            return this.p002ViolationChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * p002(온도 제한 경고) violation chart 기본 문구 색상 가져오기
     */
    get p002ViolationChartFontColor() {
        if(this._theme === `dark`) {
            return this.p002ViolationChartItem.dark.default.fontColor;
        } else {
            return this.p002ViolationChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * p002(온도 제한 경고) violation chart 축 라벨 색상 가져오기
     */
    get p002ViolationChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.p002ViolationChartItem.dark.axis.labelFontColor;
        } else {
            return this.p002ViolationChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * p002(온도 제한 경고) violation chart X축 라인 색상 가져오기
     */
    get p002ViolationChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.p002ViolationChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.p002ViolationChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * p002(온도 제한 경고) violation chart Y축 그리드 색상 가져오기
     */
    get p002ViolationChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.p002ViolationChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.p002ViolationChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * p002(온도 제한 경고) violation chart 인덱스 라벨 색상 가져오기
     */
    get p002ViolationChartIndexLabelFontColor() {
        if(this._theme === `dark`) {
            return this.p002ViolationChartItem.dark.indexLabel.fontColor;
        } else {
            return this.p002ViolationChartItem.light.indexLabel.fontColor;
        }
    }

    /**
     * 
     * p002(온도 제한 경고) violation chart 레전드 색상 가져오기
     */
    get p002ViolationChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.p002ViolationChartItem.dark.legend.fontColor;
        } else {
            return this.p002ViolationChartItem.light.legend.fontColor;
        }
    }
    /**
     * 
     * p002(온도 제한 경고) violation chart 데이터 포인트 색상 가져오기
     * tmpData, tmpConfigData
     */
    get p002ViolationChartDataPointsColors() {
        if(this._theme === `dark`) {
            return this.p002ViolationChartItem.dark.dataPoints.color;
        } else {
            return this.p002ViolationChartItem.light.dataPoints.color;
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) 차트 아이템
     */
    p003ViolationChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: `#ffffff`,
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
            indexLabel: {
                fontColor: `#ffffff`
            },
            legend: {
                fontColor: `#ffffff`
            },
            dataPoints: {
                color: {
                    sumData: `#0bb881`,
                    addData: `#ff4e00`,
                }
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`,
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
            indexLabel: {
                fontColor: `#60676f`
            },
            legend: {
                fontColor: `#60676f`
            },
            dataPoints: {
                color: {
                    sumData: `#3297ff`,
                    addData: `#ffa422`,
                }
            }
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) violation chart 배경 색상 가져오기
     */
    get p003ViolationChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.p003ViolationChartItem.dark.default.backgroundColor;
        } else {
            return this.p003ViolationChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) violation chart 기본 문구 색상 출력
     */
    get p003ViolationChartFontColor() {
        if(this._theme === `dark`) {
            return this.p003ViolationChartItem.dark.default.fontColor;
        } else {
            return this.p003ViolationChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) violation chart 축 라벨 색상 가져오기
     */
    get p003ViolationChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.p003ViolationChartItem.dark.axis.labelFontColor;
        } else {
            return this.p003ViolationChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) violation chart X축 라인 색상 가져오기
     */
    get p003ViolationChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.p003ViolationChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.p003ViolationChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) violation chart Y축 그리드 색상 가져오기
     */
    get p003ViolationChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.p003ViolationChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.p003ViolationChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) violation chart 인덱스 라벨 색상 가져오기
     */
    get p003ViolationChartIndexLabelFontColor() {
        if(this._theme === `dark`) {
            return this.p003ViolationChartItem.dark.indexLabel.fontColor;
        } else {
            return this.p003ViolationChartItem.light.indexLabel.fontColor;
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) violation chart 레전드 색상 가져오기
     */
    get p003ViolationChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.p003ViolationChartItem.dark.legend.fontColor;
        } else {
            return this.p003ViolationChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     * p003(토크 주간 평균 경고) violation chart 데이터 포인트 색상 가져오기
     * sumData, addData
     */
    get p003ViolationChartDataPointsColors() {
        if(this._theme === `dark`) {
            return this.p003ViolationChartItem.dark.dataPoints.color;
        } else {
            return this.p003ViolationChartItem.light.dataPoints.color;
        }
    }

    /**
     * 
     * p005(토크 작업 적산 경고) 차트 아이템
     */
    p005ViolationChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: `#ffffff`,
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
            indexLabel: {
                fontColor: `#ffffff`
            },
            legend: {
                fontColor: `#ffffff`
            },
            dataPoints: {
                color: {
                    accumData: `#0bb881`,
                    configData: `#ff4e00`,
                    violation: `#ff4e00`
                }
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`,
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
            indexLabel: {
                fontColor: `#60676f`
            },
            legend: {
                fontColor: `#60676f`
            },
            dataPoints: {
                color: {
                    accumData: `#3297ff`,
                    configData: `#ffa422`,
                    violation: `#ff5d40`
                }
            }
        }
    }

    /**
     * 
     * p005(토크 작업 적산 경고) violation chart 배경 색상 가져오기
     */
    get p005ViolationChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.p005ViolationChartItem.dark.default.backgroundColor;
        } else {
            return this.p005ViolationChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * p005(토크 작업 적산 경고) violation chart 기본 문구 색상 가져오기
     */
    get p005ViolationChartFontColor() {
        if(this._theme === `dark`) {
            return this.p005ViolationChartItem.dark.default.fontColor;
        } else {
            return this.p005ViolationChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * p005(토크 작업 적산 경고) violation chart 축 라벨 색상 가져오기
     */
    get p005ViolationChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.p005ViolationChartItem.dark.axis.labelFontColor;
        } else {
            return this.p005ViolationChartItem.light.axis.labelFontColor;
        }
    }
    
    /**
     * 
     * p005(토크 작업 적산 경고) violation chart X축 라인 색상 가져오기
     */
    get p005ViolationChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.p005ViolationChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.p005ViolationChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * p005(토크 작업 적산 경고) violation chart Y축 그리드 색상 가져오기
     */
    get p005ViolationChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.p005ViolationChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.p005ViolationChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * p005(토크 작업 적산 경고) violation chart 인덱스 라벨 색상 가져오기
     */
    get p005ViolationChartIndexLabelFontColor() {
        if(this._theme === `dark`) {
            return this.p005ViolationChartItem.dark.indexLabel.fontColor;
        } else {
            return this.p005ViolationChartItem.light.indexLabel.fontColor;
        }
    }

    /**
     * 
     * p005(토크 작업 적산 경고) violation chart 레전드 색상 가져오기
     */
    get p005ViolationChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.p005ViolationChartItem.dark.legend.fontColor;
        } else {
            return this.p005ViolationChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     * p005(토크 작업 적산 경고) violation chart 데이터 포인트 색상 가져오기
     * accumData, configData, violation
     */
    get p005ViolationChartDataPointsColors() {
        if(this._theme === `dark`) {
            return this.p005ViolationChartItem.dark.dataPoints.color;
        } else {
            return this.p005ViolationChartItem.light.dataPoints.color;
        }
    }
    predictStatusTableItem = {
        dark: {
            cardTitleColor: `#171a29`,
            tableBackgroundColor: `#21263a`,
            tableBorderBottomColor: `#21263a`,
            tableOddBackgroundColor: `#2a2f44`,
            tableOddBorderBottomColor: `#2a2f44`,
            tableEvenBackgroundColor: `#21263a`,
            tableEvenBorderBottomColor: `#21263a`,
            tableHoverBackgroundColor: `#393B58`,
            paginationBackgroundColor: `#2c3146`,
            selectHighLightColor: `#3c5d99`,
            selectOddBackgroundColor: `#2a2f44`,
            selectEvenBackgroundColor: `#21263a`,
            paginationFontColor: `#ffffff`
        },
        light: {
            cardTitleColor: `#3b4957`,
            tableBackgroundColor: `#ffffff`,
            tableBorderBottomColor: `#cdd6df`,
            tableOddBackgroundColor: `#ffffff`,
            tableOddBorderBottomColor: `#cdd6df`,
            tableEvenBackgroundColor: `#ecf2f9`,
            tableEvenBorderBottomColor: `#cdd6df`,
            tableHoverBackgroundColor: `#4265ed`,
            paginationBackgroundColor: `#cfdae7`,
            selectHighLightColor: `#83a7cd`,
            selectOddBackgroundColor: `#ffffff`,
            selectEvenBackgroundColor: `#ecf2f9`,
            paginationFontColor: `#4d4d5f`
        }
    }
    get predictStatusTableItemCardTitleColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.cardTitleColor;
        } else {
            return this.predictStatusTableItem.light.cardTitleColor;
        }
    }
    get predictStatusTableItemTableBackgroundColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.tableBackgroundColor;
        } else {
            return this.predictStatusTableItem.light.tableBackgroundColor;
        }
    }
    get predictStatusTableItemTableBorderBottomColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.tableBorderBottomColor;
        } else {
            return this.predictStatusTableItem.light.tableBorderBottomColor;
        }
    }
    get predictStatusTableItemTableOddBackgroundColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.tableOddBackgroundColor;
        } else {
            return this.predictStatusTableItem.light.tableOddBackgroundColor;
        }
    }
    get predictStatusTableItemTableOddBorderBottomColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.tableOddBorderBottomColor;
        } else {
            return this.predictStatusTableItem.light.tableOddBorderBottomColor;
        }
    }
    get predictStatusTableItemTableEvenBackgroundColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.tableEvenBackgroundColor;
        } else {
            return this.predictStatusTableItem.light.tableEvenBackgroundColor;
        }
    }
    get predictStatusTableItemTableEvenBorderBottomColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.tableEvenBorderBottomColor;
        } else {
            return this.predictStatusTableItem.light.tableEvenBorderBottomColor;
        }
    }
    get predictStatusTableItemTableHoverBackgroundColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.tableHoverBackgroundColor;
        } else {
            return this.predictStatusTableItem.light.tableHoverBackgroundColor;
        }
    }
    get predictStatusTableItemPaginationBackgroundColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.paginationBackgroundColor;
        } else {
            return this.predictStatusTableItem.light.paginationBackgroundColor;
        }
    }
    get predictStatusTableItemSelectHighLightColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.selectHighLightColor;
        } else {
            return this.predictStatusTableItem.light.selectHighLightColor;
        }
    }
    get predictStatusTableItemSelectOddBackgroundColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.selectOddBackgroundColor;
        } else {
            return this.predictStatusTableItem.light.selectOddBackgroundColor;
        }
    }
    get predictStatusTableItemSelectEvenBackgroundColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.selectEvenBackgroundColor;
        } else {
            return this.predictStatusTableItem.light.selectEvenBackgroundColor;
        }
    }
    get predictStatusTableItemPaginationFontColor() {
        if (this._theme === `dark`) {
            return this.predictStatusTableItem.dark.paginationFontColor;
        } else {
            return this.predictStatusTableItem.light.paginationFontColor;
        }
    }
    predictCodeItem = {
        dark: {
            p001Color: `#5F00FF`,
            p002Color: `#aae472`,
            p003Color: `#00D8FF`,
            p004Color: `#246faf`,
            p005Color: `#FF5E00`,
            totalColor: `#0ca889`,
        },
        light: {
            p001Color: `#6a9439`,
            p002Color: `#60adee`,
            p003Color: `#cfa448`,
            p004Color: `#6c85bd`,
            p005Color: `#9eacc4`,
            totalColor: `#2c63c8`,

        }
    }
    get p001Color() {
        if (this._theme === `dark`) {
            return this.predictCodeItem.dark.p001Color;
        } else {
            return this.predictCodeItem.light.p001Color;
        }
    }
    get p002Color() {
        if (this._theme === `dark`) {
            return this.predictCodeItem.dark.p002Color;
        } else {
            return this.predictCodeItem.light.p002Color;
        }
    }
    get p003Color() {
        if (this._theme === `dark`) {
            return this.predictCodeItem.dark.p003Color;
        } else {
            return this.predictCodeItem.light.p003Color;
        }
    }
    get p004Color() {
        if (this._theme === `dark`) {
            return this.predictCodeItem.dark.p004Color;
        } else {
            return this.predictCodeItem.light.p004Color;
        }
    }
    get p005Color() {
        if (this._theme === `dark`) {
            return this.predictCodeItem.dark.p005Color;
        } else {
            return this.predictCodeItem.light.p005Color;
        }
    }
    get pTotalColor() {
        if (this._theme === `dark`) {
            return this.predictCodeItem.dark.totalColor;
        } else {
            return this.predictCodeItem.light.totalColor;
        }
    }
    processInfoTableItem = {
        dark: {
            cardTitleBackgroundColor: `#171a29`,
            theadBackgroundColor: `#21263a`,
            oddBackgroundColor: `#2a2f44`,
            evenBackgroundColor: `#21263a`,
            paginationBackgroundColor: `#2c3146`,
            rowHighLightBackgroundColor: `#3c5d99`,
        },
        light: {
            cardTitleBackgroundColor: `#f6f9fc`,
            theadBackgroundColor: `#ffffff`,
            oddBackgroundColor: `#ffffff`,
            evenBackgroundColor: `#ecf2f9`,
            paginationBackgroundColor: `#ffffff`,
            rowHighLightBackgroundColor: `#ffffff`,
        }
    }
    get processInfoTableItemCardTitleBackgroundColor() {
        if (this._theme === `dark`) {
            return this.processInfoTableItem.dark.cardTitleBackgroundColor;
        } else {
            return this.processInfoTableItem.light.cardTitleBackgroundColor;
        }
    }
    get processInfoTableItemTheadBackgroundColor() {
        if (this._theme === `dark`) {
            return this.processInfoTableItem.dark.theadBackgroundColor;
        } else {
            return this.processInfoTableItem.light.theadBackgroundColor;
        }
    }
    get processInfoTableItemOddBackgroundColor() {
        if (this._theme === `dark`) {
            return this.processInfoTableItem.dark.oddBackgroundColor;
        } else {
            return this.processInfoTableItem.light.oddBackgroundColor;
        }
    }
    get processInfoTableItemEvenBackgroundColor() {
        if (this._theme === `dark`) {
            return this.processInfoTableItem.dark.evenBackgroundColor;
        } else {
            return this.processInfoTableItem.light.evenBackgroundColor;
        }
    }
    get processInfoTableItemPaginationBackgroundColor() {
        if (this._theme === `dark`) {
            return this.processInfoTableItem.dark.paginationBackgroundColor;
        } else {
            return this.processInfoTableItem.light.paginationBackgroundColor;
        }
    }
    get processInfoTableItemRowHighLightBackgroundColor() {
        if (this._theme === `dark`) {
            return this.processInfoTableItem.dark.rowHighLightBackgroundColor;
        } else {
            return this.processInfoTableItem.light.rowHighLightBackgroundColor;
        }
    }

    chartOptionsItem = {
        dark: {
            yAxesGridLinesColor: `#4f5575`,
            yAxesGridLinesZeroLineColor: `#4f5575`,
            yAxesTicksFontColor: `#bdc2dc`,
            xAxesGridLinesColor: `#4f5575`,
            xAxesTicksFontColor: `#bdc2dc`,
            labelsFontColor: `#ffffff`,
        },
        light: {
            yAxesGridLinesColor: `#b6b9c3`,
            yAxesGridLinesZeroLineColor: `#b6b9c3`,
            yAxesTicksFontColor: `#7f859c`,
            xAxesGridLinesColor: `#b6b9c3`,
            xAxesTicksFontColor: `#7f859c`,
            labelsFontColor: `#7f859c`,

        }
    }
    get yAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.chartOptionsItem.dark.yAxesGridLinesColor;
        } else {
            return this.chartOptionsItem.light.yAxesGridLinesColor;
        }
    }
    get yAxesGridLinesZeroLineColor() {
        if (this._theme === `dark`) {
            return this.chartOptionsItem.dark.yAxesGridLinesZeroLineColor;
        } else {
            return this.chartOptionsItem.light.yAxesGridLinesZeroLineColor;
        }
    }
    get yAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.chartOptionsItem.dark.yAxesTicksFontColor;
        } else {
            return this.chartOptionsItem.light.yAxesTicksFontColor;
        }
    }
    get xAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.chartOptionsItem.dark.xAxesGridLinesColor;
        } else {
            return this.chartOptionsItem.light.xAxesGridLinesColor;
        }
    }
    get xAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.chartOptionsItem.dark.xAxesTicksFontColor;
        } else {
            return this.chartOptionsItem.light.xAxesTicksFontColor;
        }
    }
    get labelsFontColor() {
        if (this._theme === `dark`) {
            return this.chartOptionsItem.dark.labelsFontColor;
        } else {
            return this.chartOptionsItem.light.labelsFontColor;
        }
    }
    tableItem = {
        dark: {
            cardColor: `#21263a`,
            paginationColor: `#005bac !important`,
        },
        light: {
            cardColor: `#ffffff`,
            paginationColor: `#ffffff !important`,
        }
    }
    get cardColor() {
        if (this._theme === `dark`) {
            return this.tableItem.dark.cardColor;
        } else {
            return this.tableItem.light.cardColor;
        }
    }
    get paginationColor() {
        if (this._theme === `dark`) {
            return this.tableItem.dark.paginationColor;
        } else {
            return this.tableItem.light.paginationColor;
        }
    }
    loadFactorChartOptionsItem = {
        dark: {
            yAxesGridLinesColor: `#4f5575`,
            yAxesGridLinesZeroLineColor: `#4f5575`,
            yAxesTicksFontColor: `#bdc2dc`,
            xAxesScaleLabelFontColor: `#ffffff`,
            xAxesTicksFFontColor: `#bdc2dc`,
            xAxesTicksSFontColor: `#bdc2dc`,
        },
        light: {
            yAxesGridLinesColor: `#b6b9c3`,
            yAxesGridLinesZeroLineColor: `#b6b9c3`,
            yAxesTicksFontColor: `#7f859c`,
            xAxesScaleLabelFontColor: `#7f859c`,
            xAxesTicksFFontColor: `#7f859c`,
            xAxesTicksSFontColor: `#7f859c`,
        }
    }
    get loadFactorYAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.loadFactorChartOptionsItem.dark.yAxesGridLinesColor;
        } else {
            return this.loadFactorChartOptionsItem.light.yAxesGridLinesColor;
        }
    }
    get ladFactorYAxesGridLinesZeroLineColor() {
        if (this._theme === `dark`) {
            return this.loadFactorChartOptionsItem.dark.yAxesGridLinesZeroLineColor;
        } else {
            return this.loadFactorChartOptionsItem.light.yAxesGridLinesZeroLineColor;
        }
    }
    get loadFactorYAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.loadFactorChartOptionsItem.dark.yAxesTicksFontColor;
        } else {
            return this.loadFactorChartOptionsItem.light.yAxesTicksFontColor;
        }
    }
    get loadFactorXAxesScaleLabelFontColor() {
        if (this._theme === `dark`) {
            return this.loadFactorChartOptionsItem.dark.xAxesScaleLabelFontColor;
        } else {
            return this.loadFactorChartOptionsItem.light.xAxesScaleLabelFontColor;
        }
    }
    get loadFactorXAxesTicksFFontColor() {
        if (this._theme === `dark`) {
            return this.loadFactorChartOptionsItem.dark.xAxesTicksFFontColor;
        } else {
            return this.loadFactorChartOptionsItem.light.xAxesTicksFFontColor;
        }
    }
    get loadFactorXAxesTicksSFontColor() {
        if (this._theme === `dark`) {
            return this.loadFactorChartOptionsItem.dark.xAxesTicksSFontColor;
        } else {
            return this.loadFactorChartOptionsItem.light.xAxesTicksSFontColor;
        }
    }

    // torque data

    torqueDataItem = {
        dark: {
            subTitleColor: "#00b881",
            searchButtonColor: "#237ffe",
            axisButton: {
                color: "#ffffff",
                borderColor: "#393e55",
                activeColor: "#00b881",
                activeBorderColor: "#0ca889",
                activeBackgroundColor: "#171A29"
            }
        },
        light: {
            subTitleColor: "#6e7e90",
            searchButtonColor: "#3086ff",
            axisButton: {
                color: "#3086ff",
                borderColor: "#3086ff",
                activeColor: "#ffffff",
                activeBorderColor: "#3086ff",
                activeBackgroundColor: "#3086ff"
            }
        }
    }

    get torqueDataItemSubTitleColor() {
        if(this._theme === `dark`) {
            return this.torqueDataItem.dark.subTitleColor;
        } else {
            return this.torqueDataItem.light.subTitleColor;
        }
    }

    get torqueDataItemSearchButtonColor() {
        if(this._theme === `dark`) {
            return this.torqueDataItem.dark.searchButtonColor;
        } else {
            return this.torqueDataItem.light.searchButtonColor;
        }
    }

    get torqueDataItemAxisButtonColor() {
        if(this._theme === `dark`) {
            return this.torqueDataItem.dark.axisButton.color;
        } else {
            return this.torqueDataItem.light.axisButton.color;
        }
    }

    get torqueDataItemAxisButtonBorderColor() {
        if(this._theme === `dark`) {
            return this.torqueDataItem.dark.axisButton.borderColor;
        } else {
            return this.torqueDataItem.light.axisButton.borderColor;
        }
    }

    get torqueDataItemAxisButtonActiveColor() {
        if(this._theme === `dark`) {
            return this.torqueDataItem.dark.axisButton.activeColor;
        } else {
            return this.torqueDataItem.light.axisButton.activeColor;
        }
    }

    get torqueDataItemAxisButtonActiveBorderColor() {
        if(this._theme === `dark`) {
            return this.torqueDataItem.dark.axisButton.activeBorderColor;
        } else {
            return this.torqueDataItem.light.axisButton.activeBorderColor;
        }
    }

    get torqueDataItemAxisButtonActiveBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueDataItem.dark.axisButton.activeBackgroundColor;
        } else {
            return this.torqueDataItem.light.axisButton.activeBackgroundColor;
        }
    }

    settingInfoTableItem = {
        dark: {
            tableNameBackgroundColor: `#21263a`,
            tableValueBackgroundColor: `#2a2f44`,
        },
        light: {
            tableNameBackgroundColor: `#ecf2f9`,
            tableValueBackgroundColor: `#ffffff`,
        }
    }

    get settingInfoTableItemTableNameBackgroundColor() {
        if (this._theme === `dark`) {
            return this.settingInfoTableItem.dark.tableNameBackgroundColor;
        } else {
            return this.settingInfoTableItem.light.tableNameBackgroundColor;
        }
    }
    get settingInfoTableItemTableValueBackgroundColor() {
        if (this._theme === `dark`) {
            return this.settingInfoTableItem.dark.tableValueBackgroundColor;
        } else {
            return this.settingInfoTableItem.light.tableValueBackgroundColor;
        }
    }

    torqueDataChartItem = {
        dark: {
            default: {
                backgroundColor: "#171a29",
                fontColor: "#ffffff",
            },
            toolTip: {
                fontColor: "#00b881"
            },
            axis: {
                labelFontColor: "#ffffff",
                axisX: {
                    lineColor: "#575f7d",
                },
                axisY: {
                    gridColor: "#575f7d"
                },
            },
            legend: {
                fontColor: "#ffffff"
            },
            dataPoints: {
                color: "#00b881"
            }
        },
        light: {
            default: {
                backgroundColor: "#ffffff",
                fontColor: "#60676f",
            },
            toolTip: {
                fontColor: "#60676f"
            },
            axis: {
                labelFontColor: "#60676f",
                axisX: {
                    lineColor: "#b6b9c3",
                },
                axisY: {
                    gridColor: "#b6b9c3"
                },
            },
            legend: {
                fontColor: "#60676f"
            },
            dataPoints: {
                color: "#3297ff"
            }
        }
    }

    /**
     * 
     * 토크 부하율 차트 배경 색상 가져오기
     */
    get torqueDataChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueDataChartItem.dark.default.backgroundColor;
        } else {
            return this.torqueDataChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * 토크 부하율 차트 기본 문구 폰트 색상 가져오기
     */
    get torqueDataChartFontColor() {
        if(this._theme === `dark`) {
            return this.torqueDataChartItem.dark.default.fontColor;
        } else {
            return this.torqueDataChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * 토크 부하율 차트 툴팁 폰트 색상 가져오기
     */
    get torqueDataChartTooltipFontColor() {
        if(this._theme === `dark`) {
            return this.torqueDataChartItem.dark.toolTip.fontColor;
        } else {
            return this.torqueDataChartItem.light.toolTip.fontColor;
        }        
    }

    /**
     * 
     * 토크 부하율 차트 축 라벨 색상 가져오기
     */
    get torqueDataChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.torqueDataChartItem.dark.axis.labelFontColor;
        } else {
            return this.torqueDataChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * 토크 부하율 차트 X 축 라인 색상 가져오기
     */
    get torqueDataChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.torqueDataChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.torqueDataChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * 토크 부하율 차트 Y 축 그리드 색상 가져오기
     */
    get torqueDataChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.torqueDataChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.torqueDataChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * 토크 부하율 차트 레전드 색상 가져오기
     */
    get torqueDataChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.torqueDataChartItem.dark.legend.fontColor;
        } else {
            return this.torqueDataChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     * 토크 부하율 차트 데이터 색상(출력 색상) 가져오기
     */
    get torqueDataChartDataPointsColor() {
        if(this._theme === `dark`) {
            return this.torqueDataChartItem.dark.dataPoints.color; 
        } else {
            return this.torqueDataChartItem.light.dataPoints.color;
        }
    }

    // torque range
    torqueRangeItem = {
        dark: {
            cardColor: "#21263a",
            subTitleColor: "#00b881",
            infoTextColor: "#ffffff",
            violationOffSetTextColor: "#ffffff",
            button: {
                color: "#ffffff",
                backgroundColor: "#237ffe",
                applyButtonBackgroundColor: "#237ffe",
                saveButtonBackgroundColor: "#0ca889"
            },
            axisButton: {
                color: "#ffffff",
                borderColor: "#393e55",
                activeColor: "#00b881",
                activeBorderColor: "#0ca889",
                activeBackgroundColor: "#171A29"
            }
        },
        light: {
            cardColor: "#adc2d7",
            subTitleColor: "#6e7e90",
            infoTextColor: "#2e3140",
            violationOffSetTextColor: "#67728c",
            button: {
                color: "#ffffff",
                backgroundColor: "#3086ff",
                applyButtonBackgroundColor: "#3086ff",
                saveButtonBackgroundColor: "#3086ff"
            },
            axisButton: {
                color: "#3086ff",
                borderColor: "#3086ff",
                activeColor: "#ffffff",
                activeBorderColor: "#3086ff",
                activeBackgroundColor: "#3086ff"
            }
        }
    }

    get torqueRangeCardColor() {
        if (this._theme === `dark`) {
            return this.torqueRangeItem.dark.cardColor;
        } else {
            return this.torqueRangeItem.light.cardColor;
        }
    }

    get torqueRangeItemSubTitleColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.subTitleColor;
        } else {
            return this.torqueRangeItem.light.subTitleColor;
        }
    }

    get torqueRangeItemInfoTextColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.infoTextColor;
        } else {
            return this.torqueRangeItem.light.infoTextColor;
        }
    }

    get torqueRangeItemViolationOffSetTextColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.violationOffSetTextColor;
        } else {
            return this.torqueRangeItem.light.violationOffSetTextColor;
        }
    }

    get torqueRangeItemButtonColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.button.color;
        } else {
            return this.torqueRangeItem.light.button.color;
        }
    }

    get torqueRangeItemButtonBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.button.backgroundColor;
        } else {
            return this.torqueRangeItem.light.button.backgroundColor;
        }
    }

    get torqueRangeItemApplyButtonBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.button.applyButtonBackgroundColor;
        } else {
            return this.torqueRangeItem.light.button.applyButtonBackgroundColor;
        }
    }

    get torqueRangeItemSaveButtonBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.button.saveButtonBackgroundColor;
        } else {
            return this.torqueRangeItem.light.button.saveButtonBackgroundColor;
        }
    }

    get torqueRangeItemAxisButtonColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.axisButton.color;
        } else {
            return this.torqueRangeItem.light.axisButton.color;
        }
    }

    get torqueRangeItemAxisButtonBorderColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.axisButton.borderColor;
        } else {
            return this.torqueRangeItem.light.axisButton.borderColor;
        }
    }

    get torqueRangeItemAxisButtonActiveColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.axisButton.activeColor;
        } else {
            return this.torqueRangeItem.light.axisButton.activeColor;
        }
    }

    get torqueRangeItemAxisButtonActiveBorderColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.axisButton.activeBorderColor;
        } else {
            return this.torqueRangeItem.light.axisButton.activeBorderColor;
        }
    }

    get torqueRangeItemAxisButtonActiveBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeItem.dark.axisButton.activeBackgroundColor;
        } else {
            return this.torqueRangeItem.light.axisButton.activeBackgroundColor;
        }
    }

    torqueRangeChartItem = {
        dark: {
            default: {
                backgroundColor: "#171a29",
                fontColor: "#ffffff",
            },
            axis: {
                labelFontColor: "#ffffff",
                axisX: {
                    lineColor: "#575f7d"
                },
                axisY: {
                    gridColor: "#575f7d"
                },
            },
            legend: {
                fontColor: "#ffffff"
            },
            dataPoints: {
                color: {
                    maxTorqueData: "#00b881",
                    minTorqueData: "#00b881",
                    maxConfigData: "#ff4e00",
                    minConfigData: "#ff8000",
                    violation: "#ff4e00"
                }
               
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
                    lineColor: "#b6b9c3"
                },
                axisY: {
                    gridColor: "#b6b9c3"
                },
            },
            legend: {
                fontColor: "#60676f"
            },
            dataPoints: {
                color: {
                    maxTorqueData: "#3297ff",
                    minTorqueData: "#3297ff",
                    maxConfigData: "#ffa422",
                    minConfigData: "#ffa422",
                    violation: "#ff5d40"
                }
               
            }
        }
    }
    
    /**
     * 
     * 토크 부하율 범위 차트 배경 색상 가져오기
     */
    get torqueRangeChartBackgroundColor() {
        if (this._theme === `dark`) {
            return this.torqueRangeChartItem.dark.default.backgroundColor;
        } else {
            return this.torqueRangeChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * 토크 부하율 범위 차트 기본 문구 색상 가져오기
     */
    get torqueRangeChartFontColor() {
        if (this._theme === `dark`) {
            return this.torqueRangeChartItem.dark.default.fontColor;
        } else {
            return this.torqueRangeChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     *  토크 부하율 범위 차트 축 라벨 색상 가져오기
     */
    get torqueRangeChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeChartItem.dark.axis.labelFontColor;
        } else {
            return this.torqueRangeChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     *  토크 부하율 범위 차트 X 축 라인 색상 가져오기
     */
    get torqueRangeChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.torqueRangeChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     *  토크 부하율 범위 차트 Y 축 그리드 색상 가져오기
     */
    get torqueRangeChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.torqueRangeChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     *  토크 부하율 범위 차트 레전드 색상 가져오기
     */
    get torqueRangeChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeChartItem.dark.legend.fontColor;
        } else {
            return this.torqueRangeChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     *  토크 부하율 범위 차트 데이터 포인트 색상 가져오기
     *  여러 색상 값은 vue 파일에서 정의한 값과 동일한 이름으로 사용할 수 있다.
     */
    get torqueRangeChartDataPointsColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeChartItem.dark.dataPoints.color;
        } else {
            return this.torqueRangeChartItem.light.dataPoints.color;
        }
    }


    torqueRangeTableItem = {
        dark: {
          tableBorderColor: "#131622",
          backgroundColor: "#21263a",
          hoverBackgroundColor: "#2a2f44",
          rowBorderBottomColor: "#21263a",
          headerColBorderBottomColor: "#626262",
          headerColBorderRightColor: "#626262",
          headerColtextColor: "#cdced2",
          textColor: "white"
        },
        light: {
            tableBorderColor: "#bcc2d0",
            backgroundColor: "#d2d7e5",
            hoverBackgroundColor: "#adbdd7",
            rowBorderBottomColor: "#d2d7e5",
            headerColBorderBottomColor: "#a6afc6",
            headerColBorderRightColor: "#a6afc6",
            headerColtextColor: "#6e6e89",
            textColor: "#353544"
        }
    }

    get torqueRangeTableItemTableBorderColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeTableItem.dark.tableBorderColor;
        } else {
            return this.torqueRangeTableItem.light.tableBorderColor;
        }
    }
    get torqueRangeTableItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeTableItem.dark.backgroundColor;
        } else {
            return this.torqueRangeTableItem.light.backgroundColor;
        }
    }

    get torqueRangeTableItemHoverBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeTableItem.dark.hoverBackgroundColor;
        } else {
            return this.torqueRangeTableItem.light.hoverBackgroundColor;
        }
    }

    get torqueRangeTableItemRowBorderBottomColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeTableItem.dark.rowBorderBottomColor;
        } else {
            return this.torqueRangeTableItem.light.rowBorderBottomColor;
        }
    }

    get torqueRangeTableItemHeaderColBorderBottomColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeTableItem.dark.headerColBorderBottomColor;
        } else {
            return this.torqueRangeTableItem.light.headerColBorderBottomColor;
        }
    }

    get torqueRangeTableitemHeaderColBorderRightColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeTableItem.dark.headerColBorderRightColor;
        } else {
            return this.torqueRangeTableItem.light.headerColBorderRightColor;
        }
    }

    get torqueRangeTableHeaderColTextColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeTableItem.dark.headerColtextColor;
        } else {
            return this.torqueRangeTableItem.light.headerColtextColor;
        }
    }

    get torqueRangeTableTextColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeTableItem.dark.textColor;
        } else {
            return this.torqueRangeTableItem.light.textColor;
        }
    }

    torqueRangeDetailSetDlgItem = {
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

    get torqueRangeDetailSetDlgItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeDetailSetDlgItem.dark.backgrondColor;
        } else {
            return this.torqueRangeDetailSetDlgItem.light.backgrondColor;
        }
    }

    get torqueRangeDetailSetDlgItemColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeDetailSetDlgItem.dark.color;
        } else {
            return this.torqueRangeDetailSetDlgItem.light.color;
        }
    }

    get torqueRangeDetailSetDlgItemBorderColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeDetailSetDlgItem.dark.borderColor;
        } else {
            return this.torqueRangeDetailSetDlgItem.light.borderColor;
        }
    }

    get torqueRangeDetailSetDlgItemInputBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeDetailSetDlgItem.dark.inputBackgroundColor;
        } else {
            return this.torqueRangeDetailSetDlgItem.light.inputBackgroundColor;
        }
    }

    get torqueRangeDetailSetDlgItemInputBorderColor() {
        if(this._theme === `dark`) {
            return this.torqueRangeDetailSetDlgItem.dark.inputBorderColor;
        } else {
            return this.torqueRangeDetailSetDlgItem.light.inputBorderColor;
        }
    }


    // torque similarity
    torqueSimilarityChartOptionsItem = {
        dark: {
            yAxesGridLinesColor: `#4f5575`,
            yAxesGridLinesFontColor: `#4f5575`,
            yAxesTicksFontColor: `#bdc2dc`,
        },
        light: {
            yAxesGridLinesColor: `#b6b9c3`,
            yAxesGridLinesFontColor: `#60676f`,
            yAxesTicksFontColor: `#60676f`,
        }
    }
    get torqueSimilarityYAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.torqueSimilarityChartOptionsItem.dark.yAxesGridLinesColor;
        } else {
            return this.torqueSimilarityChartOptionsItem.light.yAxesGridLinesColor;
        }
    }
    get torqueSimilarityYAxesGridLinesFontColor() {
        if (this._theme === `dark`) {
            return this.torqueSimilarityChartOptionsItem.dark.yAxesGridLinesFontColor;
        } else {
            return this.torqueSimilarityChartOptionsItem.light.yAxesGridLinesFontColor;
        }
    }
    get torqueSimilarityYAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.torqueSimilarityChartOptionsItem.dark.yAxesTicksFontColor;
        } else {
            return this.torqueSimilarityChartOptionsItem.light.yAxesTicksFontColor;
        }
    }

    // torque loadfactor
    torqueLoadFactorItem = {
        dark: {
            button: {
                backgroundColor: "#237ffe",
                color: "#ffffff"
            }
        },
        light: {
            button: {
                backgroundColor: "#3086ff",
                color: "#ffffff"
            }
        }
    }

    get torqueLoadFactorItemButtonBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueLoadFactorItem.dark.button.backgroundColor;
        } else {
            return this.torqueLoadFactorItem.light.button.backgroundColor;
        }
    }

    get torqueLoadFactorItemButtonColor() {
        if(this._theme === `dark`) {
            return this.torqueLoadFactorItem.dark.button.color;
        } else {
            return this.torqueLoadFactorItem.light.button.color;
        }
    }

    workListTableItem = {
        dark: {
            warningStyle: `color: #00c6ff; fontWeight: bolder`,
        },
        light: {
            warningStyle: `color: #3086ff; fontWeight: bolder`,
        }
    }
    get workListTableItemWarningStyle() {
        if (this._theme === `dark`) {
            return this.workListTableItem.dark.warningStyle;
        } else {
            return this.workListTableItem.light.warningStyle;
        }
    }
    violationRecordTableItem = {
        dark: {
            setWarningValueColor: `#237ffe`,
            setAllWarningValueColor: `#237ffe`,
        },
        light: {
            setWarningValueColor: `#3086ff`,
            setAllWarningValueColor: `#3086ff`,
        }
    }
    torqueLoadFactorAbnormalStandardSettingTableItem = {
        dark: {
            dyGridColor: `border: solid 1px #2a2f44;`,
            btnColor: `#237ffe`,
            loadingProgressColor: `#ffffff`,
            cardColor: `#21263a`,
        },
        light: {
            dyGridColor: `border: solid 1px #b6b9c3;`,
            btnColor: `#3086ff`,
            loadingProgressColor: `#3086ff`,
            cardColor: `#ffffff`,
        }
    }
    get torqueLoadFactorDyGridColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorAbnormalStandardSettingTableItem.dark.dyGridColor;
        } else {
            return this.torqueLoadFactorAbnormalStandardSettingTableItem.light.dyGridColor;
        }
    }
    get torqueLoadFactorBtnColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorAbnormalStandardSettingTableItem.dark.btnColor;
        } else {
            return this.torqueLoadFactorAbnormalStandardSettingTableItem.light.btnColor;
        }
    }
    get torqueLoadFactorLoadingProgressColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorAbnormalStandardSettingTableItem.dark.loadingProgressColor;
        } else {
            return this.torqueLoadFactorAbnormalStandardSettingTableItem.light.loadingProgressColor;
        }
    }
    get torqueLoadFactorCardColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorAbnormalStandardSettingTableItem.dark.cardColor;
        } else {
            return this.torqueLoadFactorAbnormalStandardSettingTableItem.light.cardColor;
        }
    }

    torqueLoadFactorByAxisItem = {
        dark: {
            backgroundColor: `#171a29`
        },
        light: {
            backgroundColor: `#ffffff`
        }
    }

    get torqueLoadFactorByAxisItemBackgroundColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorByAxisItem.dark.backgroundColor;
        } else {
            return this.torqueLoadFactorByAxisItem.light.backgroundColor;
        }
    }

    torqueAccumChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: `#ffffff`,
            },
            title: {
                fontColor: `#ffffff`,
            },
            axis: {
                labelFontColor: `#ffffff`,
                axisX: {
                    lineColor: `#575f7d`,
                },
                axisY: {
                    gridColor: `#575f7d`
                },
            },
            legend: {
                fontColor: `#ffffff`
            },
            dataPoints: {
                color: {
                    torque: `#0ca889`,
                    maxConfig: `#ffe400`,
                    minConfig: `#ff7800`,
                    violate: `red`
                }
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`,
            },
            title: {
                fontColor: `#60676f`,
            },
            axis: {
                labelFontColor: `#60676f`,
                axisX: {
                    lineColor: `#b6b9c3`,
                },
                axisY: {
                    gridColor: `#b6b9c3`
                },
            },
            legend: {
                fontColor: `#60676f`
            },
            dataPoints: {
                color: {
                    torque: `#3297ff`,
                    maxConfig: `#0bb881`,
                    minConfig: `#ffa422`,
                    violate: `ff5d40`
                }
            }
        }
    }

    /**
     * 
     *  토크 부하율 적산 차트 배경 색상 가져오기
     */
    get torqueAccumChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.torqueAccumChartItem.dark.default.backgroundColor;
        } else {
            return this.torqueAccumChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     *  토크 부하율 적산 차트 기본 문구 색상 가져오기
     */

    get torqueAccumChartFontColor() {
        if(this._theme === `dark`) {
            return this.torqueAccumChartItem.dark.default.fontColor;
        } else {
            return this.torqueAccumChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     *  토크 부하율 적산 차트 타이틀 문구 색상 가져오기
     */
    get torqueAccumChartTitleFontColor() {
        if(this._theme === `dark`) {
            return this.torqueAccumChartItem.dark.title.fontColor;
        }
        else {
            return this.torqueAccumChartItem.light.title.fontColor;
        }
    }

    /**
     * 
     *  토크 부하율 적산 차트 축 라벨 색상 가져오기
     */

    get torqueAccumChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.torqueAccumChartItem.dark.axis.labelFontColor;
        }
        else {
            return this.torqueAccumChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     *  토크 부하율 적산 차트 X 축 라인 색상 가져오기
     */
    get torqueAccumChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.torqueAccumChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.torqueAccumChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     *  토크 부하율 적산 차트 Y 축 그리드 색상 가져오기
     */
    get torqueAccumChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.torqueAccumChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.torqueAccumChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     *  토크 부하율 적산 차트 레전드 색상 가져오기
     */
    get torqueAccumChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.torqueAccumChartItem.dark.legend.fontColor;
        } else {
            return this.torqueAccumChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     *  토크 부하율 적산 차트 데이터 포인트 색상 가져오기
     *  여러 색상 값은 vue 파일에서 정의한 값과 동일한 이름으로 사용할 수 있다.
     */
    get torqueAccumChartDataPointsColor() {
        if(this._theme === `dark`) {
            return this.torqueAccumChartItem.dark.dataPoints.color;
        } else {
            return this.torqueAccumChartItem.light.dataPoints.color;
        }
    }

    get torqueLoadFactorByAxisItemYAxesScaleLabelFontColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorByAxisItem.dark.yAxesScaleLabelFontColor;
        } else {
            return this.torqueLoadFactorByAxisItem.light.yAxesScaleLabelFontColor;
        }
    }
    get torqueLoadFactorByAxisItemYAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorByAxisItem.dark.yAxesGridLinesColor;
        } else {
            return this.torqueLoadFactorByAxisItem.light.yAxesGridLinesColor;
        }
    }
    get torqueLoadFactorByAxisItemYAxesGridLinesZeroLineColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorByAxisItem.dark.yAxesGridLinesZeroLineColor;
        } else {
            return this.torqueLoadFactorByAxisItem.light.yAxesGridLinesZeroLineColor;
        }
    }
    get torqueLoadFactorByAxisItemYAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorByAxisItem.dark.yAxesTicksFontColor;
        } else {
            return this.torqueLoadFactorByAxisItem.light.yAxesTicksFontColor;
        }
    }
    get torqueLoadFactorByAxisItemXAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorByAxisItem.dark.xAxesTicksFontColor;
        } else {
            return this.torqueLoadFactorByAxisItem.light.xAxesTicksFontColor;
        }
    }
    get torqueLoadFactorByAxisItemXAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.torqueLoadFactorByAxisItem.dark.xAxesGridLinesColor;
        } else {
            return this.torqueLoadFactorByAxisItem.light.xAxesGridLinesColor;
        }
    }
    outputTypesItem = {
        dark: {
            outputToggleBackgroundColor: `#171A29`,
            activeBackgroundColor: `#237ffe`,
            activeColor: `#ffffff`
        },
        light: {
            outputToggleBackgroundColor: `#f6fafd`,
            activeBackgroundColor: `#237ffe`,
            activeColor: `#ffffff`
        }
    }
    get outputTypesItemOutputToggleBackgroundColor() {
        if (this._theme === `dark`) {
            return this.outputTypesItem.dark.outputToggleBackgroundColor;
        } else {
            return this.outputTypesItem.light.outputToggleBackgroundColor;
        }
    }

    get outputTypeItemActiveBackgroundColor() {
        if(this._theme === `dark`) {
            return this.outputTypesItem.dark.activeBackgroundColor;
        } else {
            return this.outputTypesItem.light.activeBackgroundColor;
        }
    }

    get outputTypeItemActiveColor() {
        if(this._theme === `dark`) {
            return this.outputTypesItem.dark.activeColor;
        } else {
            return this.outputTypesItem.light.activeColor;
        }
    }

    abnormalStandardSettingTableItem = {
        dark: {
            dialogContentBackgroundColor: `#171A29`,
            allModifySortArrowColor: `#2a2f44`,
            color: `#ffffff`,
            frozenRowsColor: `#ffffff`,
            defaultBgColor: `#21263a`,
            frozenRowsBgColor: `#2a2f44`,
            selectionBgColor: `#393B58`,
            highlightBgColor: `#2a2f44`,
            underlayBackgroundColor: `#21263a`,
            frozenRowsBorderColor: `#2a2f44`,
            borderColor: `#2a2f44`,
            highlightBorderColor: '#ffffff',
            uncheckBgColor: '#ffffff',
            checkBgColor: 'rgb(255, 73, 72)',
            checkboxBorderColor: `#ffffff`,
            buttoncolor: `#000000`,
            buttonBgColor: `#A3A5AD`,
            headerSortArrowColor: `#000000`,
            cardBackgroundColor: `#393e55`,
            inputBackgroundColor: `#171a29`,
            inputColor: `#ffffff`,
            inputBorderColor: `#4e546c`
        },
        light: {
            dialogContentBackgroundColor: `#ffffff`,
            allModifySortArrowColor: `#b6b9c3`,
            color: `#000000`,
            frozenRowsColor: `#000000`,
            defaultBgColor: `#ffffff`,
            frozenRowsBgColor: `#b6b9c3`,
            selectionBgColor: `#83a7cd`,
            highlightBgColor: `#ecf2f9`,
            underlayBackgroundColor: `#ffffff`,
            frozenRowsBorderColor: `#ecf2f9`,
            borderColor: `#b6b9c3`,
            highlightBorderColor: '#237ffe',
            uncheckBgColor: '#b6b9c3',
            checkBgColor: 'rgb(255, 73, 72)',
            checkboxBorderColor: `#b6b9c3`,
            buttoncolor: `#000000`,
            buttonBgColor: `#A3A5AD`,
            headerSortArrowColor: `#000000`,
            cardBackgroundColor: `#d2d7e5`,
            inputBackgroundColor: `#f6f9fc`,
            inputColor: `#111111`,
            inputBorderColor: `#9099b0`
        }
    }
    get abnormalStandardSettingTableItemDialogContentBackgroundColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.dialogContentBackgroundColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.dialogContentBackgroundColor;
        }
    }
    get abnormalStandardSettingTableItemAllModifySortArrowColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.allModifySortArrowColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.allModifySortArrowColor;
        }
    }

    get abnormalStandardSettingTableItemColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.color;
        } else {
            return this.abnormalStandardSettingTableItem.light.color;
        }
    }
    
    get abnormalStandardSettingTableItemFrozenRowsColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.frozenRowsColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.frozenRowsColor;
        }
    }
    
    get abnormalStandardSettingTableItemDefaultBgColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.defaultBgColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.defaultBgColor;
        }
    }
    
    get abnormalStandardSettingTableItemFrozenRowsBgColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.frozenRowsBgColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.frozenRowsBgColor;
        }
    }
    
    get abnormalStandardSettingTableItemSelectionBgColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.selectionBgColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.selectionBgColor;
        }
    }
    
    get abnormalStandardSettingTableItemHighlightBgColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.highlightBgColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.highlightBgColor;
        }
    }
    
    get abnormalStandardSettingTableItemUnderlayBackgroundColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.underlayBackgroundColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.underlayBackgroundColor;
        }
    }
    
    get abnormalStandardSettingTableItemFrozenRowsBorderColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.frozenRowsBorderColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.frozenRowsBorderColor;
        }
    }
    
    get abnormalStandardSettingTableItemBorderColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.borderColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.borderColor;
        }
    }
    
    get abnormalStandardSettingTableItemHighlightBorderColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.highlightBorderColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.highlightBorderColor;
        }
    }
    
    get abnormalStandardSettingTableItemUncheckBgColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.uncheckBgColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.uncheckBgColor;
        }
    }
    
    get abnormalStandardSettingTableItemCheckBgColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.checkBgColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.checkBgColor;
        }
    }
    
    get abnormalStandardSettingTableItemCheckboxBorderColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.checkboxBorderColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.checkboxBorderColor;
        }
    }
    
    get abnormalStandardSettingTableItemButtoncolor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.buttoncolor;
        } else {
            return this.abnormalStandardSettingTableItem.light.buttoncolor;
        }
    }
    
    get abnormalStandardSettingTableItemButtonBgColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.buttonBgColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.buttonBgColor;
        }
    }
    
    get abnormalStandardSettingTableItemHeaderSortArrowColor() {
        if (this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.headerSortArrowColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.headerSortArrowColor;
        }
    }

    get abnormalStandardSettingTableItemCardBackgroundColor() {
        if(this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.cardBackgroundColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.cardBackgroundColor;
        }
    }

    get abnormalStandardSettingTableItemInputBackgroundColor() {
        if(this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.inputBackgroundColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.inputBackgroundColor;
        }
    }

    get abnormalStandardSettingTableItemInputColor() {
        if(this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.inputColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.inputColor;
        }
    }

    get abnormalStandardSettingTableItemInputBorderColor() {
        if(this._theme === `dark`) {
            return this.abnormalStandardSettingTableItem.dark.inputBorderColor;
        } else {
            return this.abnormalStandardSettingTableItem.light.inputBorderColor;
        }
    }

    initDataSettingDlgItem = {
        dark: {
            backgroundColor: "#393e55",
            color: "#ffffff",
            inputBackgroundColor: "#393e55",
            inputBorderColor: "#ffffff"
        },
        light: {
            backgroundColor: "#d2d7e5",
            color: "#353544",
            inputBackgroundColor: "#ffffff",
            inputBorderColor: "#a6aebf"
        }
    }

    get initDataSettingDlgItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.initDataSettingDlgItem.dark.backgroundColor;
        } else {
            return this.initDataSettingDlgItem.light.backgroundColor;
        }
    }

    get initDataSettingDlgItemColor() {
        if(this._theme === `dark`) {
            return this.initDataSettingDlgItem.dark.color;
        } else {
            return this.initDataSettingDlgItem.light.color;
        }
    }

    get initDataSettingDlgItemInputBackgroundColor() {
        if(this._theme === `dark`) {
            return this.initDataSettingDlgItem.dark.inputBackgroundColor;
        } else {
            return this.initDataSettingDlgItem.light.inputBackgroundColor;
        }
    }

    get initDataSettingDlgItemInputBorderColor() {
        if(this._theme === `dark`) {
            return this.initDataSettingDlgItem.dark.inputBorderColor;
        } else {
            return this.initDataSettingDlgItem.light.inputBorderColor;
        }
    }
    
    // motor temperature

    temperatureChartItem = {
        dark: {
            default: {
                fontColor: `#ffffff`,
            },
            axis: {
                labelFontColor: `#ffffff`,
                axisX: {
                    lineColor: `#575f7d`,
                },
                axisY: {
                    gridColor: `#575f7d`
                },
            },
            legend: {
                fontColor: `#ffffff`,
            },
            dataPoints: {
                color: {
                    maxTemperature: `#ff9700`,
                    avgTemperature: `#1575f8`,
                    stdTemperature: `#0ca889`,
                    violation: `red`
                }
            }
        },
        light: {
            default: {
                fontColor: `#60676f`,
            },
            axis: {
                labelFontColor: `#60676f`,
                axisX: {
                    lineColor: `#b6b9c3`,
                },
                axisY: {
                    gridColor: `#b6b9c3`
                },
            },
            legend: {
                fontColor: `#60676f`,
            },
            dataPoints: {
                color: {
                    maxTemperature: `#ffa422`,
                    avgTemperature: `#0bb881`,
                    stdTemperature: `#3297ff`,
                    violation: `#ff5d40`
                }
            }
        }
    }

    /**
     * 
     *  모터 온도 차트 기본 문구 색상 가져오기
     */

    get temperatureChartFontColor() {
        if(this._theme ===  `dark`) {
            return this.temperatureChartItem.dark.default.fontColor;
        } else {
            return this.temperatureChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * 모터 온도 차트 축 라벨 생삭 가져오기
     */
    
    get temperatureChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.temperatureChartItem.dark.axis.labelFontColor;
        } else {
            return this.temperatureChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     *  모터 온도 차트 X 축 라인 색상 가져오기
     */
    
    get temperatureChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.temperatureChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.temperatureChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     *  모터 온도 차트 Y 축 그리드 색상 가져오기
     */
    
    get temperatureChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.temperatureChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.temperatureChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     *  모터 온도 차트 레전드 색상 가져오기
     */

    get temperatureChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.temperatureChartItem.dark.legend.fontColor;
        } else {
            return this.temperatureChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     *  모터 온도 차트 데이터 포인트 색상 가져오기
     *  여러 색상 값은 vue 파일에서 정의한 값과 동일한 이름으로 사용할 수 있다.
     */
    
    get temperatureChartDataPointsColor() {
        if(this._theme === `dark`) {
            return this.temperatureChartItem.dark.dataPoints.color;
        } else {
            return this.temperatureChartItem.light.dataPoints.color;
        }
    }
    tempSettingDlgItem = {
        dark: {
            backgroundColor: "#393e55",
            color: "#ffffff",
            inputBackgroundColor: "#393e55",
            inputBorderColor: "#ffffff"
        },
        light: {
            backgroundColor: "#d2d7e5",
            color: "#353544",
            inputBackgroundColor: "#ffffff",
            inputBorderColor: "#a6aebf"
        }
    }
    
    get tempSettingDlgItemBackgroundColor() {
        if(this._theme === `dark`) {
            return this.tempSettingDlgItem.dark.backgroundColor;
        } else {
            return this.tempSettingDlgItem.light.backgroundColor;
        }
    }

    get tempSettingDlgItemColor() {
        if(this._theme === `dark`) {
            return this.tempSettingDlgItem.dark.color;
        } else {
            return this.tempSettingDlgItem.light.color;
        }
    }

    get tempSettingDlgItemInputBackgroundColor() {
        if(this._theme === `dark`) {
            return this.tempSettingDlgItem.dark.inputBackgroundColor;
        } else {
            return this.tempSettingDlgItem.light.inputBackgroundColor;
        }
    }

    get tempSettingDlgItemInputBorderColor() {
        if(this._theme === `dark`) {
            return this.tempSettingDlgItem.dark.inputBorderColor;
        } else {
            return this.tempSettingDlgItem.light.inputBorderColor;
        }
    }
    
    torqueTemperatureItem = {
        dark: {
            btnAxisBorderColor: `#393e55`,
            axisBtnHoverBorderColor: `#0ca889`,
            axisBtnHoverBackgroundColor: `#171A29`,
            axisBtnHoverColor: `#0ca889`,
            chartCardColor: `#171A29`,
            chartCardBorderColor: `#4d5269`
        },
        light: {
            btnAxisBorderColor: `#cdd6df`,
            axisBtnHoverBorderColor: `#0ca889`,
            axisBtnHoverBackgroundColor: `#ffffff`,
            axisBtnHoverColor: `#0ca889`,
            chartCardColor: `#ffffff`,
            chartCardBorderColor: `#cdd6df`
        }
    }
    get torqueTemperatureItemBtnAxisBorderColor() {
        if (this._theme === `dark`) {
            return this.torqueTemperatureItem.dark.btnAxisBorderColor;
        } else {
            return this.torqueTemperatureItem.light.btnAxisBorderColor;
        }
    }
    get torqueTemperatureItemAxisBtnHoverBorderColor() {
        if (this._theme === `dark`) {
            return this.torqueTemperatureItem.dark.axisBtnHoverBorderColor;
        } else {
            return this.torqueTemperatureItem.light.axisBtnHoverBorderColor;
        }
    }
    get torqueTemperatureItemAxisBtnHoverBackgroundColor() {
        if (this._theme === `dark`) {
            return this.torqueTemperatureItem.dark.axisBtnHoverBackgroundColor;
        } else {
            return this.torqueTemperatureItem.light.axisBtnHoverBackgroundColor;
        }
    }
    get torqueTemperatureItemAxisBtnHoverColor() {
        if (this._theme === `dark`) {
            return this.torqueTemperatureItem.dark.axisBtnHoverColor;
        } else {
            return this.torqueTemperatureItem.light.axisBtnHoverColor;
        }
    }
    get torqueTemperatureItemChartCardColor() {
        if (this._theme === `dark`) {
            return this.torqueTemperatureItem.dark.chartCardColor;
        } else {
            return this.torqueTemperatureItem.light.chartCardColor;
        }
    }
    get torqueTemperatureItemChartCardBorderColor() {
        if (this._theme === `dark`) {
            return this.torqueTemperatureItem.dark.chartCardBorderColor;
        } else {
            return this.torqueTemperatureItem.light.chartCardBorderColor;
        }
    }
    // atomizer
    /**
     * 
     * atomizerDataChartItem
     */
    atomizerDataChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: `#ffffff`,
            },
            axis: {
                labelFontColor: `#ffffff`,
                axisX: {
                    lineColor: `#575f7d`,
                },
                axisY: {
                    gridColor: `#575f7d`
                },
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
                fontColor: `#60676f`,
            },
            axis: {
                labelFontColor: `#60676f`,
                axisX: {
                    lineColor: `#575f7d`,
                },
                axisY: {
                    gridColor: `#575f7d`
                },
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
     * 도장기 데이터 차트 배경색 가져오기
     */
    get atomizerDataChartBackgroundColor() {
        if(this._theme === 'dark') {
            return this.atomizerDataChartItem.dark.default.backgroundColor;
        }
        else {
            return this.atomizerDataChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * 도장기 데이터 차트 기본 문구 색상 가져오기
     */
    get atomizerDataChartFontColor() {
        if(this._theme === 'dark') {
            return this.atomizerDataChartItem.dark.default.fontColor;
        }
        else {
            return this.atomizerDataChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * 도장기 데이터 차트 축 라벨 색상 가져오기
     */
    get atomizerDataChartAxisLabelFontColor() {
        if(this._theme === 'dark') {
            return this.atomizerDataChartItem.dark.axis.labelFontColor;
        }
        else {
            return this.atomizerDataChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * 도장기 데이터 차트 X축 라인 색상 가져오기
     */
    get atomizerDataChartAxisXLineColor() {
        if(this._theme === 'dark') {
            return this.atomizerDataChartItem.dark.axis.axisX.lineColor;
        }
        else {
            return this.atomizerDataChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * 도장기 데이터 차트 Y축 그리드 색상 가져오기
     */
    get atomizerDataChartAxisYGridColor() {
        if(this._theme === 'dark') {
            return this.atomizerDataChartItem.dark.axis.axisY.gridColor;
        }
        else {
            return this.atomizerDataChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     * 도장기 데이터 차트 레전드 색상 가져오기
     */
    get atomizerDataChartLegendFontColor() {
        if(this._theme === 'dark') {
            return this.atomizerDataChartItem.dark.legend.fontColor;
        }
        else {
            return this.atomizerDataChartItem.light.legend.fontColor;
        }
    }

    /**
     * 
     * 도장기 데이터 차트 데이터 포인트 색상 가져오기
     */
    get atomizerDataChartDataPointsColors() {
        if(this._theme === 'dark') {
            return this.atomizerDataChartItem.dark.dataPoints.colors;
        }
        else {
            return this.atomizerDataChartItem.light.dataPoints.colors;
        }
    }
    
    atomizerDataTableItem = {
        dark: {
            paginationColor: `#005bac !important`,
        },
        light: {
            paginationColor: `#3086ff !important`,
        }
    }
    get atomizerDataTableItemPaginationColor() {
        if (this._theme === `dark`) {
            return this.atomizerDataTableItem.dark.paginationColor;
        } else {
            return this.atomizerDataTableItem.light.paginationColor;
        }
    }

    // alarmstatics

    alarmStatisticsChartItem = {
        dark: {
            default: {
                backgroundColor: `#171a29`,
                fontColor: `#ffffff`,
            },
            axis: {
                labelFontColor: `#ffffff`,
                axisX: {
                    lineColor: `#575f7d`,
                },
                axisY: {
                    gridColor: `#575f7d`,
                    axisY1: {
                        color: `#18c2fa`
                    },
                    axisY2: {
                        color: `#cf9e48`
                    }
                },
            },
            legend: {
                fontColor: `#ffffff`
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`,
            },
            axis: {
                labelFontColor: `#60676f`,
                axisX: {
                    lineColor: `#b6b9c3`,
                },
                axisY: {
                    gridColor: `#b6b9c3`,
                    axisY1: {
                        color: `#3297ff`
                    },
                    axisY2: {
                        color: `#ffa422`
                    }
                },
            },
            legend: {
                fontColor: `#60676f`
            }
        }
    }
    /**
     * 
     * 알람 통계 차트 배경 색상 가져오기
     */
    get alarmStatisticsChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.alarmStatisticsChartItem.dark.default.backgroundColor;
        } else {
            return this.alarmStatisticsChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * 알람 통계 차트 기본 문구 색상 가져오기
     */
    get alarmStatisticsChartFontColor() {
        if(this._theme === `dark`) {
            return this.alarmStatisticsChartItem.dark.default.fontColor;
        } else {
            return this.alarmStatisticsChartItem.light.default.fontColor;
        }
    }
    
    /**
     * 
     *  알람 통계 차트 축 라벨 색상 가져오기
     */
    get alarmStatisticsChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.alarmStatisticsChartItem.dark.axis.labelFontColor;
        } else {
            return this.alarmStatisticsChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * 알람 통계 차트 X축 라인 색상 가져오기
     */
    get alarmStatisticsChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.alarmStatisticsChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.alarmStatisticsChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     *  알람 통계 차트 Y축 그리드 색상 가져오기
     */
    get alarmStatisticsChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.alarmStatisticsChartItem.dark.axis.axisY.gridColor;
        }
        else {
            return this.alarmStatisticsChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     *  알람 통계 차트 Y축 발생 건 색상 가져오기
     */
    get alarmStatisticsChartAxisY1Color() {
        if(this._theme === `dark`) {
            return this.alarmStatisticsChartItem.dark.axis.axisY.axisY1.color;
        } else {
            return this.alarmStatisticsChartItem.light.axis.axisY.axisY1.color;
        }
    }

    /**
     * 
     *  알람 통계 차트 Y축 정지 시간 색상 가져오기
     */
    get alarmStatisticsChartAxisY2Color() {
        if(this._theme === 'dark') {
            return this.alarmStatisticsChartItem.dark.axis.axisY.axisY2.color;
        } else {
            return this.alarmStatisticsChartItem.light.axis.axisY.axisY2.color;
        }
    }

    /**
     * 
     * 알람 통계 차트 레전드 색상 가져오기
     */
    get alarmStatisticsChartLegendFontColor() {
        if(this._theme === `dark`) {
            return this.alarmStatisticsChartItem.dark.legend.fontColor;
        } else {
            return this.alarmStatisticsChartItem.light.legend.fontColor;
        }
    }

    codeAggregationChartItem = {
        dark: {
            default: {
                backgroundColor: `#2a2f43`,
                fontColor: `#ffffff`,
            },
            axis: {
                labelFontColor: `#ffffff`,
                axisX: {
                    lineColor: `#575f7d`,
                },
                axisY: {
                    gridColor: `#575f7d`,
                }
            },
            dataPoints: {
                dataColor0: `#43aea8`,
                dataColor1: `#5fadef`,
                dataColor2: `#6c85bd`,
                dataColor3: `#cfa448`,
                dataColor4: `#bac3d2`
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`,
            },
            axis: {
                labelFontColor: `#60676f`,
                axisX: {
                    lineColor: `#b6b9c3`,
                },
                axisY: {
                    gridColor: `#b6b9c3`,
                }
            },
            dataPoints: {
                dataColor0: `#0bb881`,
                dataColor1: `#3297ff`,
                dataColor2: `#0baeb8`,
                dataColor3: `#ffa422`,
                dataColor4: `#a2b1ca`
            }
        }
    }

    /**
     * 
     * 코드 별 집계 차트 배경 색상 가져오기
     */
    get codeAggregationChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.default.backgroundColor;
        } else {
            return this.codeAggregationChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * 코드 별 집계 차트 기본 문구 색상 가져오기
     */
    get codeAggregationChartFontColor() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.default.fontColor;
        } else {
            return this.codeAggregationChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * 코드 별 집계 차트 축 라벨 색상 가져오기
     */
    get codeAggregationChartAxisLabelFontColor() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.axis.labelFontColor;
        } else {
            return this.codeAggregationChartItem.light.axis.labelFontColor;
        }
    }

    /**
     * 
     * 코드 별 집계 차트 X축 라인 색상 가져오기
     */
    get codeAggregationChartAxisXLineColor() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.axis.axisX.lineColor;
        } else {
            return this.codeAggregationChartItem.light.axis.axisX.lineColor;
        }
    }

    /**
     * 
     * 코드 별 집계 차트 Y축 그리드 색상 가져오기
     */
    get codeAggregationChartAxisYGridColor() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.axis.axisY.gridColor;
        } else {
            return this.codeAggregationChartItem.light.axis.axisY.gridColor;
        }
    }

    /**
     * 
     *  코드 별 집계 차트 데이터 포인터 첫 번째 색상 가져오기
     */
    get codeAggregationChartDataPointsColor0() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.dataPoints.dataColor0;
        } else {
            return this.codeAggregationChartItem.light.dataPoints.dataColor0;
        }
    }

    /**
     * 
     *  코드 별 집계 차트 데이터 포인터 두 번째 색상 가져오기
     */
    get codeAggregationChartDataPointsColor1() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.dataPoints.dataColor1;
        } else {
            return this.codeAggregationChartItem.light.dataPoints.dataColor1;
        }
    }

    /**
     * 
     *  코드 별 집계 차트 데이터 포인터 세 번째 색상 가져오기
     */
    get codeAggregationChartDataPointsColor2() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.dataPoints.dataColor2;
        } else {
            return this.codeAggregationChartItem.light.dataPoints.dataColor2;
        }
    }

    /**
     * 
     *  코드 별 집계 차트 데이터 포인터 네 번째 색상 가져오기
     */
    get codeAggregationChartDataPointsColor3() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.dataPoints.dataColor3;
        } else {
            return this.codeAggregationChartItem.light.dataPoints.dataColor3;
        }
    }

    /**
     * 
     *  코드 별 집계 차트 데이터 포인터 다섯 번째 색상 가져오기
     */
    get codeAggregationChartDataPointsColor4() {
        if(this._theme === `dark`) {
            return this.codeAggregationChartItem.dark.dataPoints.dataColor4;
        } else {
            return this.codeAggregationChartItem.light.dataPoints.dataColor4;
        }
    }

    dateAggregationChartItem = {
        dark : {
            default: {
                backgroundColor: `#2a2f43`,
                fontColor: `#ffffff`
            },
            indexLabel: {
                fontColor: `#ffffff`,
            },
            dataPoints: {
                dataColor0: `#43aea8`,
                dataColor1: `#5fadef`,
                dataColor2: `#6c85bd`,
                dataColor3: `#cfa448`,
                dataColor4: `#bac3d2`
            }
        },
        light: {
            default: {
                backgroundColor: `#ffffff`,
                fontColor: `#60676f`
            },
            indexLabel: {
                fontColor: `#60676f`,
            },
            dataPoints: {
                dataColor0: `#0bb881`,
                dataColor1: `#3297ff`,
                dataColor2: `#0baeb8`,
                dataColor3: `#ffa422`,
                dataColor4: `#a2b1ca`
            }
        }
    }

    /**
     * 
     * 일자 별 집계 차트 배경 색상 가져오기
     */
    get dateAggregationChartBackgroundColor() {
        if(this._theme === `dark`) {
            return this.dateAggregationChartItem.dark.default.backgroundColor;
        } else {
            return this.dateAggregationChartItem.light.default.backgroundColor;
        }
    }

    /**
     * 
     * 일자별 집계 차트 기본 문구 색상 가져오기
     */
    get dateAggregationChartFontColor() {
        if(this._theme === `dark`) {
            return this.dateAggregationChartItem.dark.default.fontColor;
        } else {
            return this.dateAggregationChartItem.light.default.fontColor;
        }
    }

    /**
     * 
     * 일자별 집계 차트 인데스 라벨 색상 가져오기
     */
    get dateAggregationChartIndexLabelFontColor() {
        if(this._theme === `dark`) {
            return this.dateAggregationChartItem.dark.indexLabel.fontColor;
        } else {
            return this.dateAggregationChartItem.light.indexLabel.fontColor;
        }
    }

    /**
     * 
     *  일자 별 집계 차트 데이터 포인터 첫 번째 색상 가져오기
     */
    get dateAggregationChartDataPointsColor0() {
        if(this._theme === `dark`) {
            return this.dateAggregationChartItem.dark.dataPoints.dataColor0;
        } else {
            return this.dateAggregationChartItem.light.dataPoints.dataColor0;
        }
    }

    /**
     * 
     *  일자 별 집계 차트 데이터 포인터 두 번째 색상 가져오기
     */
    get dateAggregationChartDataPointsColor1() {
        if(this._theme === `dark`) {
            return this.dateAggregationChartItem.dark.dataPoints.dataColor1;
        } else {
            return this.dateAggregationChartItem.light.dataPoints.dataColor1;
        }
    }

    /**
     * 
     *  일자 별 집계 차트 데이터 포인터 세 번째 색상 가져오기
     */
    get dateAggregationChartDataPointsColor2() {
        if(this._theme === `dark`) {
            return this.dateAggregationChartItem.dark.dataPoints.dataColor2;
        } else {
            return this.dateAggregationChartItem.light.dataPoints.dataColor2;
        }
    }

    /**
     * 
     *  일자 별 집계 차트 데이터 포인터 네 번째 색상 가져오기
     */
    get dateAggregationChartDataPointsColor3() {
        if(this._theme === `dark`) {
            return this.dateAggregationChartItem.dark.dataPoints.dataColor3;
        } else {
            return this.dateAggregationChartItem.light.dataPoints.dataColor3;
        }
    }

    /**
     * 
     *  일자 별 집계 차트 데이터 포인터 다섯 번째 색상 가져오기
     */
    get dateAggregationChartDataPointsColor4() {
        if(this._theme === `dark`) {
            return this.dateAggregationChartItem.dark.dataPoints.dataColor4;
        } else {
            return this.dateAggregationChartItem.light.dataPoints.dataColor4;
        }
    }

    codeAggregationDlgItem = {
        dark: {
            mainCardBackgroundColor: `#171a29`,
            subCardBackgroundColor: `#2a2f43`,
            subCardTitleBackgroundColor: `#313b56`,
            subCardTitleColor: `#ffffff`,
            dataBackgroundColor0: `#5fadef`,
            dataBackgroundColor1: `#5fadef`,
            dataBackgroundColor2: `#6c85bd`,
            dataBackgroundColor3: `#cfa448`,
            dataBackgroundColor4: `#bac3d2`,
            yAxesGridLinesColor: `#4f5575`,
            yAxesGridLinesZeroLineColor: `#4f5575`,
            yAxesTicksFontColor: `#bdc2dc`,
            xAxesGridLinesColor: `#4f5575`,
            xAxesTicksFontColor: `#bdc2dc`,
        },
        light: {
            mainCardBackgroundColor: `#ccd2e2`,
            subCardBackgroundColor: `#ffffff`,
            subCardTitleBackgroundColor: `#313b56`,
            subCardTitleColor: `#ffffff`,
            dataBackgroundColor0: `#5fadef`,
            dataBackgroundColor1: `#5fadef`,
            dataBackgroundColor2: `#6c85bd`,
            dataBackgroundColor3: `#cfa448`,
            dataBackgroundColor4: `#bac3d2`,
            yAxesGridLinesColor: `#b6b9c3`,
            yAxesGridLinesZeroLineColor: `#b6b9c3`,
            yAxesTicksFontColor: `#383b4b`,
            xAxesGridLinesColor: `#b6b9c3`,
            xAxesTicksFontColor: `#383b4b`,
        }
    }
    get codeAggregationDlgItemMainCardBackgroundColor() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.mainCardBackgroundColor;
        } else {
            return this.codeAggregationDlgItem.light.mainCardBackgroundColor;
        }
    }
    get codeAggregationDlgItemSubCardBackgroundColor() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.subCardBackgroundColor;
        } else {
            return this.codeAggregationDlgItem.light.subCardBackgroundColor;
        }
    }

    get codeAggregationDlgItemSubCardTitleBackgroundColor() {
        if(this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.subCardTitleBackgroundColor;
        } else {
            return this.codeAggregationDlgItem.light.subCardTitleBackgroundColor;
        }
    }

    get codeAggregationDlgItemSubCardTitleColor() {
        if(this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.subCardTitleColor;
        } else {
            return this.codeAggregationDlgItem.light.subCardTitleColor;
        }
    }

    get codeAggregationDlgItemDataBackgroundColor0() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.dataBackgroundColor0;
        } else {
            return this.codeAggregationDlgItem.light.dataBackgroundColor0;
        }
    }
    get codeAggregationDlgItemDataBackgroundColor1() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.dataBackgroundColor1;
        } else {
            return this.codeAggregationDlgItem.light.dataBackgroundColor1;
        }
    }
    get codeAggregationDlgItemDataBackgroundColor2() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.dataBackgroundColor2;
        } else {
            return this.codeAggregationDlgItem.light.dataBackgroundColor2;
        }
    }
    get codeAggregationDlgItemDataBackgroundColor3() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.dataBackgroundColor3;
        } else {
            return this.codeAggregationDlgItem.light.dataBackgroundColor3;
        }
    }
    get codeAggregationDlgItemDataBackgroundColor4() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.dataBackgroundColor4;
        } else {
            return this.codeAggregationDlgItem.light.dataBackgroundColor4;
        }
    }
    get codeAggregationDlgItemYAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.yAxesGridLinesColor;
        } else {
            return this.codeAggregationDlgItem.light.yAxesGridLinesColor;
        }
    }
    get codeAggregationDlgItemYAxesGridLinesZeroLineColor() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.yAxesGridLinesZeroLineColor;
        } else {
            return this.codeAggregationDlgItem.light.yAxesGridLinesZeroLineColor;
        }
    }
    get codeAggregationDlgItemYAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.yAxesTicksFontColor;
        } else {
            return this.codeAggregationDlgItem.light.yAxesTicksFontColor;
        }
    }
    get codeAggregationDlgItemXAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.xAxesGridLinesColor;
        } else {
            return this.codeAggregationDlgItem.light.xAxesGridLinesColor;
        }
    }
    get codeAggregationDlgItemXAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.codeAggregationDlgItem.dark.xAxesTicksFontColor;
        } else {
            return this.codeAggregationDlgItem.light.xAxesTicksFontColor;
        }
    }
    dateAggregationDlgItem = {
        dark: {
            mainCardBackgroundColor: `#171a29`,
            subCardBackgroundColor: `#2a2f43`,
            subCardTitleBackgroundColor: `#313b56`,
            subCardTitleColor: `#ffffff`,
            yAxesGridLinesColor: `#4f5575`,
            yAxesGridLinesZeroLineColor: `#4f5575`,
            yAxesTicksFFontColor: `#bdc2dc`,
            yAxesTicksSFontColor: `#bdc2dc`,
            xAxesGridLinesColor: `#4f5575`,
            xAxesTicksFontColor: `#bdc2dc`,
        },
        light: {
            mainCardBackgroundColor: `#ccd2e2`,
            subCardBackgroundColor: `#ffffff`,
            subCardTitleBackgroundColor: `#313b56`,
            subCardTitleColor: `#ffffff`,
            yAxesGridLinesColor: `#b6b9c3`,
            yAxesGridLinesZeroLineColor: `#b6b9c3`,
            yAxesTicksFFontColor: `#383b4b`,
            yAxesTicksSFontColor: `#383b4b`,
            xAxesGridLinesColor: `#b6b9c3`,
            xAxesTicksFontColor: `#383b4b`,
        }
    }
    get dateAggregationDlgItemMainCardBackgroundColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.mainCardBackgroundColor;
        } else {
            return this.dateAggregationDlgItem.light.mainCardBackgroundColor;
        }
    }
    get dateAggregationDlgItemSubCardBackgroundColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.subCardBackgroundColor;
        } else {
            return this.dateAggregationDlgItem.light.subCardBackgroundColor;
        }
    }

    get dateAggregationDlgItemSubCardTitleBackgroundColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.subCardTitleBackgroundColor;
        } else {
            return this.dateAggregationDlgItem.light.subCardTitleBackgroundColor;
        }
    }

    get dateAggregationDlgItemSubCardTitleColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.subCardTitleColor;
        } else {
            return this.dateAggregationDlgItem.light.subCardTitleColor;
        }
    }
    get dateAggregationDlgItemYAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.yAxesGridLinesColor;
        } else {
            return this.dateAggregationDlgItem.light.yAxesGridLinesColor;
        }
    }
    get dateAggregationDlgItemYAxesGridLinesZeroLineColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.yAxesGridLinesZeroLineColor;
        } else {
            return this.dateAggregationDlgItem.light.yAxesGridLinesZeroLineColor;
        }
    }
    get dateAggregationDlgItemYAxesTicksFFontColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.yAxesTicksFFontColor;
        } else {
            return this.dateAggregationDlgItem.light.yAxesTicksFFontColor;
        }
    }
    get dateAggregationDlgItemYAxesTicksSFontColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.yAxesTicksSFontColor;
        } else {
            return this.dateAggregationDlgItem.light.yAxesTicksSFontColor;
        }
    }
    get dateAggregationDlgItemXAxesGridLinesColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.xAxesGridLinesColor;
        } else {
            return this.dateAggregationDlgItem.light.xAxesGridLinesColor;
        }
    }
    get dateAggregationDlgItemXAxesTicksFontColor() {
        if (this._theme === `dark`) {
            return this.dateAggregationDlgItem.dark.xAxesTicksFontColor;
        } else {
            return this.dateAggregationDlgItem.light.xAxesTicksFontColor;
        }
    }

}