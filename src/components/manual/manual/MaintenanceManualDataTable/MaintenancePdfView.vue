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
    props: ['pdfFile'],
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
            this.getDBFile();
        }
    },
    mounted() {
            
    },
    methods: {
        setting() {
            this.src.then(pdf => {
                this.numPages = pdf.numPages;
            });
        },
        getDBFile() {
            if (typeof this.pdfFile === 'string' && this.pdfFile != '') {
                this.$http.get(`${this.baseUrl}/extra/manual/type/maintenance/${this.pdfFile}`, { responseType: 'blob' }).then((res) => {
                    this.src = pdf.createLoadingTask(URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' })));
                    this.setting();
                }); 
            }
        }
    }
}
</script>

<style>

</style>
