import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initFavicon, initGreeting } from '@/shared/utils'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
initFavicon()
initGreeting()
