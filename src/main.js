import Vue from 'vue';
import App from './App.vue';
import router from './router';
var config;
if (process.env.NODE_ENV !== 'production') {
  config = require('../config/settings');
}

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueSocketIO from 'vue-socket.io';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrash,
  faCheck,
  faUser,
  faStepForward,
  faStepBackward,
  faPlay,
  faPause,
  faRandom,
  faRedo,
  faVolumeUp,
  faVolumeDown,
  faArrowsAlt,
  faCompressArrowsAlt,
  faHeart,
  faHandPointDown,
  faFrown,
  faLevelUpAlt
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueWait from 'vue-wait'
Vue.use(VueWait);
var baseURL;
var port;
if (config === undefined) {
  baseURL = "spotilize.herokuapp.com";
  port = "";
} else {
  baseURL = config.baseURL;
  port = config.serverPort;
}
Vue.use(new VueSocketIO({
  connection: baseURL + port,
}));

import Notifications from 'vue-notification'
Vue.use(Notifications)

library.add(faTrash);
library.add(faCheck);
library.add(faUser);
library.add(faStepForward);
library.add(faStepBackward);
library.add(faPlay);
library.add(faPause);
library.add(faRandom);
library.add(faRedo);
library.add(faVolumeUp);
library.add(faVolumeDown);
library.add(faArrowsAlt);
library.add(faCompressArrowsAlt);
library.add(faHeart);
library.add(faFrown);
library.add(faHandPointDown);
library.add(faLevelUpAlt);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.use(VueMaterial);

Vue.config.productionTip = false

new Vue({
  router,
  wait: new VueWait(),
  render: h => h(App)
}).$mount('#app')
