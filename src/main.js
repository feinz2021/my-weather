import { createApp } from 'vue'
import App from './App.vue'
import '@materializecss/materialize/dist/css/materialize.min.css'
import '@materializecss/materialize/dist/js/materialize.min.js'
import 'material-icons/iconfont/material-icons.css';
import 'vue-toast-notification/dist/theme-sugar.css'
import VueToast from 'vue-toast-notification'


const app = createApp(App)
app.use(VueToast)
app.mount('#app')
