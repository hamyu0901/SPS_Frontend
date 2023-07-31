<template>
    <v-card class="text-xs-center elevation-2 alarmInfoTableCard"  :color="cardColor" v-bind="getAlarmInfoTableDatas, calTotalCount">
        <v-data-table
            class="elevation-5 alarmInfoTable"
            hide-actions
            :headers="headers"
            :items="datas"
            :pagination.sync="pagination"
            :loading="false"
        >
            <template slot="headers" slot-scope="props">
            <tr>
                <th v-for="header in props.headers" :key="header.text">{{ header.text }}</th>
            </tr>
            </template>
            <template slot="items" slot-scope="props">
                <tr :ref="props.index" @click="itemClicked(props, pagination.page)" :key="props.index">
                    <td class="text-xs-center">{{ props.item.date }}</td>
                    <td class="text-xs-center">{{ props.item.alarmcase }}</td>
                    <td class="text-xs-center">{{ props.item.alarm_code }}</td>
                    <td class="text-xs-center">{{ props.item.count }}</td>
                    <td class="text-xs-center">{{ props.item.dt }}</td>
                </tr>
            </template>
        </v-data-table>
        <v-layout>
            <div class="pt-1 pb-1">
                <v-pagination v-model="pagination.page" :length="pages" :total-visible="5" :color="paginationColor" @input="onPageChange(pagination.page)"></v-pagination>
            </div>
            <v-spacer/>
            <p class="pt-3 pr-3">{{totalCount}} items in {{pages}} pages</p>
        </v-layout>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: ['prevDate', 'currDate', 'targetBoothId', 'targetZoneId', 'targetRobotId', 'searchFlag'],
    data() {
        return {
            dialog: false,
            cardColor: '',
            tempIndex: 0,
            pagination: {
                values: 1,
                rowsPerPage: 4,
            },
            paginationColor: '',
            headers: [
                { text: this.$t(String(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.date`)), value: 'date', sortable: false, align: 'center'},
                { text: this.$t(String(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmcase`)), value: 'alarmcase', sortable: false, align: 'center'},
                { text: this.$t(String(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmcode`)), value: 'alarm_code', sortable: false, align: 'center'},
                { text: this.$t(String(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.alarmquantity`)), value: 'count', sortable: false, align: 'center'},
                { text: this.$t(String(`diagnostics.alarmstatistics.alarmstatistics.alarminfotable.deadtime`)), value: 'dt', sortable: false, align: 'center'}
            ],
            datas: [],
            totalCount: 0
        }   
    },
    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getFactoryId: 'getFactoryId',
            getBoothInfos: 'getBoothInfos',
            getZoneInfos: 'getZoneInfos',
            getRobotInfos: 'getRobotInfos'
        }),

        getAlarmInfoTableDatas() {
            if(this.searchFlag == true) {
                var postDatas = {};
                if(this.prevDate != undefined && this.currDate != undefined && this.dateCompare(this.prevDate, this.currDate) == true) {
                    postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.prevDate, this.currDate);
                    this.$http.post(`${this.baseUrl}/data/gridtable/alarm/day`, postDatas)
                        .then((result) => {
                            if (result.data == '') {
                                this.$popmsg('[Notice] No data available.');
                                this.$emit('searchFlag', false);
                            } 
                            else {
                                this.datas = [];
                                 Object.keys(result.data).forEach(function eachKey(key) {
                                    if (typeof result.data[key].dt === 'number') {
                                        result.data[key].dt = Math.round(result.data[key].dt);
                                    }
                                });
                                this.datas = result.data;
                                if(this.datas.length % 4 != 0) {
                                    this.tempIndex = 4 - this.datas.length % 4;
                                    for(let i = 0; i < this.tempIndex; i++) {
                                        this.datas.push({date: '', alarmcase: '', alarm_code: '', count: '', dt: ''});
                                    }
                                }
                                this.$emit('searchFlag', false);
                            }
                        }).catch((error) => {
                            this.$log.error(error);   
                            this.$emit('searchFlag', false);         
                        })
                } 
                else {
                    this.$popmsg('[Notice] Check the date.');
                    this.$emit('searchFlag', false);
                }
            }
        },

        pages () {
            if (this.pagination.rowsPerPage == null ||
                this.pagination.totalItems == null
            ) return 0

            return Math.ceil(this.datas.length / this.pagination.rowsPerPage)
        },

        calTotalCount() {
            if (this.datas[0].date == '') {
                this.totalCount = 0;
            } else if(this.datas.length / 4 != 0) {
                this.totalCount = this.datas.length - this.tempIndex;
            }
        },

    },
    created() {
        this.initDataTable();
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            this.cardColor =  '#21263a';
            this.paginationColor = '#005bac !important';
        },
        initDataTable() {
            if(this.datas.length == 0) {
                for(let i = 0; i < this.pagination.rowsPerPage; i++) {
                    this.datas.push({date: '', alarmcase: '', alarm_code: '', count: '', dt: ''});
                }
            }        
        },
        
        dateCompare(preDate, currDate) {
            var preDate = new Date(preDate);
            var currDate = new Date(currDate);    
           
            return preDate <= currDate;
        },

        checkTargetDatas(boothId, zoneId, robotId, predate, currdate) {
            var postDatas = {'factoryid': `${this.getFactoryId}`, 'prevtime': predate , 'currtime': currdate};
            if(boothId != undefined) {
                postDatas['boothid'] = boothId;
            }
            
            if(zoneId != undefined) {
                postDatas['zoneid'] = zoneId;
            }
            
            if(robotId != undefined) {
                postDatas['robotid'] = robotId;
            }
            return postDatas;
        },  
        
        itemClicked(workTimeInfo, pageNum) {
            if(this.totalCount != 0) {
                this.rowHighLight(workTimeInfo.index, pageNum);
                var postDatas = {};
                postDatas = this.checkTargetDatas(this.targetBoothId, this.targetZoneId, this.targetRobotId, this.prevDate, this.currDate);
                var prevtime = new Date(workTimeInfo.item.s_time);
                prevtime.setHours(prevtime.getHours() + 9);
                
                postDatas['prevtime'] = workTimeInfo.item.s_time;
                postDatas['currtime'] = workTimeInfo.item.e_time;
                postDatas['jobname'] = workTimeInfo.item.job_name;

                this.$emit('workTimeDatas', postDatas);
                
                }
        },

        rowHighLight(index, pageNum) {
            for(let i = 0; i <Object.keys(this.$refs).length; i++){
                if(Object.keys(this.$refs)[i] == index) {
                    if(this.getTheme == true) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#3c5d99';
                    }else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#E6E6E6';
                    }
                }else {
                    if(this.getTheme == true) {
                        if(i % 2 == 0) {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                        } else {
                            this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                        }
                    }else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = 'white';
                    }
                }
            }
        },

        onPageChange(pageNum) {
            if(this.getTheme == true) {
                for(let i = 0; i <Object.keys(this.$refs).length; i++) {
                    if(i % 2 == 0) {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#2a2f44';
                    } else {
                        this.$refs[Object.keys(this.$refs)[i]].style.backgroundColor = '#21263a';
                    }
                    
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './alarminfotable';
</style>

