<template>
    <v-layout column>
        <v-layout wrap row>
            <a>
                <img class="pt-1 pl-2 pr-1" :src="ui.sectorIcon"/>
            </a>
            <v-flex class="pl-2 pr-2" lg2>
                <input 
                    ref="inputAlarmCode"
                    class="alarmInfoInput"
                    :placeholder="ui.inputPlaceHolder"
                    v-model="data.alarmCode"
                    @keyup.enter="searchBtnClicked"
                >
            </v-flex>
            <v-btn class="ml-2 searchBtn" :color="ui.color.searchBtn" @click="searchBtnClicked">
                <a class="pt-1"><img :src="ui.searchBtnIcon"></a>
            </v-btn>
        </v-layout>
        <v-layout class="mt-3" :style="alarmInfosLayout">
            <v-flex lg12>
                <v-layout v-if="!data.searchFlag" fill-height justify-center align-center column>
                    <a class="alarmIcons"><img :src="ui.alarmSearchIcon"></a>
                    <p class="pt-5 headline alarmPhrases" :style="alarmPhraseStyle">{{data.alarmSearchPhrase}}</p>
                </v-layout>
                <div v-if="data.alarm_type == 0">
                    <v-card class="pt-4 pb-5 mb-3" :color="ui.color.vcard" v-for="(alarmInfo, index) in data.alarmInfos" :key="index">
                        <v-card-title class="pr-5 pl-5" primary-title>
                            <v-layout>
                                <v-btn large round outline :color="ui.color.vbtn" class="alarmTitle headline mb-0">{{data.alarmTitle +" "+alarmInfo.alarm_code}}</v-btn>
                                <v-spacer/>
                                <p class="pt-1">{{setManual(alarmInfo)}}</p>
                                <v-btn small fab flat class="ml-2 manualBtn" :color="ui.color.vbtn" :disabled="checkManual(alarmInfo)" @click="manualBtnClicked">
                                     <a class="pb-1"><img :src="checkManualIcon(alarmInfo)"></a>
                                </v-btn>
                            </v-layout>
                        </v-card-title>
                        <v-list class="pl-5 pr-5 alarmInfoList">
                            <v-layout column v-for="(robotAlarmTitle, index) in Object.keys(data.robotAlarmTitleInfos)" :key="index">
                                <v-layout class="pl-3 pr-3 pt-3" wrap>
                                    <v-flex lg1 md12 xs12><h2 class="subheading alarmListTitle">- {{data.robotAlarmTitleInfos[robotAlarmTitle]}} :</h2></v-flex>
                                    <v-flex lg11 md12 xs12><p class="subheading pl-3">{{alarmInfo[robotAlarmTitle]}}</p></v-flex>
                                </v-layout>
                                <v-divider/>
                            </v-layout>
                            <div>
                                <v-layout class="pl-3 pr-3 pt-3" wrap>
                                    <v-flex lg1 md12 xs12><h2 class="subheading alarmListTitle">- {{data.causeCount}} :</h2></v-flex>
                                    <v-flex lg11 md12 xs12  v-if="Array.isArray(alarmInfo.cause)" ><p class="subheading pl-3">{{alarmInfo.cause.length}}</p></v-flex>
                                    <v-flex lg11 md12 xs12  v-else ><p class="subheading pl-3">{{1}}</p></v-flex>
                                </v-layout>
                                <v-divider/>
                            </div>
                        </v-list>
                        <v-card flat class="pl-5 pr-5" :color="ui.color.alarmDetailList">
                            <v-layout class="pl-3 pr-3 pt-3 alarmDetailList" column v-if="Array.isArray(alarmInfo.cause) == false">
                                <v-layout column>
                                    <h2 class="subheading">- {{data.robotAlarmDetailTitleInfos.cause + " " + 1}} :</h2>
                                    <p class="subheading pl-3">{{alarmInfo.cause}}</p>
                                </v-layout>
                                <v-layout column>
                                    <h2 class="subheading">- {{data.robotAlarmDetailTitleInfos.remedy + " " + 1}} :</h2>
                                    <p class="subheading pl-3" v-html="alarmRemedyConvert(alarmInfo.remedy)"></p>
                                </v-layout>
                            </v-layout>
                            <v-layout class="pl-3 pr-3 pt-3 alarmDetailList" v-else column v-for="index in alarmInfo.cause.length" :key="index">
                                <v-layout column>
                                    <h2 class="subheading">- {{data.robotAlarmDetailTitleInfos.cause + " " + index}} :</h2>
                                    <p class="subheading pl-3">{{alarmInfo.cause[index-1]}}</p>
                                </v-layout>
                                <v-layout column>
                                    <h2 class="subheading">- {{data.robotAlarmDetailTitleInfos.remedy + " " + index}} :</h2>
                                    <p class="subheading pl-3" v-html="alarmRemedyConvert(alarmInfo.remedy[index-1])"></p>
                                </v-layout>
                                <v-divider v-if="index < alarmInfo.cause.length" :color="ui.color.vdivider"/>
                            </v-layout>
                        </v-card>
                    </v-card>
                </div>
                <div v-else-if="data.alarm_type == 4">
                    <v-card class="pt-4 pb-5 mb-3" :color="ui.color.vcard" v-for="(alarmInfo, index) in data.alarmInfos" :key="index">
                        <v-card-title class="pr-5 pl-5" primary-title>
                            <v-layout>
                                <v-btn large round outline :color="ui.color.vbtn" class="alarmTitle headline mb-0">{{data.alarmTitle +" "+alarmInfo.alarm_code}}</v-btn>
                                <v-spacer/>
                                <p class="pt-1">{{setManual(alarmInfo)}}</p>
                                <v-btn small fab flat class="ml-2 manualBtn" :color="ui.color.vbtn" :disabled="checkManual(alarmInfo)" @click="manualBtnClicked">
                                     <a class="pb-1"><img :src="checkManualIcon(alarmInfo)"></a>
                                </v-btn>
                            </v-layout>
                        </v-card-title>
                        <v-list class="pl-5 pr-5 alarmInfoList">
                            <v-layout column v-for="(plcAlarmTitle, index) in Object.keys(data.plcAlarmTitleInfos)" :key="index">
                                <v-layout class="pl-3 pr-3 pt-3" wrap>
                                    <v-flex lg1 md12 xs12><h2 class="subheading alarmListTitle">- {{data.plcAlarmTitleInfos[plcAlarmTitle]}} :</h2></v-flex>
                                    <v-flex lg11 md12 xs12><p class="subheading pl-3">{{alarmInfo[plcAlarmTitle]}}</p></v-flex>
                                </v-layout>
                                <v-divider/>
                            </v-layout>
                        </v-list>
                    </v-card>
                </div>
                <v-layout v-else fill-height justify-center align-center column>
                    <a class="alarmIcons"><img :src="ui.alarmNoneIcon"></a>
                    <p class="pt-5 headline alarmPhrases" :style="alarmPhraseStyle">{{data.alarmNonePhrase}}</p>
                </v-layout>
                <v-dialog v-if='data.pdfDlgFlag' v-model="data.pdfDlgFlag" :width="ui.pdfDlgWidth" persistent @keydown.esc="closePdfDlg">
                    <v-btn class="mt-2 ml-2" fab small fixed @click="closePdfDlg">
                        <v-icon>clear</v-icon>
                    </v-btn>
                    <pdf-view
                        v-bind:pdfFile='data.alarmInfos[0].filename' 
                        v-bind:manualtype="'trouble'"
                        v-on:closeDlg="closePdfDlg"
                    ></pdf-view>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import PdfView from '@/commons/PdfView'
