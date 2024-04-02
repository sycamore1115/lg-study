import Vue from 'vue'
// hello-world\src\router\index.js
// import VueRouter from 'vue-router'
import VueRouter from './my-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
