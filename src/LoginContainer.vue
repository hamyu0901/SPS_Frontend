<template>
    <v-app id="loginContainer" :dark="getTheme">
        <div 
        v-bind="initialize"
        id="header">
            <span id="version">{{version}}</span>
        </div>
        <v-content id="main">
            <v-layout justify-center align-center fill-height>
                <login></login>
            </v-layout>
        </v-content>
        <v-footer app :color="footerColor">
            <span id="footerText" class="footerTextColor pr-5">&copy; {{ui.year}} <span id="footerCIText" class="footerNameColor">DOOLIM-YASKAWA.</span> All rights reserved.</span>
            <v-spacer/><clock></clock>
        </v-footer>
    </v-app>
</template>

<script>
import {mapGetters} from 'vuex'
import clock from './commons/DigitalClock.vue'
import Login from './components/login/Login.vue'
export default {
    components: {
        Login,
        clock
    },
    data() {
        return {
            version: '',
            footerColor: '',
            ui: {
                year: '',
            },
            headerColor: '',
        }
    },
    created() {
        this.setCopyRight();
    },
    computed: {
        ...mapGetters ({
            baseUrl: 'getBaseUrl',
            getTheme: 'getTheme',
            getLanguage: 'getLanguage',
        }),
        initialize() {
            this.setVersion();
        }
    },
    mounted() {
        this.initializeStyle();
    },
    methods: {
        initializeStyle() {
            const version = document.querySelector('#version');
            version.style.color = this.$style.logInVersionStyle;

            const header = document.querySelector('#header');
            header.style.backgroundColor = this.$style.logIn.loginItemBackgroundColor;

            const main = document.querySelector('#main');
            main.style.backgroundColor = this.$style.mainContainerMainStyle;
            this.footerColor = this.$style.mainContainerFooterStyle;

            const footerText = document.querySelector('#footerText');
            footerText.style.color = this.$style.mainContainerFooterTextStyle.copyright;

            const footerCIText = document.querySelector('#footerCIText');
            footerCIText.style.color = this.$style.mainContainerFooterTextStyle.CI;
        },
        changeTheme(themeFlag) {
            this.$store.dispatch('changeTheme', themeFlag);
        },
        setVersion() {
            this.$http.get(`/auth/ver`).then((result) => {
               if (result.data === '') {

               }
               else {
                    this.$release.setVersion(result.data);
                    this.version = this.$release.getVersion();
               }
            }).catch((error) => {
                this.$log.error(error);
            })
        },
        setCopyRight() {
            this.$http.get(`/info/copyright`).then((result) => {
                if (result.data === '') {
                    throw new Error('No CopyRight');
                }
                this.ui.year = result.data;
            }).catch((error) => {
                this.$log.error(error);
            });
        },
    }

}
</script>

<style scoped>
   .footerTextColor {
      font-weight: bold;    
    }
    .footerNameColor {
      font-weight: bold;    
    }
</style>
