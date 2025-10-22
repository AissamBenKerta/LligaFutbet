import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueFire } from 'vuefire'
import { firebaseApp } from './firebase'
import vuetify from './plugins/vuetify'

const app = createApp(App)

app.use(router)
app.use(vuetify, VueFire, { firebaseApp })

app.mount('#app')
