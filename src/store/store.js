import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
import i18n from '@/plugins/i18n';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex)

let baseAddress = '';

const checkAuth = (userAuth) => {
    // 일반 0, 관리자 1
    return userAuth === 1
}

const GET_DEFAULT_STATE = (params = {}) => {
    /** [TODO]: 주석 처리된 부분 추후 삭제 예정 */
    return{
        baseUrl: baseAddress,
        auth: params.auth ? params.auth : 0,
        alarmTypeItems: [],
        new_booth_infos: [],
        new_zone_infos: [],
        new_robot_infos: [],
        new_report_zone_infos: {},
        rc_model_infos: [],
        robot_tool_infos: [],
        theme: true, // dark,
        language: params ? (params.language ? params.language : i18n.locale): i18n.locale,
        navigationFlag: true, // navigation drawer flag
        mainMenuItems: [
            {id: 'home', name: i18n.t(`tabtitle.home`), target: "/sps/home", show: true, active: false, normalImg: require("@/images/tabicons/tab_home_normal.png"), overImg: require("@/images/tabicons/tab_home_over.png"), menuImg: require("@/images/menuicons/main_menu_home.png"), menuLightImg: require("@/images/menuicons/main_menu_home_light.png")},
            {id: 'monitoring', name: i18n.t(`tabtitle.monitoring`),  target: "/sps/monitoring", show: true, active: false, normalImg: require("@/images/tabicons/tab_monitoring_normal.png"), overImg: require("@/images/tabicons/tab_monitoring_over.png"), menuImg: require("@/images/menuicons/main_menu_monitoring.png"), menuLightImg: require("@/images/menuicons/main_menu_monitoring_light.png")},
            {id: 'diagnostics', name: i18n.t(`tabtitle.diagnostics`), target: "/sps/diagnostics", show: true, active: false, normalImg: require("@/images/tabicons/tab_diagnostics_normal.png"), overImg: require("@/images/tabicons/tab_diagnostics_over.png"), menuImg: require("@/images/menuicons/main_menu_diagnostics.png"), menuLightImg: require("@/images/menuicons/main_menu_diagnostics_light.png")},
            {id: 'maintenance', name: i18n.t(`tabtitle.maintenance`), target: "/sps/maintenance", show: true, active: false, normalImg: require("@/images/tabicons/tab_maintenance_normal.png"), overImg: require("@/images/tabicons/tab_maintenance_over.png"), menuImg: require("@/images/menuicons/main_menu_maintenance.png"), menuLightImg: require("@/images/menuicons/main_menu_maintenance_light.png")},
            {id: 'reportview', name: i18n.t(`tabtitle.reportview`), target: "/sps/reportview", show: checkAuth(params && params.auth), active: false, normalImg: require("@/images/tabicons/tab_dataReport_normal.png"), overImg: require("@/images/tabicons/tab_dataReport_over.png"), menuImg: require("@/images/tabicons/tab_dataReport_normal.png"), menuLightImg: require("@/images/tabicons/tab_dataReport_over.png")},
            {id: 'extra', name: i18n.t(`tabtitle.reportview`), target: "/sps/extra", show: true, active: false, normalImg: require("@/images/tabicons/tab_extra_normal.png"), overImg: require("@/images/tabicons/tab_extra_over.png"), menuImg: require("@/images/tabicons/tab_dataReport_normal.png"), menuLightImg: require("@/images/tabicons/tab_dataReport_over.png")},
        ],

        diagnosticsMenuItems: [
            { id: 'predict', title: i18n.t(`diagnostics.drawertitle.predict`), path:'/sps/diagnostics/predict', show: true, active: false, normalImg: require("@/images/navicons/nav_predict_normal.png"), overImg: require("@/images/navicons/nav_predict_over.png"), menuImg: require("@/images/menuicons/diagnostics_menu_predict.png"), menuLightImg: require("@/images/menuicons/diagnostics_menu_predict_light.png")},
            { id: 'torquedata', title: i18n.t(`diagnostics.drawertitle.torquedata`), path:'/sps/diagnostics/torquedata', show: true, active: false, normalImg: require("@/images/navicons/nav_torquedata_normal.png"), overImg: require("@/images/navicons/nav_torquedata_over.png"), menuImg: require("@/images/menuicons/diagnostics_menu_torquedata.png"), menuLightImg: require("@/images/menuicons/diagnostics_menu_torquedata_light.png")},
            { id: 'torqueloadfactor', title: i18n.t(`diagnostics.drawertitle.torqueloadfactor`), path:'/sps/diagnostics/torqueloadfactor', show: true, active: false, normalImg: require("@/images/navicons/nav_torqueloadfactor_normal.png"), overImg: require("@/images/navicons/nav_torqueloadfactor_over.png"), menuImg: require("@/images/menuicons/diagnostics_menu_torqueloadfactor.png"), menuLightImg: require("@/images/menuicons/diagnostics_menu_torqueloadfactor_light.png")},
            { id: 'torquetemperature', title: i18n.t(`diagnostics.drawertitle.torquetemperature`), path:'/sps/diagnostics/torquetemperature', show: true, active: false, normalImg: require("@/images/navicons/nav_torquetemperature_normal.png"), overImg: require("@/images/navicons/nav_torquetemperature_over.png"), menuImg: require("@/images/menuicons/diagnostics_menu_motortemperature.png"), menuLightImg: require("@/images/menuicons/diagnostics_menu_motortemperature_light.png")},
            { id: 'atomizer', title: i18n.t(`diagnostics.drawertitle.atomizer`), path: '/sps/diagnostics/atomizer', show: true, active: false, normalImg: require("@/images/navicons/nav_atomizer_normal.png"), overImg: require("@/images/navicons/nav_atomizer_over.png"), menuImg: require("@/images/menuicons/diagnostics_menu_atomizerdata.png"), menuLightImg: require("@/images/menuicons/diagnostics_menu_atomizerdata_light.png")},
            { id: 'statistics', title: i18n.t(`diagnostics.drawertitle.alarmstatistics`), path:'/sps/diagnostics/statistics', show: true, active: false, normalImg: require("@/images/navicons/nav_alarmstatistics_normal.png"), overImg: require("@/images/navicons/nav_alarmstatistics_over.png"), menuImg: require("@/images/menuicons/diagnostics_menu_alarmstatistics.png"), menuLightImg: require("@/images/menuicons/diagnostics_menu_alarmstatistics_light.png")},
        ],

        extraMenuItems: [
            {
                id: 'production-group',
                type: 'group',
                title:  i18n.t(`extra.drawerTitle.production`),
                show: true,
                active: true,
                normalImg: require("@/images/navicons/nav_product-history_normal.png"),
                overImg: require("@/images/navicons/nav_product-history_over.png"),
                items: [
                  { id: 'production', title: i18n.t(`extra.drawerTitle.production`), active: false, target: "/sps/extra/production" },
                  { id: 'vin-no-production-history', title: i18n.t(`extra.drawerTitle.vin-no-production-history`), active: false, target: "/sps/extra/vin-no-production-history" },
                ]
            },
            {
                id: 'backup',
                type: 'list',
                title: i18n.t(`extra.drawerTitle.backup`),
                target: "/sps/extra/backup",
                show: true,
                active: false,
                normalImg: require("@/images/navicons/nav_backup_normal.png"),
                overImg: require("@/images/navicons/nav_backup_over.png"),
            },
            {
                id: 'manual',
                type: 'list',
                title: i18n.t(`extra.drawerTitle.manual`),
                target: "/sps/extra/manual",
                show: true,
                active: false,
                normalImg: require("@/images/navicons/nav_manual_normal.png"),
                overImg: require("@/images/navicons/nav_manual_hover.png"),
                menuImg: require("@/images/menuicons/main_menu_manual.png"),
                menuLightImg: require("@/images/menuicons/main_menu_manual_light.png")
            },
        ],
        reportItems: {
            selectedReport: {},
            selectTorqueAnalysis: {},
            selectedTempAnalysis: {},
            selectedAlarmAnalysis: {}
        },
        robotPartItems: [],
        robotAlarmPartMatchItems: []
    }
};

