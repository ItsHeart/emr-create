import { createApp } from 'vue'
import naive from 'naive-ui'
import formCreate from '@form-create/naive-ui'
import install from '@form-create/naive-ui/auto-import'
import EmrCreate from '../index.js'
import App from './App.vue'

formCreate.use(install)

const app = createApp(App)
app.use(naive)
app.use(formCreate)
app.use(EmrCreate, { formCreate })
app.mount('#app')
