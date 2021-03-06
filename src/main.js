import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import vueKanban from 'vue-kanban'

Vue.config.productionTip = false

Vue.use(vueKanban)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
