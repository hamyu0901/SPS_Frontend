<template>
    <div class="login">
        <center>
        <h1 class="ml2">DOOLIM-YASKAWA</h1>
        <v-card id="loginCard" class="elevation-5">
            <v-card-text class="pt-5 mt-5 pl-5 pr-5" @keyup.enter="loginClicked">
                <v-form @submit.prevent="loginClicked" v-bind="setUserData">
                    <div id="loginForm" v-for="(item, index) in items" :key="index">
                        <v-subheader :id="item.label"><span id="subheader">{{item.label}}</span></v-subheader>
                        <v-text-field
                        :id="item.name"
                        :background-color="backgroundColor"
                        autocomplete="off"
                        :autofocus="setAutoFocus(item.name)"
                        solo
                        :type="item.type"
                        :name="item.name"
                        :append-icon="item.icon"
                        v-model="item.text"
                        :color="ui.color"
                        :light="ui.light"
                        ></v-text-field>
                    </div>
                </v-form>
                <v-btn id="loginButton" class="mb-5" block dark :color="this.$style.logInButtonStyle" @click="loginClicked">LOG IN</v-btn>
            </v-card-text>
        </v-card>
        <span id="resolutionText">{{ui.resolution}}</span>
    </center>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import { loginAPI } from "@/api/authAPI";
import anime from 'animejs'
export default {
    data() {
        return {
            cardBackgroundColor: "",
            backgroundColor: "",
            getId: "",
            getPw: "",
            items: [
                {type: 'text', label: "ID", name: "id" , icon:"person", text: ""},
                {type: 'password', label: "PW", name: "password",  icon:"lock", text: ""}
            ],
            ui: {
                resolution: null,
                light: false,
                color: '',
            }
        }
    },
    mounted() {
        this.getResolution();
        this.initTextAnimation();
        this.initializeStyle();
    },
    computed: {
        ...mapGetters ({
          baseUrl: 'getBaseUrl',
          getTheme: 'getTheme'
        }),

        setUserData() {
            this.getId = this.items[0].text;
            this.getPw = this.items[1].text;
        }
    },
    methods: {
        initializeStyle() {
            this.ui.color = this.$style.logIn.loginItemIconColor;
            this.ui.light = this.$style.logIn.loginItemLight;
            const loginCard = document.querySelector('#loginCard');
            loginCard.style.marginBottom = this.$style.logInCardStyle.marginBottom;
            loginCard.style.width = this.$style.logInCardStyle.width;
            loginCard.style.backgroundColor = this.$style.logInCardStyle.backgroundColor;

            const loginForm = document.querySelector('#loginForm');
            loginForm.style.marginBottom = this.$style.logIn.loginForm.marginBottom;

            const loginButton = document.querySelector('#loginButton');
            loginButton.style.marginTop = this.$style.logIn.loginButton.marginTop;

            const id = document.querySelector('#ID');
            id.style.marginBottom = this.$style.logIn.id.marginBottom;
            id.style.marginLeft = this.$style.logIn.id.marginLeft;
            id.style.color = this.$style.logInTextFieldIDTextStyle;

            const pw = document.querySelector('#PW');
            pw.style.marginBottom = this.$style.logIn.pw.marginBottom;
            pw.style.marginLeft = this.$style.logIn.pw.marginLeft;
            pw.style.color = this.$style.logInTextFieldPWTextStyle;

            const resolutionText = document.querySelector('#resolutionText');
            resolutionText.style.color = this.$style.logInResolutionTextStyle.color;

            this.backgroundColor = this.$style.logInTextFieldStyle.backgroundColor;
        },
        initTextAnimation() {
            $('.ml2').each(function () {
                $(this).html($(this).text().replace(/([^\x00\x80]|\w)/g, "<span class='letter'>$&</span>"));
            });

            anime.timeline({
                loop: true
                }).add({
                    targets: '.ml2 .letter',
                    scale: [4, 1],
                    opacity: [0, 1],
                    translateZ: 0,
                    easing: "easeOutExpo",
                    duration: 950,
                    color: this.$style.logInCIStyle,
                    delay: function (el, i) {
                        return 70 * i;
                    }
                }).add({
                    targets: '.ml2',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 2000,
                });
        },

        setAutoFocus(name) {
            if(this.items[0].name == name) {
                return true;
            }
            else {
                return false;
            }
        },

        loginClicked() {
            const params = { userId: this.getId, userPassword: this.getPw };
            loginAPI(params).then(res => {
                if(res.status === 200) {
                    const auth = res.data.userAuthority;
                    this.$store.dispatch('setAuth', auth);
                    this.$router.push('/sps/home');
                }
            }).catch(error => {
                this.$notify({
                    group: 'dyloginerror',
                    text: this.$t(`login.loginerror`),
                    type: 'error'
                });
            })
        },

        getResolution() {
            if (screen.width < 1920 || screen.height < 1080) {
                this.ui.resolution = screen.width + ' X ' + screen.height + this.$t(`login.resolution.impossible`);
            }
            else {
                this.ui.resolution = this.$t(`login.resolution.possible`);
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import './login';
</style>
