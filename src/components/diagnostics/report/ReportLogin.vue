<template>
    <div class="loginBox">
        <div class="alertText">
            <v-alert
                :value="true"
                type="error"
                :outline="true"
            >
            접근 권한이 없습니다.
            </v-alert>
        </div>
        <router-view/>
    </div>
</template>
<script>
export default {
    data(){
        return{
        }
    },

    mounted(){

    },
    methods: {

    }
}
</script>
<style>
.loginBox{
    margin: auto;
}
.loginText{
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
}
.alertText{
    width: 800px;
}
</style>