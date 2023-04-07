import { createApp } from 'vue'
// import './style.css'
import '@/styles/index.css'
import 'normalize.css'
import 'virtual:uno.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import store from './store'
import router from './router/index'

const app = createApp(App)

// 挂载Pinia
app.use(store)
app.use(router)
app.use(Antd)

app.mount('#app')
