<template>
    <div>
        <pdf
           v-for="page in datas.numPages"
           :key="page"
           :src="datas.src"
           :page="page"
           style="display: inline-block; width: 100%"
        >

        </pdf>
    </div>
</template>
<script>
import pdf from "vue-pdf";

export default {
    components: { pdf },
    props: {
        src : Object | null
    },
    data() {
        return {
            datas: {
                src: null,
                numPages: null
            }
        }
    },

    watch : {
        src() {
            this.setPdfFile();
        }
    },

    methods: {
        setPdfFile() {
            this.datas.src = this.src;
            this.datas.src && this.datas.src.promise.then(pdf => {
                this.datas.numPages = pdf.numPages;
            });
        }
    }

}
</script>