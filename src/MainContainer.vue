<template>
    <v-app id="mainContainer" :dark="getTheme">
        <v-toolbar class="header elevation-0"  fixed app tabs height="40" :color="headerColor" clipped-left :inverted-scroll="tabShowFlag">
            <a><img class="sideIcon pr-4" src="@/images/tabicons/toolbar_side_icon.png" @click.stop="navigationFlagClicked" v-if="diagnosticsFlag"/></a>
            <h1 class="main-title">Smart Paint Shop</h1>
            <v-toolbar-items>
                <v-tabs height="40" hide-slider :color="headerColor">
                    <v-tab
                        class="pr-3 tabItem"
                        v-bind:style="ui.tabStyle"
                        active-class="dy_mainTab_over--text"
                        :ripple="false"
                        v-for="(tabItem, index) in tabItems"
                        v-show="tabItem.show"
                        :key="index"
                        :to="tabItem.target"
                        @click="tabClicked(tabItem)"
                    >
                        <a href="@"><img class="pt-1 pr-2" :src='renderTabImage(tabItem)' ref="tabIcons" /></a>
                        <p :class="['tabTitle', 'pt-3', `${activePath === tabItem.id? 'tab-title__over' : 'tab-title__normal'}`]"> {{$t('tabtitle.'+tabItem.id)}} </p>
                    </v-tab>
                </v-tabs>
            </v-toolbar-items>
            <v-spacer/>
            <a class="pr-2"><img class="pt-1" src="@/images/tabicons/tab_export.png"  @click="exportBtnClickHandler"/></a>
            <ExportModal
                v-if="flag.export"
                title="EXPORT"
                :is-open="flag.export"
                @onCloseModal="exportModalCloseHandler"
            />
            <a class="pr-2"><img class="pt-1" src="@/images/tabicons/tab_setting.png"  @click="settingBtnClicked"/></a>
            <span class="mainTabSpan pr-3">{{ui.userid}}</span>
            <span class="mainTabSpan pr-3">{{ui.version}}</span>
            <a><img class="pt-2" src="@/images/tabicons/tab_logout.png" @click="logoutClicked"/></a>
            <v-dialog v-model="dialog" hide-overlay persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Reconnecting...
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-dialog v-model="flag.settingDlg" hide-overlay persistent width="1800">
                <setting-dlg
                  v-if="flag.settingDlg"
                  v-on:settingValues="getSettingValues"
                  v-on:closeSettingDlg="closeSettingDlg"
                ></setting-dlg>
            </v-dialog>
        </v-toolbar>
        <v-content id="main">
            <v-tabs-items touchless>
                <v-tab-item><router-view /></v-tab-item>
            </v-tabs-items>
        </v-content>
        <v-footer dark app :color="footerColor">
            <span id="footerText" class="footerTextColor pr-5">&copy; {{ui.year}} <span id="footerCIText" class="footerNameColor">DOOLIM-YASKAWA.</span> All rights reserved.</span>
            <v-spacer/><clock></clock>
        </v-footer>
    </v-app>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import clock from '@/commons/DigitalClock'
import SettingDlg from '@/commons/SettingDlg'
import ExportModal from "@/commons/export/exportmodal/ExportModal.vue";
import { LicenseManager } from "ag-grid-enterprise";
import { getUserInfoAPI } from "@/api/authAPI";
import { getRobotPartItemsAPI, getRobotAlarmPartMatchItemsAPI } from "@/api/infoAPI";

