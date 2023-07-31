<template>
    <div v-bind:view="doShow" v-bind="doExit">
        <video id="movie" width="100%" controls></video>
    </div>
</template>
    
<script>
import {mapGetters} from 'vuex'
export default {
    props: ['videoFile', 'exit'],
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
                video.type = "video/mp4";
            }
        },
        doExit() {
            if (this.exit == true) {
                var video1 = document.getElementById("movie");
                video1.pause()
            }
        }
    }
}
</script>

<style>
    
</style>
