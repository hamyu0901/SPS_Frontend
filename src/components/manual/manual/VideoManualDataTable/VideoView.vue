<template>
    <div v-bind:view="doShow">
        <video width="100%" controls></video>
    </div>
</template>
    
<script>
import {mapGetters} from 'vuex'
export default {
    props: ['videoFile'],
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
        }),
        doShow() {
            let video = document.querySelector('video');
            if (this.videoFile != "") {
                video.src = this.$httpsBaseUrl + "/extra/manual/type/video/" + this.videoFile;
            }
        }
    },
    mounted() {
        
    },
    methods: {
        
    }
}
</script>

<style>

</style>
