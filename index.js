import Vue            from 'vue'
import VueRouter      from 'vue-router'
import Vuetify        from 'vuetify'
import DaySpanVuetify from 'dayspan-vuetify'

import Calendar from './src/components/Calendar.vue'
import Index    from './src/components/Index.vue'
import App      from './src/App.vue'

import Chronos  from './src/chronos'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'


Vue.prototype.$chronos = new Chronos()

Vue.use(VueRouter)
Vue.use(Vuetify)

Vue.use(DaySpanVuetify, {
  data: {
    supports: {
      busy: false,
      icon: false
    },

    features: {
      exclude:       false,
      include:       false,
      cancel:        false,
      move:          false,
      moveDuplicate: false,
      moveInstance:  false,
      moveAll:       false,
      drag:          false,
      forecast:      false,
      addDay:        false,
      addTime:       false,
      hideOnMove:    false
    }
  }
})


const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/(chronoscopie/)?', component: Index },
    { path: '/(chronoscopie/)?:group(\\d+)', component: Calendar },
    { path: '/(chronoscopie/)?:group(\\d+)/:date', component: Calendar }
  ]
})


new Vue({
  el: '#app',
  render: h => h(App),
  router
})
