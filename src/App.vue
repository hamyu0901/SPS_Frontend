<template>
  <div id="app">
    <router-view v-on:themeItem="getThemeItem"  v-bind="setThemeStyle"/>
    <notifications class="loginPop" group="dyloginerror" position="top center" :max="3" :width="400" />
    <notifications class="pushPop" group="push" position="top left" :max="3" :width="500" />
    <notifications class="pushAlarm" group="pushAlarm" position="bottom left" :max="3" :width="500" />
  </div>
</template>

<script> 
import {mapGetters} from 'vuex'
export default {
  name: 'App',
  data() {
    return {

    }
  },

  created() {
  },

  mounted() {
  },

    computed: {
    ...mapGetters ({
        getTheme: 'getTheme'
    }),

    setThemeStyle() {
      if(this.getTheme === true) {
        this.$style.setThemeStyle(1);
      } else {
        this.$style.setThemeStyle(2);  
      }
    }
  },

  methods: {
    getThemeItem(themeItem) {
      if(themeItem === 'dark') {      
        sessionStorage.setItem('theme', true);
      } else if(themeItem === 'light') {    
        sessionStorage.setItem('theme', false);
      }
      this.changeTheme(JSON.parse(sessionStorage.getItem('theme')));
    },

    changeTheme(themeFlag) {
      this.$store.dispatch('changeTheme', themeFlag);
        if(this.getTheme === themeFlag) {
         location.reload();
        }
    },
  }
}
</script>

<style>
  th, td {
    vertical-align: middle !important;
  }
  
  body::-webkit-scrollbar {
    /* display: none; */
  }

  .loginPop {
    margin-top: 170px;
  }

  .pushPop {
    margin-top: 50px;
  }

  .pushAlarm {
    margin-bottom: 50px;
  }

  ::-webkit-scrollbar {width: 8px; height: 8px; border: 3px solid #2c2c2c; }
  ::-webkit-scrollbar-button:start:decrement, ::-webkit-scrollbar-button:end:increment {display: block; height: 10px; }
  ::-webkit-scrollbar-track {background: #2c2c2c; -webkit-border-radius: 10px; border-radius:10px; -webkit-box-shadow: inset 0 0 4px rgb(110, 110, 110)}
  ::-webkit-scrollbar-thumb {height: 50px; width: 50px; background: #237FFE; -webkit-border-radius: 8px; border-radius: 8px; -webkit-box-shadow: inset 0 0 4px #171A29}
</style>