export default {
    components: {clock, SettingDlg, ExportModal},
    data() {
        return {
            ui: {
                userid: '',
                version: '',
                year: '',
                tabStyle: null,
            },
            dialog: false,
            tabShowFlag: false,
            drawer: true,
            tabItems: [],
            headerColor: '',
            footerColor: '',
            diagnosticsFlag: false,
            flag: {
                alive: true,
                settingDlg: false,
                export: false
            },
            activePath: ''
        }
    },
    sockets: {
        connect() {
            if (this.flag.alive == false) {
                this.flag.alive = true;
                this.$networkError('Network Error');
            }
            this.dialog = false;
        },
        disconnect() {
            console.log('socket disconnected')
        },
    },
    created() {
        this.getFactoryInfos();
        this.setLanguage();
        this.setCopyRight();
        this.setLicenseKey();
        this.setActivePath();
        this.getAlarmTypeItems();
        this.getRobotPartInfos();
        this.tabItems = this.getMainMenuItems ? this.getMainMenuItems : [];
    },
    mounted() {
        this.setVersion();
        this.getUserID();
        this.initializeStyle();
        this.setLicenseKey();
    },

    computed: {
        ...mapGetters({
            getTheme: 'getTheme',
            getLanguage: 'getLanguage',
            getFactoryId: 'getFactoryId',
            getMainMenuItems: 'getMainMenuItems',
        }),
        renderTabImage() {
            return(tabItem) => {
                return this.activePath === tabItem.id ? tabItem.overImg : tabItem.normalImg;
            }
        }
    },

    destroyed() {
        this.destorySocket();
    },

    methods: {
        setActivePath() {
            this.activePath = this.$route.path.split('/')[2];
        },

        setLicenseKey(){
             this.$http.get(`/info/license/key`).then(response=>{
                LicenseManager.setLicenseKey(response.data);
            })
        },
        ...mapActions({
            resetALL: 'resetALL',
        }),
        initializeStyle() {
            const main = document.querySelector('#main');
            main.style.backgroundColor = this.$style.mainContainerMainStyle;

            this.ui.tabStyle = this.$style.getTabMenuStyle();
            this.headerColor = this.$style.maincontainer.header;
            this.footerColor = this.$style.mainContainerFooterStyle;

            const footerText = document.querySelector('#footerText');
            footerText.style.color = this.$style.mainContainerFooterTextStyle.copyright;

            const footerCIText = document.querySelector('#footerCIText');
            footerCIText.style.color = this.$style.mainContainerFooterTextStyle.CI;

            document.documentElement.style.setProperty("--mainTabSpanColor", this.$style.maincontainer.menuItemFontColor);
        },


        destorySocket() {
            this.$socket.emit('disconnect');
        },

        setVersion() {
            this.$http.get(`/auth/ver`).then((result) => {
               if (result.data == '') {

               }
               else {
                    this.$release.setVersion(result.data);
                    this.ui.version = this.$release.getVersion();
               }
            }).catch((error) => {

            })
        },

        getUserID() {
            getUserInfoAPI().then(result => {
                this.ui.userid = result.data;
            }).catch(error => {
                console.log(error);
            })
        },

        setCopyRight() {
            this.$http.get(`/info/copyright`).then((result) => {
                if (result.data === '') {
                    throw new Error('No CopyRight');
                }
                this.ui.year = result.data;
            }).catch((error) => {
                this.$log.error(error);
            });
        },

        //팩토리 정보 불러오기
        getFactoryInfos() {
            Promise.all([
            this.$http.get(`/info/renew/booths`),
            this.$http.get(`/info/renew/zones`),
            this.$http.get(`/info/renew/robots`),
            this.$http.get(`/info/rc/model`),
            this.$http.get(`/info/robot/tool`),
            ])
            .then(([resNewBooths, resNewZones, resNewRobots, resRcModelInfos, resRobotToolInfos]) => {
                this.$store.dispatch('resetRenewBoothInfos');
                this.$store.dispatch('setRenewBoothInfos', resNewBooths.data);
                this.$store.dispatch('setRenewZoneInfos', resNewZones.data);
                this.$store.dispatch('setRenewRobotInfos', resNewRobots.data);
                this.$store.dispatch('setRcModelInfos', resRcModelInfos.data);
                this.$store.dispatch('setRobotToolInfos', resRobotToolInfos.data);
            })
        },

        getRobotPartInfos() {
            Promise.all([getRobotPartItemsAPI(), getRobotAlarmPartMatchItemsAPI()])
            .then(([robotPartItemsRes, robotAlarmPartMatchItemsRes]) => {
                this.$store.dispatch('setRobotPartItems', robotPartItemsRes.data);
                this.$store.dispatch('setRobotAlarmPartMatchItems', robotAlarmPartMatchItemsRes.data);
            })
            .catch(error => {
                console.error(error);
            })
        },

        getAlarmTypeItems() {
            this.$http.get('/info/alarm/type').then(res => {
                this.$store.dispatch('setAlarmTypeItems', res.data);
            }).catch(error => {
                console.log(error);
                this.$store.dispatch('setAlarmTypeItems', []);
            })
        },

        tabClicked(selectedTabItem) {
            this.diagnosticsFlag = (selectedTabItem.id === 'diagnostics' || selectedTabItem.id === 'extra');
            this.activePath = selectedTabItem.id;
        },

        navigationFlagClicked() {
            this.drawer = !this.drawer;
            this.$store.dispatch('changeNavigationFlag', this.drawer);
        },

        settingBtnClicked(){
            this.flag.settingDlg = true;
        },

        logoutClicked() {
            this.$http.get(`/auth/logout`, {}).then((result) => {
                    if (result.data == 'logout') {
                        this.resetALL({ language: this.getLanguage });
                        this.$router.push('/login');
                        this.$notify({
                            group: 'push',
                            text: 'Log out',
                            type: 'alarm'
                        });
                    }
                }).catch((error) => {
                    this.$log.error(error);
                })
        },

        changeTheme(themeFlag) {
            this.$store.dispatch('changeTheme', themeFlag);
        },

        setLanguage() {
            this.$language();
        },

        getSettingValues(settingValues) {
            this.$emit('themeItem', settingValues.theme);
            this.$emit('languageItem', settingValues.multilingual);
        },

        closeSettingDlg() {
            this.flag.settingDlg = false;
        },

        exportBtnClickHandler() {
            this.flag.export = true;
        },

        exportModalCloseHandler() {
            this.flag.export = false;
        }
    }
}
</script>

<style scoped lang="scss">
    @import '@/commons/scss/common.scss';
    @import './maincontainer';
</style>
