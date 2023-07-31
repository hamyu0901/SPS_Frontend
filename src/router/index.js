import Vue from 'vue';
import { loginCheck } from '@/utils/auth';
import Router from 'vue-router';
Vue.use(Router)

import LoginContainer from '@/LoginContainer.vue';
import MainContainer from '@/MainContainer.vue';

import Home from '@/components/home/Home.vue';

import Monitoring from '@/components/monitoring/DYMonitoring.vue';
import LineMonitoring from '@/components/monitoring/linemonitoring/LineMonitoring.vue';
import DetailMonitoring from '@/components/monitoring/detailMonitoring/DetailMonitoring.vue';

import Diagnostics from '@/components/diagnostics/Diagnostics.vue'
import Predict from '@/components/diagnostics/predict/DYPredict';
import TorqueData from '@/components/diagnostics/torquedata/TorqueData.vue'
import TorqueLoadFactor from '@/components/diagnostics/torqueloadfactor/TorqueLoadFactor.vue'
import TorqueTemperature  from '@/components/diagnostics/torquetemperature/TorqueTemperature.vue'
import Atomizer from '@/components/diagnostics/atomizer/Atomizer.vue';
import Statistics from '@/components/diagnostics/statistics/Statistics.vue';

import ReportView from '@/components/report/Report.vue'
import ReportResult from '@/components/report/report/ReportResult.vue'

import Maintenance from '@/components/maintenance/Maintenance.vue'

import Extra from '@/components/extra/Extra';
import Manual from '@/components/manual/Manual.vue'
import Production from '@/components/extra/productionhistory/ProductionHistory.vue';
import VinNoProductionHistory from "@/components/extra/vinnoproductionhistory/VinNoProductionHistory.vue";
import BackUp from '@/components/extra/backup/Backup.vue'

import store from '../store/store';

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err;
  });
};

/** [TODO]: 삭제 경로 있음, 추후 반영 예정 */
const router =  new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: 'login' },
    { path: '/login', name: 'login', component: LoginContainer },
    { path: '/sps',
      name: 'sps',
      component: MainContainer,
      children: [
        { path: 'home', name: 'home', component: Home },
        {
          path: 'monitoring',
          name: 'monitoring',
          component: Monitoring,
          redirect: 'monitoring/line',
          children: [
            { path: 'line', name: 'line', component: LineMonitoring},
            { path: 'detail/zone/:zoneId', component: DetailMonitoring},
          ]
        },
        { path: 'diagnostics',
          name: 'diagnostics',
          component: Diagnostics,
          redirect: to => {
            for(let i = 0; i < store.getters.getDiagnosticsMenuItems.length; i++) {
              if(store.getters.getDiagnosticsMenuItems[i].show === true) {
                return store.getters.getDiagnosticsMenuItems[i].path;
                break;
              }
            }
          },
          children: [
            { path: 'predict', name: 'predict', component: Predict },
            { path: 'torquedata', name: 'torquedata', component: TorqueData },
            { path: 'torqueloadfactor', name: 'torqueloadfactor', component: TorqueLoadFactor },
            { path: 'torquetemperature', name: 'torquetemperature', component: TorqueTemperature },
            { path: 'atomizer', name: 'atomizer', component: Atomizer },
            { path: 'statistics', name: 'statistics', component: Statistics }
          ]
        },
        { path: 'maintenance', name: 'maintenance', component: Maintenance },
        { path: 'reportview', name: 'reportview', component: ReportView, props: true},
        { path: 'reportresult', name: 'reportresult', component: ReportResult, props: true },
        {
          path: 'extra',
          name: 'extra',
          component: Extra,
          redirect: 'extra/production',
          children: [
            { path: 'manual', name: 'manual', component: Manual },
            { path: 'production', name: 'production', component: Production},
            { path: 'vin-no-production-history', name: 'vinNoProductionHistory', component: VinNoProductionHistory},
            { path: 'backup', name: 'backup', component: BackUp }
          ]
        }
      ]
    },
  ]
})

router.beforeEach(async function (to, from, next) {
  const isLogin = await loginCheck();
  isLogin ? ( to.path.substring(1) === 'login' ? next({ path: '/sps/home' }) : next() ) : (to.path.substring(1) === 'login' ? next() : next({ path: '/login' }));
});
export default router;
