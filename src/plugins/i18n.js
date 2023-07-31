import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '@/locales/js/english'
import kr from '@/locales/js/korean'
import cn from '@/locales/js/chinese'
Vue.use(VueI18n);

const messages = {
    'en': en,
    'kr': kr,
    'cn': cn
}
const i18n = new VueI18n ({
    locale: 'kr',
    messages
})

export default i18n;
