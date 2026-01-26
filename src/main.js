import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { pinia } from './stores/pinia'
import { permDirective } from './directives/perm'

createApp(App)
  .use(pinia)
  .use(router)
  .use(ElementPlus)
  .directive('perm', permDirective)
  .mount('#app')
