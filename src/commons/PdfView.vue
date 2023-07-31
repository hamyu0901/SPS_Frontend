<template>
        <div v-bind:view="doPrint">
            <pdf
                v-for="i in numPages"
                :key="i"
                :src="src"
                :page="i"
                style="display: inline-block; width: 100%"         
            ></pdf>
        </div>
    </template>
        
    <script>
    import {mapGetters} from 'vuex'
    import pdf from 'vue-pdf'
    export default {
        components: { pdf },
        props: ['pdfFile', 'manualtype', 'pdfViewFlag'],
        data() {
            return {
                src: '',
                numPages: undefined
            }
        }, 
        computed: {
            ...mapGetters ({
                baseUrl: 'getBaseUrl',
            }),
            doPrint() {
                if (this.pdfViewFlag == true) {
                    this.getMaintenanceDBFile();
                }
                else if (this.manualtype != undefined){
                    this.getDBFile();
                }
            }
        },
        mounted() {
                
        },
        methods: {
            initSrc() {
                this.src = null;
            },
            getDBFile() {
                this.initSrc();
                if (typeof this.pdfFile === 'string' && this.pdfFile != '') {
                    this.$http.get(`${this.baseUrl}/extra/manual/type/${this.manualtype}/${this.pdfFile}`, { responseType: 'blob' }).then((result) => {
                        if (result.data == '') {
                            this.$popmsg(this.$t(`pdfview.popmsg.manualError`));
                            this.$emit('closeDlg');
                        }
                        else if (result.data.size > 1000000) {
                            this.$popmsg(this.$t(`pdfview.popmsg.overSizeMessage`));
                            let blob = new Blob([result.data], { type: 'application/pdf' });
                            this.$saveAs(blob, this.pdfFile);
                            this.$emit('closeDlg');
                        }
                        else {
                            this.src = pdf.createLoadingTask(URL.createObjectURL(new Blob([result.data], { type: 'application/pdf' })));
                            this.numPages = undefined;
                            this.setting();
                        }
                    }).catch((error) => {
                        this.$popmsg(this.$t(`pdfview.popmsg.manualError`));
                        this.$log.error(error); 
                        this.$emit('closeDlg');
                    });
                }
            },
            getMaintenanceDBFile() {
                this.initSrc();
                if (typeof this.pdfFile === 'string' && this.pdfFile != '') {
                    this.$http.get(`${this.baseUrl}/maintenance/data/insp/${this.pdfFile}`, { responseType: 'blob' }).then((result) => {
                        this.src = pdf.createLoadingTask(URL.createObjectURL(new Blob([result.data], { type: 'application/pdf' })));
                        this.setting();
                    });
                }
            },
            setting() {
                this.src.promise.then(pdf => {
                    this.numPages = pdf.numPages;
                });
            }
        }
    }
    </script>
    
    <style>
    
    </style>
    