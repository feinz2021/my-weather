import { createApp } from 'vue'
import App from './App.vue'
import '@materializecss/materialize/dist/css/materialize.min.css'
import '@materializecss/materialize/dist/js/materialize.min.js'
import 'material-icons/iconfont/material-icons.css';
import 'vue-toast-notification/dist/theme-sugar.css'
import VueToast from 'vue-toast-notification'
import SimpleTypeahead from 'vue3-simple-typeahead';
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css'; //Optional default CSS


const app = createApp(App)
app.use(SimpleTypeahead);
app.use(VueToast)
app.mount('#app')
