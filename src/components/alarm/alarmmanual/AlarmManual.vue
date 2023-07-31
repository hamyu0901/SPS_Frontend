<template>
    <v-layout column>
        <v-layout column class="ml-5 mt-5" justify-center align-center :style="alarmManualStyle">
            <v-card flat :style="alarmManualCardStyle">
                <v-layout column>
                    <v-layout wrap row justify-center align-center>
                        <v-flex class="flexText tdText" lg3 md3 xs12>
                            <p class="title">{{data.alarmTitleInfos.alarm_code + " : " + getAlarmInfo('alarm_code')}}</p>
                        </v-flex>
                        <v-flex class="flexText tdText" lg1 md1 xs1>
                            <p class="title">|</p>
                        </v-flex>
                        <v-flex class="flexText tdText" lg4 md4 xs12>
                            <p class="title">{{data.alarmTitleInfos.alarmname + " : " + getAlarmInfo('alarmname')}}</p>
                        </v-flex>
                        <v-flex class="flexText tdText" lg1 md1 xs1>
                            <p class="title">|</p>
                        </v-flex>
                        <v-flex class="flexText tdText" lg3 md3 xs12>
                            <p class="title">{{data.alarmTitleInfos.alarm_type + " : " + getAlarmInfo('alarm_type')}}</p>
                        </v-flex>
                    </v-layout>
                    <v-layout class="mt-4" justify-center align-center>
                        <v-flex lg8 md8 xs12>
                            <v-text-field
                                class="alarmManualInput"
                                v-model="data.alarmCode"
                                autofocus
                                full-width
                                outline
                                single-line
                                :error="data.searchErrorFlag"
                                :error-messages="data.searchErrorText"
                                :label="ui.inputPlaceHolder"
                                append-icon="search"
                                @keyup.enter="searchBtnClicked"
                                @click:append="searchBtnClicked"
                            >
                            </v-text-field>
                        </v-flex>
                        <file-upload accept="application/pdf" ref="fileUpload" @input="inputFile" v-model="data.files"/>
                    </v-layout>
                    <v-layout justify-center align-center>
                        <p class="title tdText">{{data.fileName}}</p>
                    </v-layout>
                    <v-layout class="mt-5" wrap row justify-center align-center>
                        <v-flex lg2 md2 xs12 class="ml-2 mr-2 mb-1">
                            <v-btn class="manualBtn" :color="ui.color.vbtn" @click="addBtnClicked" :disabled="checkSearchMaunal">
                                <v-icon class="pr-2">add</v-icon>{{data.alarmBtnTitles.search}}
                            </v-btn>
                        </v-flex>
                        <v-flex lg2 md2 xs12 class="ml-2 mr-2 mb-1">
                            <v-btn class="manualBtn" :color="ui.color.vbtn" @click="saveBtnClicked" :disabled="checkSaveManual">
                                <v-icon class="pr-2">save</v-icon>{{data.alarmBtnTitles.save}}
                            </v-btn>
                        </v-flex>
                        <v-flex lg2 md2 xs12 class="ml-2 mr-2 mb-1">
                            <v-btn class="manualBtn" :color="ui.color.vbtn" @click="deleteBtnClicked" :disabled="checkDeleteManual">
                                <v-icon class="pr-2">delete</v-icon>{{data.alarmBtnTitles.delete}}
                            </v-btn>
                        </v-flex>
                        <v-flex lg2 md2 xs12 class="ml-2 mr-2 mb-1">
                            <v-btn class="manualBtn" :color="ui.color.vbtn" @click="showBtnClicked" :disabled="checkShowManual">
                                <a><img class="pt-1 pr-2" :src='checkShowManualIcon'/></a>
                                {{data.alarmBtnTitles.show}}
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <comfirm-dlg
                        v-bind:comfirmDlgType="data.comfirmType"
                        v-bind:comfirmDlgFlag="data.comfirmDlgFlag"
                        v-on:comfirmFlag="getComfirmFlag"
                        v-on:closeFlag="data.comfirmDlgFlag = false"
                    ></comfirm-dlg>
                    <v-dialog v-if='data.pdfDlgFlag' v-model="data.pdfDlgFlag" :width="ui.pdfDlgWidth" persistent @keydown.esc="closePdfDlg">
                        <v-btn class="mt-2 ml-2 buttonItem" fab small fixed  @click="data.pdfDlgFlag = false">
                            <v-layout justify-center align-center>
                                <v-icon>clear</v-icon>
                            </v-layout>
                        </v-btn>
                        <v-layout>
                            <div v-if="data.src != ''">
                                <pdf
                                    v-for="i in data.numPages"
                                    :key="i"
                                    :src="data.src"
                                    :page="i"
                                    
                                ></pdf>
                            </div>
                            <div v-else>
                                <pdf-view
                                    v-bind:pdfFile='data.fileName.split(".pdf")[0]' 
                                    v-bind:manualtype="'trouble'"
                                    v-on:closeDlg="closePdfDlg"
                                ></pdf-view>
                            </div>
                        </v-layout>
                    </v-dialog>
                </v-layout>
            </v-card>
        </v-layout>
    </v-layout>
