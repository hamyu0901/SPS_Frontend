const common = require('./style/common');
const logIn = require('./style/login');
const mainContainer = require('./style/maincontainer');
const home = require('./style/home');
const monitoring = require('./style/monitoring');
const diagnostics = require('./style/diagnostics');
const realtime = require('./style/realtime');
const maintenance = require('./style/maintenance');
const alarm = require('./style/alarm');
const postHistory = require('./style/posthistory');
const manual = require('./style/manual');
const backup = require('./style/backup');

class Multi {
	static inherit(..._bases)
	{
		class classes {
  			get base() { return _bases; }
			constructor(..._args) {
                var index = 0;
				for (let b of this.base) {
					let obj = new b(_args[index++]);
                    Multi.copy(this, obj);
				}
			}
		}
		for (let base of _bases) {
            Multi.copy(classes, base);
            Multi.copy(classes.prototype, base.prototype);
		}
		return classes;
	}
	static copy(_target, _source) {
        for (let key of Reflect.ownKeys(_source)) {
            if (key !== "constructor" && key !== "prototype" && key !== "name") {
                let desc = Object.getOwnPropertyDescriptor(_source, key);
                Object.defineProperty(_target, key, desc);
            }
        }
    }
}

class Style extends Multi.inherit(
    logIn.LogInSty, 
    mainContainer.MainContainerSty,
    home.HomeSty,
    monitoring.MonitoringSty,
    diagnostics.DiagnosticsSty,
    realtime.RealTimeSty,
    maintenance.MaintenanceSty,
    alarm.AlarmSty,
    postHistory.PostHistorySty,
    manual.ManualSty,
    backup.BackupSty,
    common.CommonSty
    ) {
    constructor() {
        super();
    }
    
    theme = 2
    themeInfo = {
        theme1: 1,
        theme2: 2
    }
    titleObject = {
        color: 'white',
        fontSize: '20px',
        marginBottom: '0px',
        padding: '5px'
    }
    tabMenuStyle = {
        color: '#a9c5ff'
    }
    tableHeaderStyle = {
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold'
    }
    chartStyle = {
        commons: {
            theme1: {
                legend: {
                    fontColor: "#FFFFFF"
                },
                scaleLabel: {
                    fontColor: "#FFFFFF"
                },
                gridLines: {
                    color: "#4f5575",
                    zeroLineColor: "#4f5575"
                },
                ticks: {
                    // fontColor: '#bdc2dc'
                    fontColor: "#FFFFFF"
                }

            },
            theme2: {
                legend: {

                },
                scaleLabel: {

                },
                gridLines: {

                },
                ticks: {

                }
            }
        },
        home: {
            alarmEventCountDeadTime: {
                common: {
                    config: {
                        height: '255px',
                        position: 'relative'
                    }
                },
                theme1: {
                    color: {
                        background: '#171a29',
                        border: '#FFFFFF',
                        legend: '#FFFFFF',
                        yLabelDeadTime: '#FFFFFF',
                        yLabelCount: '#FF5E00',
                        yGridLine: '#4f5575',
                        xGridLine: '#4f5575'
                    }
                },
                theme2: {
                    color: {
                        background: '#171a29',
                        border: '#FFFFFF',
                        legend: '#000000',
                        yLabelDeadTime: '#000000',
                        yLabelCount: '#000000',
                        yGridLine: '#00000',
                        xGridLine: '#4f5575'
                    }
                }
            }
        }
    }
    setThemeStyle(theme) {
        this.theme = theme;
        const dark = `dark`;
        const light = `light`;
        if (this.theme === 1) {
            super.commonMode = dark;
            super.logInMode = dark;
            super.mainContainerMode = dark;
            super.homeMode = dark;
            super.monitoringMode = dark;
            super.diagnosticsMode = dark;
            super.realTimeMode = dark;
            super.maintenanceMode = dark;
            super.alarmMode = dark;
            super.postHistoryMode = dark;
            super.manualMode = dark;
            super.backupMode = dark;
        }
        else {
            super.commonMode = light;
            super.logInMode = light;
            super.mainContainerMode = light;
            super.homeMode = light;
            super.monitoringMode = light;
            super.diagnosticsMode = light;
            super.realTimeMode = light;
            super.maintenanceMode = light;
            super.alarmMode = light;
            super.postHistoryMode = light;
            super.manualMode = light;
            super.backupMode = light;
        }
    }
    getThemeStyle() {
        return Number(this.theme);
    }
    getTitleStyle() {
        return this.titleObject;
    }
    getTabMenuStyle() {
        return this.tabMenuStyle;
    }
    getTableHeaderStyle() {
        return this.tableHeaderStyle;
    }
    getCommonsChartLegendStyle() {
        if(this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.commons.theme1.legend;
        }
        else if(this.getThemeStyle() == this.themeInfo.theme2) {
            return this.chartStyle.commons.theme2.legend;
        }
    }
    getCommonsChartScaleLabelStyle() {
        if(this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.commons.theme1.scaleLabel;
        }
        else if(this.getThemeStyle() == this.themeInfo.theme2) {
            return this.chartStyle.commons.theme2.scaleLabel;
        }
    }
    getCommonsChartGridLineStyle() {
        if(this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.commons.theme1.gridLines;
        }
        else if(this.getThemeStyle() == this.themeInfo.theme2) {
            return this.chartStyle.commons.theme2.gridLines;
        }
    }
    getCommonsChartTicksStyle() {
        if(this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.commons.theme1.ticks;
        }
        else if(this.getThemeStyle() == this.themeInfo.theme2) {
            return this.chartStyle.commons.theme2.ticks;
        }
    }
    getHomeAlarmEventChartConfig() {
        return this.chartStyle.home.alarmEventCountDeadTime.common.config;
    }
    getHomeAlarmEventChartBackGroundColorStyle() {
        if (this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.home.alarmEventCountDeadTime.theme1.color.background;
        }
        else if (this.getThemeStyle() == this.themeInfo.theme2) {   
            return this.chartStyle.home.alarmEventCountDeadTime.theme2.color.background;
        }
    }
    getHomeAlarmEventChartBorderColorStyle() {
        if (this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.home.alarmEventCountDeadTime.theme1.color.border;
        }
        else if (this.getThemeStyle() == this.themeInfo.theme2) {   
            return this.chartStyle.home.alarmEventCountDeadTime.theme2.color.border;
        }
    }
    getHomeAlarmEventChartLegendColorStyle() {
        if (this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.home.alarmEventCountDeadTime.theme1.color.legend;
        }
        else if (this.getThemeStyle() == this.themeInfo.theme2) {   
            return this.chartStyle.home.alarmEventCountDeadTime.theme2.color.legend;
        }
    }
    getHomeAlarmEventChartYLabelDeadTimeColorStyle() {
        if (this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.home.alarmEventCountDeadTime.theme1.color.yLabelDeadTime;
        }
        else if (this.getThemeStyle() == this.themeInfo.theme2) {   
            return this.chartStyle.home.alarmEventCountDeadTime.theme2.color.yLabelDeadTime;
        }
    }
    getHomeAlarmEventChartYLabelCountColorStyle() {
        if (this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.home.alarmEventCountDeadTime.theme1.color.yLabelCount;
        }
        else if (this.getThemeStyle() == this.themeInfo.theme2) {   
            return this.chartStyle.home.alarmEventCountDeadTime.theme2.color.yLabelCount;
        }
    }
    getHomeAlarmEventChartYGridLineColorStyle() {
        if (this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.home.alarmEventCountDeadTime.theme1.color.yGridLine;
        }
        else if (this.getThemeStyle() == this.themeInfo.theme2) {   
            return this.chartStyle.home.alarmEventCountDeadTime.theme2.color.yGridLine;
        }
    }
    getHomeAlarmEventChartXGridLineColorStyle() {
        if (this.getThemeStyle() == this.themeInfo.theme1) {
            return this.chartStyle.home.alarmEventCountDeadTime.theme1.color.xGridLine;
        }
        else if (this.getThemeStyle() == this.themeInfo.theme2) {   
            return this.chartStyle.home.alarmEventCountDeadTime.theme2.color.xGridLine;
        }
    }
    get common() {
        return super.instanceCommonSty;
    }
    // login
    get logIn() {
        return super.instanceLogInSty;
    }
    get logInVersionStyle() {
        return super.versionText;
    }
    get logInCIStyle() {
        return super.ciText;
    }
    get logInCardStyle() {
        return super.loginCard;
    }
    get logInResolutionTextStyle() {
        return super.resolutionText;
    }
    get logInTextFieldStyle() {
        return super.textField;
    }
    get logInTextFieldIDTextStyle() {
        return super.idTextColor;
    }
    get logInTextFieldPWTextStyle() {
        return super.pwTextColor;
    }
    get logInButtonStyle() {
        return super.loginButtonColor;
    }
    // mainContainer
    get maincontainer() {
        return super.instanceMainContainerSty;
    }
    get mainContainerHeaderStyle() {
        return super.header;
    }
    get mainContainerMainStyle() {
        return super.main;
    }
    get mainContainerFooterStyle() {
        return super.footer;
    }
    get mainContainerFooterTextStyle() {
        return super.footerText;
    }
    // home
    get home() {
        return super.instanceHomeSty;
    }

    // monitoring
    get monitoring() {
        return super.instanceMonitoringSty;
    }

    // diagnostics
    get diagnostics() {
        return super.instanceDiagnosticsSty;
    }
    // realtime
    get realtime() {
        return super.instanceRealTimeSty;
    } 
    // maintenance
    get maintenance() {
        return super.instanceMaintenanceSty;
    }
    // alarm
    get alarm() {
        return super.instanceAlarmSty;
    }
    // posthistory
    get posthistory() {
        return super.instancePostHistorySty;
    }
    // manual
    get manual() {
        return super.instanceManualSty;
    }
    // backup
    get backup() {
        return super.instanceBackupSty;
    }
}

export {Style}