const state = GET_DEFAULT_STATE();
export default new Vuex.Store({
    state: state,
    getters: {
        getReportPage(state){
            return state.reportPage;
        },
        getBaseUrl(state) {
            return state.baseUrl;
        },

        getAuth(state) {
            return state.auth;
        },

        getAlarmTypeItems(state) {
            return state.alarmTypeItems;
        },

        getTheme(state) {
            return state.theme;
        },

        getLanguage(state) {
            return state.language;
        },

        getRenewBoothInfos(state) {
            return state.new_booth_infos;
        },

        getRenewZoneInfos(state) {
            return state.new_zone_infos;
        },

        getRenewRobotInfos(state) {
            return state.new_robot_infos;
        },

        getRcModelInfos(state) {
            return state.rc_model_infos;
        },

        getRobotToolInfos(state) {
            return state.robot_tool_infos;
        },

        getRenewReportZoneInfos(state) {
            return state.new_report_zone_infos
        },

        getNavigationFlag(state) {
            return state.navigationFlag;
        },

        getMainMenuItems(state) {
            return state.mainMenuItems;
        },

        getDiagnosticsMenuItems(state) {
            return state.diagnosticsMenuItems;
        },

        getExtraMenuItems(state) {
            return state.extraMenuItems;
        },

        getReportItems(state) {
            return state.reportItems;
        },

        getReport(state) {
            return state.reportItems.selectedReport;
        },

        getRobotPartItems(state) {
            return state.robotPartItems;
        },

        getRobotAlarmPartMatchItems(state) {
            return state.robotAlarmPartMatchItems;
        }

    },

    mutations: {
        setAuth(state, payload) {
            Object.assign(state, GET_DEFAULT_STATE({ auth: payload, language: state.language }));
        },

        setAlarmTypeItems(state, payload) {
            state.alarmTypeItems = payload;
        },

        changeTheme(state, payload) {
            state.theme = payload;
        },

        setLanguage(state, payload) {
            state.language = payload;
        },

        setRenewBoothInfos(state, payload) {
            state.new_booth_infos = payload;
        },

        setRenewZoneInfos(state, payload) {
            state.new_zone_infos = payload;
        },

        setRenewRobotInfos(state, payload) {
            state.new_robot_infos = payload
        },

        setRcModelInfos(state, payload) {
            state.rc_model_infos = payload;
        },

        setRobotToolInfos(state, payload) {
            state.robot_tool_infos = payload
        },

        setRenewReportZoneInfos(state, payload) {
            state.new_report_zone_infos = payload
        },

        resetFactoryInfos(state) {
            state.factory_id = '';
            state.booth_infos = [];
            state.zone_infos = [];
            state.robot_infos = [];
        },

        resetRenewBoothInfos(state) {
            state.new_booth_infos = [];
            state.new_zone_infos = [];
            state.new_robot_infos = [];
            state.rc_model_infos = [];
            state.robot_tool_infos = [];
        },

        resetRenewReportZoneInfos(state) {
            state.new_report_zone_infos = {}
        },

        changeNavigationFlag(state, payload) {
            state.navigationFlag = payload;
        },

        setMainMenuItems(state, payload) {
            state.mainMenuItems = payload;
        },

        setDiagnosticsMenuItems(state, payload) {
            state.diagnosticsMenuItems = payload;
        },

        setExtraMenuItems(state, payload) {
            state.extraMenuItems = payload;
        },

        initReportItems(state) {
            let keys = Object.keys(state.reportItems);
            keys.forEach(key => {
                state.reportItems[key] = "";
            })
        },

        setPaintingLabItems(state, payload) {
            let keys = Object.keys(payload);
            keys.forEach(key => {
                if(state.reportItems[key] !== undefined) {
                    state.reportItems[key] = payload[key];
                }
            })
        },

        setReportItems(state, payload){
            state.reportItems.selectedReport = payload;
        },

        setRobotPartItems(state, payload) {
            state.robotPartItems = payload;
        },

        setRobotAlarmPartMatchItems(state, payload) {
            state.robotAlarmPartMatchItems = payload;
        },

        resetAll(state, payload){
            Object.assign(state, GET_DEFAULT_STATE({...payload}));
        }
    },

    actions: {
        setFactoryId(context, payload) {
            return context.commit('setFactoryId', payload);
        },

        setAuth(context, payload) {
            return context.commit('setAuth', payload);
        },

        setAlarmTypeItems(context, payload) {
            return context.commit('setAlarmTypeItems', payload);
        },

        changeTheme(context, payload) {
            return context.commit('changeTheme', payload);
        },

        setLanguage(context, payload) {
            return context.commit('setLanguage', payload);
        },

        setBoothInfos(context, payload) {
            return context.commit('setBoothInfos', payload);
        },

        setZoneInfos(context, payload) {
            return context.commit('setZoneInfos', payload);
        },

        setRobotInfos(context, payload) {
            return context.commit('setRobotInfos', payload);
        },

        setRenewBoothInfos(context, payload) {
            return context.commit('setRenewBoothInfos', payload);
        },

        setRenewZoneInfos(context, payload) {
            return context.commit('setRenewZoneInfos', payload);
        },

        setRenewRobotInfos(context, payload) {
            return context.commit('setRenewRobotInfos', payload);
        },

        setRcModelInfos(context, payload) {
            return context.commit('setRcModelInfos', payload);
        },

        setRobotToolInfos(context, payload) {
            return context.commit('setRobotToolInfos', payload);
        },

        setRenewReportZoneInfos(context, payload){
            return context.commit('setRenewReportZoneInfos', payload);
        },

        resetFactoryInfos(context) {
            return context.commit('resetFactoryInfos');
        },

        resetRenewBoothInfos(context) {
            return context.commit('resetRenewBoothInfos');
        },

        resetRenewReportZoneInfos(context){
            return context.commit('resetRenewReportZoneInfos');
        },

        changeNavigationFlag(context, payload) {
            return context.commit('changeNavigationFlag', payload);
        },

        setMainMenuItems(context, payload) {
            return context.commit('setMainMenuItems', payload);
        },

        setDiagnosticsMenuItems(context, payload) {
            return context.commit('setDiagnosticsMenuItems', payload);
        },

        setExtraMenuItems(context, payload) {
            return context.commit('setExtraMenuItems', payload);
        },

        initReportItems(context, payload) {
            return context.commit('initReportItems', payload);
        },

        setReportItems(context, payload){
            context.commit('setReportItems', payload)
        },

        setRobotPartItems(context, payload) {
            context.commit('setRobotPartItems', payload);
        },

        setRobotAlarmPartMatchItems(context, payload) {
            context.commit('setRobotAlarmPartMatchItems', payload);
        },

        resetALL(context, payload){
            context.commit('resetAll', payload)
        }
    },
    plugins: [
        createPersistedState({
            path:[]
        })
    ]
})
