/* eslint-disable */
let _Vue = null
export default class VueRouter{
  static install(Vue) {
    if (VueRouter.install.installed) return
    VueRouter.install.installed = true
    _Vue = Vue
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$route = this.$options.router
        }
      }
    })
  }
  constructor(options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({ current: '/' })
    this.init()
  }
  init() {
    this.createRouteMap()
    this.initComponent(_Vue)
    this.initEvent()
  }
  createRouteMap() {
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component
    })
  }
  initComponent(Vue) {
    const self = this
    Vue.component('router-link', {
      props: { to: String },
      render(h) {
        return h('a', {attrs: { href: this.to }, on: { click: this.clickHandler }}, [this.$slots.default])
      },
      methods: {
        clickHandler(e) {
          e.preventDefault()
          // history 模式
          // history.pushState({}, "", this.to)
          // hash 模式
          window.location.hash = this.to
          self.data.current = this.to
        }
      }
    })
    Vue.component('router-view', {
      render(h) {
        return h(self.routeMap[self.data.current])
      }
    })
  }
  initEvent() {
    // window.addEventListener('hashchange', () => {
    //   this.data.current = window.location.pathname
    // })
    window.addEventListener('popState', () => {
      this.data.current = window.location.hash
    })
  }
}
