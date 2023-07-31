<template>
    <v-form>
        <v-container>
            <v-layout>
                <v-card class="dlgArea" v-bind="initialize">
                    <div class="image">
                        <v-card-title primary-title>{{ui.title}}</v-card-title>
                        <v-img :src="ui.images" height="400px" aspect-ratio="1.7"></v-img>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.drawingNo" v-bind:placeholder="datas.drawingNo" v-model="datas.drawingNo"></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.remarks" v-bind:placeholder="datas.remarks" v-model="datas.remarks"></v-text-field>
                    </div>
                    <div class="prodInfo pl-2 pr-4">
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.prodNo" v-bind:placeholder="datas.prodNo" v-model="datas.prodNo" height="30px"></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.model" v-bind:placeholder="datas.model" v-model="datas.model" height="30px"></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.prodName" v-bind:placeholder="datas.prodName" v-model="datas.prodName" height="30px"></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.mainGroup" v-bind:placeholder="datas.mainGroup" v-model="datas.mainGroup" height="30px"></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.serveGroup" v-bind:placeholder="datas.serveGroup" v-model="datas.serveGroup" height="30px"></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.usingModel" v-bind:placeholder="datas.usingModel" v-model="datas.usingModel" height="30px"></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.checkPeriod" v-bind:placeholder="datas.checkPeriod" v-model="datas.checkPeriod" height="30px" box></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.changePeriod" v-bind:placeholder="datas.changePeriod" v-model="datas.changePeriod" height="30px" box></v-text-field>
                        <v-text-field v-bind:readonly="controls.isReadOnly" v-bind:label="ui.quantity" v-bind:placeholder="datas.quantity" v-model="datas.quantity" height="30px"></v-text-field>
                    </div>
                </v-card>
            </v-layout>
            <v-card class="btnArea">
                <v-card-actions>
                    <v-btn v-show="getShowStatus()" class="modifyBtnObject" color="primary" @click="modify">
                        {{ui.changeBtn}}
                    </v-btn>
                    <v-btn class="closeBtnObject" color="primary" @click="sendClose">
                        {{ui.close}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-form>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['setStatus', 'isModify', 'partsInfo', 'partname'],
    data() {
        return {
            status: {
                create: 1,
                modify: 2,
                flag: 0
            },
            ui: {
                title: '스페어 파트',
                images: require("@/images/sample_robot.png"),
                drawingNo: '도면 번호',
                remarks: '메모',
                prodNo: '품번',
                prodName: '품명',
                model: '모델',
                mainGroup: '메인 그룹',
                serveGroup: '서브 그룹',
                usingModel: '사용중인 모델',
                checkPeriod: '점검 주기',
                changePeriod: '교체주기',
                quantity: '수량',
                modify: '수정',
                create: '생성',
                close: '닫기'
            },
            datas: {
                drawingNo: '',
                remarks: '',
                prodNo: '',
                prodName: '',
                model: '',
                mainGroup: '',
                serveGroup: '',
                usingModel: '',
                checkPeriod: '',
                changePeriod: '',
                quantity: ''
            },
            controls: {
                isReadOnly: true
            }
        }
    },
    computed: {
        ...mapGetters ({
                baseUrl: 'getBaseUrl',
                getTheme: 'getTheme',
                getFactoryId: 'getFactoryId',
            }),
        initialize() {
            this.status.flag = this.setStatus;
            if (this.status.flag == 0) {
                this.controls.isReadOnly = true;
            }
            else if (this.status.flag == this.status.create) {
                this.ui.changeBtn = this.ui.create;
                this.create();
                this.controls.isReadOnly = false;
            }
            else if (this.status.flag == this.status.modify) {
                this.ui.changeBtn = this.ui.modify;
                this.controls.isReadOnly = false;
            }
            
            if (typeof this.datas === 'object') {
                this.datas = this.partsInfo;
            }
        },
    },
    methods : {
        create() {
            this.datas.model = '';
            this.datas.drawingNo = '';
            this.datas.quantity = '';
            this.datas.remarks = '';
            this.datas.checkPeriod = '';
            this.datas.changePeriod = '';
            this.datas.prodName = '';
            this.datas.prodNo = '';
        },
        modify() {
            let postDatas = {
                    productno: (this.datas.model == ' ') ? '' : this.datas.model,
                    drawingno: (this.datas.drawingNo == ' ') ? '' : this.datas.drawinNo,
                    remainamount: (this.datas.quantity == ' ') ? 0 : this.datas.quantity,
                    remarks: (this.datas.remarks == ' ') ? '' : this.datas.remarks,
                    checkcycle: (this.datas.checkPeriod == ' ') ? 0 : this.datas.checkPeriod,
                    replacementcycle: (this.datas.changePeriod == ' ') ? 0 : this.datas.changePeriod,
                    partname: (this.datas.prodName == ' ') ? '' : this.datas.prodName,
                    partno: (this.datas.prodNo == ' ') ? '' : this.datas.prodNo
                }
            if (this.status.flag == this.status.create) {
                this.$http.post(`${this.baseUrl}/sparepart/data/create`, postDatas)
                    .then((result) => {
                        if (result.data == '') {

                        }
                        else {

                        }
                    }).catch((error) => {

                    })
            }
            else if (this.status.flag == this.status.modify) {
                this.$http.post(`${this.baseUrl}/sparepart/data/modify`, postDatas)
                    .then((result) => {
                        if (result.data == '') {

                        }
                        else {

                        }
                    }).catch((error) => {

                    })
            }        
        },
        clear() {
            this.datas.model = '';
            this.datas.drawingNo = '';
            this.datas.quantity = '';
            this.datas.remarks = '';
            this.datas.checkPeriod = '';
            this.datas.changePeriod = '';
            this.datas.prodName = '';
            this.datas.prodNo = '';
            this.status.flag = 0;
        },
        sendClose() {
            this.clear();
            this.$emit('sparePartDialogClosed');
        },
        getShowStatus() {
            if (this.status.flag == 0) {
                return false;
            }
            else {
                return true;
            }
        }
    }
}
</script>

<style scoped>
    .dlgArea {
        display: flex;
        justify-content: space-between;
        height: 730px;
        width: 755px;
        background-color: #171A29;
    }
    .image {
        position: relative;
        top: 30px;
        left: 30px;
        width: 320px;
        height: 695px;
        background-color: #171A29;
    }
    .prodInfo {
        position: relative;
        top: 85px;
        left: -0px;
        width: 390px;
        height: 640px;
        background-color: #171A29;
    }
    .btnArea {
        position: relative;
        top: 0px;
        left: -7px;
        width: 753px;
        height: 50px;
        background-color: #171A29;
    }
    .modifyBtnObject {
        /* left: 470px; */
        background-color: #171A29 !important;
    }
    .closeBtnObject {
        /* left: 485px; */
        background-color: #171A29 !important;
    }
</style>