</template>

<script>
import pdf from 'vue-pdf'
import PdfView from '@/commons/PdfView'
import ComfirmDlg from '@/commons/ComfirmDlg'
export default {
    components: {pdf, PdfView, ComfirmDlg},
    data() {
        return {
            ui: {
                sectorIcon: require("@/images/selector_icon.png"),
                searchBtnIcon: require("@/images/search_icon.png"),
                inputPlaceHolder: this.$t(`alarm.child.alarmManual.inputPlaceHolder`),
                manualShowDisableIcon: require("@/images/manual_show_disable.png"),
                manualShowAbleIcon: require("@/images/manual_show_able.png"),
                alarmManualStyle: null,
                alarmManualCardStyle: null,
                pdfDlgWidth: "850px",
                color: {
                    vbtn: ``,
                }
            },
            data: {
                window: {
                    height: 0,
                    width: 0
                },
                alarmTitleInfos: {
                    alarm_code: this.$t(`alarm.child.alarmManual.alarmTitleInfos.alarm_code`),
                    alarmname: this.$t(`alarm.child.alarmManual.alarmTitleInfos.alarmname`),
                    alarm_type: this.$t(`alarm.child.alarmManual.alarmTitleInfos.alarm_type`),
                },
                alarmBtnTitles: {
                    search: this.$t(`alarm.child.alarmManual.alarmBtnTitles.search`),
                    save: this.$t(`alarm.child.alarmManual.alarmBtnTitles.save`),
                    delete: this.$t(`alarm.child.alarmManual.alarmBtnTitles.delete`),
                    show: this.$t(`alarm.child.alarmManual.alarmBtnTitles.show`)
                },
                comfirmTypes: {
                    save: "save",
                    delete: "delete",
                },
                comfirmType: "",
                comfirmDlgFlag: false,
                alarmCode: "",
                alarmInfo: "",
                files: [],
                fileName: "",
                src: '',
                numPages: 0,
                uploadFlag: false,
                pdfDlgFlag: false,
                searchErrorFlag: false,
                searchErrorText: ""
            }
        }
    },
    computed: {
        alarmManualStyle() {
            this.ui.alarmManualStyle = {
                height: (this.data.window.height-175)+"px",
                width: 'inherit',
                backgroundColor: this.$style.alarm.alarmManualItemBackgroundColor,
            }
            return this.ui.alarmManualStyle;
        },
        alarmManualCardStyle() {
            let height = Math.round((this.data.window.height-175)/2);
            let width = Math.round(this.data.window.width/2);
            if(this.data.window.width < 600) {
                width = "100%"
            } else {
                width += "px";
            }
            if(this.data.window.height < 900) {
                height = "100%"
            } else {
                height += "px";
            }   
            this.ui.alarmManualCardStyle = {
                height: height,
                width: width,
                backgroundColor: this.$style.alarm.alarmManualItemBackgroundColor
            }
            return this.ui.alarmManualCardStyle;
        },
        checkShowManual() {
            if(this.data.alarmInfo != "" && this.data.alarmInfo.filename != null || this.data.src != "") {
                return false;
            } 
            else {
                return true;
            }
        },
        checkShowManualIcon() {
            if(this.data.alarmInfo != "" && this.data.alarmInfo.filename != null || this.data.src != "") {
                return this.ui.manualShowAbleIcon;
            } 
            else {
                return this.ui.manualShowDisableIcon;
            }
        },
        checkDeleteManual() {
            if(this.data.alarmInfo != "" && this.data.alarmInfo.filename != null) {
                return false;
            } 
            else {
                return true;
            }
        },
        checkSaveManual() {
            if(this.data.alarmInfo != "" && this.data.alarmInfo.filename == null && this.data.src != "") {
                return false;
            }
            else {
                return true;
            }
        },
        checkSearchMaunal() {
            if(this.data.alarmInfo != "" && this.data.alarmInfo.filename == null) {
                return false;
            }
            else {
                return true;
            }
        }
    },
    created() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
        this.initializeStyle();
    },
    mounted() {
        this.setAlarmType();
    },
    methods: {
        initializeStyle() {
            this.ui.color.vbtn = this.$style.alarm.alarmManualItemVbtn;
            document.documentElement.style.setProperty("--tdTextColor", this.$style.common.gridTableItemTdTextColor);
            document.documentElement.style.setProperty("--buttonBackgroundColor", this.$style.common.buttonItemBackgroundColor);
            document.documentElement.style.setProperty("--buttonColor", this.$style.common.buttonItemColor);
        },
        handleResize() {
            this.data.window.height = window.innerHeight;
            this.data.window.width = window.innerWidth;
        },
        initAlarmInfos() {
            this.data.alarmInfo = "";
            this.data.fileName = "";
        },
        initPdfInfos() {
            this.data.files = [];
            this.data.fileName = "";
            this.data.src = "";
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
        getManualType(alarmType) {
            if(alarmType == 0) {
                return "robot";
            }
            else if(alarmType == 4) {
                return "plc";
            }
        },
        getAlarmInfo(contentText) {
            if(this.data.alarmInfo != "") {
                if(this.data.alarmInfo[contentText] != undefined) {
                    return this.data.alarmInfo[contentText];
                }
                else {
                    return " - ";
                }

            } 
            else {
                return " - ";
            }
        },
        getAlarmManualFile() {
            if(this.data.alarmInfo != "" && this.data.alarmInfo.filename != null) {
                this.data.fileName = this.data.alarmInfo['filename'] + ".pdf";
            } else {
                this.data.fileName = this.$t(`alarm.child.alarmManual.noManualText`);
            }
        },
        inputFile(value) {
            if(value.length > 0) {
                if(value[0].size < 10485760) {
                    this.data.files = value;
                    if(this.data.files.length > 0) {
                        this.data.fileName = this.data.files[0].name;
                        this.data.src = pdf.createLoadingTask(URL.createObjectURL(new Blob([this.data.files[0].file], { type: 'application/pdf' })));
                    }
                }
                else {
                    this.$popmsg(this.$t(`alarm.child.alarmManual.popMsg.inputFileErrorMsg`));
                }
            }
        },
        searchBtnClicked() {
            if(this.data.alarmCode != "") {
                let postDatas = {};
                let alarm_type = '';
                let manual_type = '';
                this.initPdfInfos();
                postDatas['alarmcode'] = this.data.alarmCode;
                this.$http.post(`/alarmview/manual/type`, postDatas).then((result) => {
                    if(result.data[0].alarmtype != null) {
                        this.data.searchErrorFlag = false;
                        this.data.searchErrorText = "";
                        alarm_type = this.getAlarmType(result.data[0].alarmtype);
                        manual_type = this.getManualType(result.data[0].alarmtype);
                        this.$http.post(`/alarmview/manual/type/${manual_type}`, postDatas).then((result) => {
                            if(result.data != "") {
                                result.data[0].alarm_code = postDatas.alarmcode;
                                result.data[0].alarm_type = alarm_type;
                                this.data.alarmInfo = result.data[0];
                                this.getAlarmManualFile();
                            } 
                            else {
                                this.initAlarmInfos();
                            }
                        }).catch((error) => {
                            this.$log.error(error);
                        })
                    } 
                    else {
                        this.data.searchErrorFlag = true;
                        this.data.searchErrorText = this.$t(`alarm.child.alarmManual.searchErrorText`);
                        this.initAlarmInfos();
                    }     
                }).catch((error) => {
                    this.$log.error(error);
                })
            }
            else {
                this.initAlarmInfos();
            }
        },
        addBtnClicked() {
            this.$refs.fileUpload.$el.childNodes[3].click();
        },
        saveBtnClicked() {
           this.data.comfirmType = this.data.comfirmTypes.save;
           this.data.comfirmDlgFlag = true;
        },
        deleteBtnClicked() {
            this.data.comfirmType = this.data.comfirmTypes.delete;
            this.data.comfirmDlgFlag = true;
        },  
        showBtnClicked() {
            this.data.pdfDlgFlag = true;
            if(this.data.src != "") {
                this.data.src.then(pdf => {
                    this.data.numPages = pdf.numPages;
                });
            }
        },
        getComfirmFlag() {
            if(this.data.comfirmType == this.data.comfirmTypes.save) {
                let formData = new FormData();
                formData.append('file', this.data.files[0].file);
                this.$http.post(`/alarmview/manual/file/${this.data.alarmInfo.alarm_code}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((result) => {
                   this.searchBtnClicked();
                }).catch((error) => {
                    this.$log.error(error);
                })
                this.data.comfirmDlgFlag = false;
            }
            else {
                this.$http.delete(`/alarmview/manual/file/${this.data.alarmInfo.alarm_code}`).then((result) => {
                   this.searchBtnClicked();
                }).catch((error) => {
                    this.$log.error(error);
                })
                this.searchBtnClicked();
                this.data.comfirmDlgFlag = false;
            }
        },
        closePdfDlg() {
            this.data.pdfDlgFlag = false;
        }
    }
}
</script>

<style scoped lang="scss">
    @import './alarmmanual';
</style>
