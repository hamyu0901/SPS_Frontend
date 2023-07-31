<template>
    <span id="spsClockDisplay" class="clock" onload="systemTime()"></span>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    mounted() {
        this.initializeStyle();
        this.systemTime();
    },
    methods: {
        initializeStyle() {
            document.documentElement.style.setProperty("--clockColor", this.$style.common.digitalClockItemColor);
        },
        systemTime() {
            let date = new Date();
            let h = date.getHours(); // 0 - 23
            let m = date.getMinutes(); // 0 - 59
            let s = date.getSeconds(); // 0 - 59
            let session = "AM";

            if (h == 0) {
                h = 12;
            }
            if (h > 12) {
                h = h - 12;
                session = "PM";
            }
            h = (h < 10) ? "0" + h : h;
            m = (m < 10) ? "0" + m : m;
            s = (s < 10) ? "0" + s : s;

            let time = session + " " + h + ":" + m + ":" + s + " ";
            document.getElementById("spsClockDisplay").innerText = time;
            document.getElementById("spsClockDisplay").textContent = time;

            setTimeout(this.systemTime, 1000);
        }
    }
}
</script>

<style scoped lang="scss">
    @import './digitalclock';
</style>