export default {
    components: {PdfView},
    props: ['nodeInfo'],
    data() {
        return {
            ui: {
                sectorIcon: require("@/images/selector_icon.png"),
                searchBtnIcon: require("@/images/search_icon.png"),
                alarmSearchIcon: "",
                alarmNoneIcon: "",
                inputPlaceHolder: this.$t(`alarm.child.alarmInfos.inputPlaceHolder`),
                manualCheckIcon: {normal: require("@/images/manual_check_normal.png"), over: require("@/images/manual_check_over.png")},
                alarmInfosStyle: null,
                alarmPhraseStyle: null,
                pdfDlgWidth: "850px",
                color: {
                    searchBtn: '',
                    vcard: '',
                    vbtn: '',
                    alarmDetailList: '',
                    vdivider: '',
                }
            },
            data: {
                robotAlarmTitleInfos: {
                    alarm_code: this.$t(`alarm.child.alarmInfos.robotAlarmTitleInfos.alarmcode`),
                    subcode: this.$t(`alarm.child.alarmInfos.robotAlarmTitleInfos.subcode`),
                    alarm_type: this.$t(`alarm.child.alarmInfos.robotAlarmTitleInfos.alarmtype`),
                    alarmname: this.$t(`alarm.child.alarmInfos.robotAlarmTitleInfos.alarmname`),
                    contents: this.$t(`alarm.child.alarmInfos.robotAlarmTitleInfos.contents`),
                    meaning: this.$t(`alarm.child.alarmInfos.robotAlarmTitleInfos.meaning`),
                   
                },
                robotAlarmDetailTitleInfos: {
                    cause: this.$t(`alarm.child.alarmInfos.robotAlarmDetailTitleInfos.cause`),
                    remedy: this.$t(`alarm.child.alarmInfos.robotAlarmDetailTitleInfos.remedy`)
                },
                plcAlarmTitleInfos: {
                    alarm_code: this.$t(`alarm.child.alarmInfos.plcAlarmTitleInfos.alarm_code`),
                    alarm_type: this.$t(`alarm.child.alarmInfos.plcAlarmTitleInfos.alarm_type`),
                    message: this.$t(`alarm.child.alarmInfos.plcAlarmTitleInfos.message`)
                },
                window: {
                    height: 0
                },
                searchFlag: false,
                alarmSearchPhrase: this.$t(`alarm.child.alarmInfos.alarmSearchPhrase`),
                alarmNonePhrase: this.$t(`alarm.child.alarmInfos.alarmNonePhrase`),
                alarmTitle: this.$t(`alarm.child.alarmInfos.alarmTitle`),
                alarmCode: "",
                causeCount: this.$t(`alarm.child.alarmInfos.robotAlarmTitleInfos.causecount`),
                remedyPattern: "([`(`]\0?[1-9][`)`])",
                alarmInfos: [],
                alarmTypes: [],
                alarm_type: '',
                pdfDlgFlag: false
            }
        }
    },

    computed: {
        ...mapGetters ({
            getTheme: 'getTheme'
        }),

        alarmInfosLayout() {
            this.ui.alarmInfosStyle = {
                height: (this.data.window.height-175)+"px",
                overflowY: 'auto',
                overflowX: 'unset'
            }
            return this.ui.alarmInfosStyle;
        },

        alarmPhraseStyle() {
            this.ui.alarmPhraseStyle = {
                color: this.$style.alarm.alarmInfosItemAlarmPhraseStyleColor,
                fontWeight: "bold"
            }
            return this.ui.alarmPhraseStyle;
        }
    },

    created() {
        window.addEventListener('resize', this.handleResize);
        this.alarmPhraseImageStyle();
        this.handleResize();
    },

    mounted() {
        this.setAlarmType();
        this.initializeStyle();
    },

    methods: {
        initializeStyle() {
            this.ui.color.searchBtn = this.$style.alarm.alarmInfosItemSearchBtn;
            this.ui.color.vcard = this.$style.alarm.alarmInfosItemVcard;
            this.ui.color.vbtn = this.$style.alarm.alarmInfosItemVbtn;
            this.ui.color.alarmDetailList = this.$style.alarm.alarmInfosItemAlarmDetailList;
            this.ui.color.vdivider = this.$style.alarm.alarmInfosItemVdivider;
            document.documentElement.style.setProperty("--inputBackgroundColor",this.$style.alarm.inputStyleBackgroundColor);
            document.documentElement.style.setProperty("--inputBorder",this.$style.alarm.inputStyleBorder);
            document.documentElement.style.setProperty("--alarmInfoListBackgroundColor", this.$style.alarm.alarmInfosItemAlarmInfoListBackgroundColor);
            document.documentElement.style.setProperty("--alarmDetailListBackgroundColor", this.$style.alarm.alarmInfosItemAlarmDetailListBackgroundColor);
        },

        handleResize() {
            this.data.window.height = window.innerHeight;
        },

        alarmPhraseImageStyle() {
            if(this.getTheme === true) {
                this.ui.alarmSearchIcon = require("@/images/alarm_search_dark.png");
                this.ui.alarmNoneIcon = require("@/images/alarm_none_dark.png");
            } else {
                this.ui.alarmSearchIcon = require("@/images/alarm_search_light.png");
                this.ui.alarmNoneIcon = require("@/images/alarm_none_light.png");
            }
        },

        setAlarmType() {
            this.$http.get(`/diagnostics/alarmstatistics/data/alarm/type`)
            .then((result) => {
                if (result.data == '') {

                }
                this.data.alarmTypes = result.data;
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        getAlarmType(alarmType) {
            for(let i = 0; i < this.data.alarmTypes.length; i++) {
                if(this.data.alarmTypes[i].id == alarmType) {
                    return this.data.alarmTypes[i].name;
                }
            }
        },

        setManual(alarmInfo) {
            if(alarmInfo.filename != null) {
                return alarmInfo.filename + ".pdf";
            } 
            else {
                return this.$t(`alarm.child.alarmInfos.noManualText`);
            }
        },

        checkManual(alarmInfo) {
            if(alarmInfo.filename != null) {
                return false;
            } 
            else {
                return true;
            }
        },

        checkManualIcon(alarmInfo) {
            if(alarmInfo.filename != null) {
                return this.ui.manualCheckIcon.over;
            } 
            else {
                return this.ui.manualCheckIcon.normal;
            }
        },

        manualBtnClicked() {
            this.data.pdfDlgFlag = true;
        },

        closePdfDlg() {
            this.data.pdfDlgFlag = false;
        },

        searchBtnClicked() {
            if(this.data.alarmCode != "") {
                this.data.searchFlag = true;
                let postDatas = {};
                this.data.alarm_type = '';
                this.data.alarmInfos = [];
                let alarm_type = '';
                postDatas['alarmcode'] = this.data.alarmCode;
                this.$http.post(`/alarmview/manual/type`, postDatas).then((result) => {
                    if(result.data != "") {
                        this.data.alarm_type = result.data[0].alarmtype;
                        alarm_type = this.getAlarmType(result.data[0].alarmtype);
                        if(result.data[0].alarmtype == 0) {
                            this.getRobotAlarmInfo(postDatas, alarm_type);
                        }
                        else if(result.data[0].alarmtype == 4) {
                            this.getPlcAlarmInfo(postDatas, alarm_type);
                        }
                    }    
                }).catch((error) => {
                    this.$log.error(error);
                })
            }
            else {
                this.data.alarm_type = "";
                this.data.searchFlag = false;
                this.data.alarmInfos = [];
            }
        },

        getRobotAlarmInfo(postDatas, alarm_type) {
            this.$http.post(`/alarmview/manual/type/robot`, postDatas).then((result) => {
                if(result.data != "") {
                    Object.keys(result.data).forEach(function eachKey(key) {
                        result.data[key].alarm_code = postDatas.alarmcode;
                        result.data[key].alarm_type = alarm_type;
                    });
                   this.settingRobotAlarmInfos(result.data);
                } 
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        getPlcAlarmInfo(postDatas, alarm_type) {
            this.$http.post(`/alarmview/manual/type/plc`, postDatas).then((result) => {
                if(result.data != "") {
                    Object.keys(result.data).forEach(function eachKey(key) {
                        result.data[key].alarm_code = postDatas.alarmcode;
                        result.data[key].alarm_type = alarm_type;
                    });
                    this.data.alarmInfos = result.data;
                } 
            }).catch((error) => {
                this.$log.error(error);
            })
        },

        settingRobotAlarmInfos(alarmInfos) {
            this.data.alarmInfos = [];
            for(let i = 0; i < alarmInfos.length; i++) {
                if(this.data.alarmInfos.length == 0) {
                    this.data.alarmInfos.push(alarmInfos[i]);
                }
                else {
                    if(alarmInfos[i-1].subcode == alarmInfos[i].subcode) {
                        if(Array.isArray(this.data.alarmInfos[this.data.alarmInfos.length-1].cause) == false) {
                            this.data.alarmInfos[this.data.alarmInfos.length-1].cause = this.data.alarmInfos[this.data.alarmInfos.length-1].cause.split();
                            this.data.alarmInfos[this.data.alarmInfos.length-1].remedy = this.data.alarmInfos[this.data.alarmInfos.length-1].remedy.split();
                        }
                        this.data.alarmInfos[this.data.alarmInfos.length-1].cause.push(alarmInfos[i].cause);
                        this.data.alarmInfos[this.data.alarmInfos.length-1].remedy.push(alarmInfos[i].remedy);
                    } 
                    else {
                        this.data.alarmInfos.push(alarmInfos[i]);    
                    }
                }
            }
        },

        alarmRemedyConvert(remedy) {
            let remedyPattern = new RegExp(this.data.remedyPattern);
            let tempRemedy = remedy.split(remedyPattern);
            let remedyStr = "";
            if(tempRemedy.length != 1) {
                for(let i = 1; i < tempRemedy.length; i++) {
                    if(i % 2 != 0) {
                        remedyStr += tempRemedy[i] + tempRemedy[i+1] + "<br />";
                    }
                }
                return remedyStr;
            }
            else {
                return remedy;
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './alarminfos';
</style>
