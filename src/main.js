import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import '@/styles/index.css' //引入全局样式

const app = createApp(App)

app.use(createPinia().use(persist))
app.use(router)

app.mount('#app')
