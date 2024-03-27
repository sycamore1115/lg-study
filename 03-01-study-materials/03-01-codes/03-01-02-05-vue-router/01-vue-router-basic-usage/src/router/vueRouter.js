/* eslint-disable */
// 从 VueRouter 的使用上来看，我们可以总结出以下几点：
// 1. VueRouter 是一个 Vue 插件，所以具有 install 静态方法
//    Vue.use(VueRouter)
// 2. VueRouter 构造函数接收一个 routes 参数，为一个包含路由信息的数组
//    const router = new VueRouter({ routes })
// 3. 当将 VueRouter 的实例传入 Vue 构造函数时，会在创建 vue 实例上添加 $route 和 $router 属性
//    new Vue({ router, render: h => h(App) }).$mount('#app')
// 4. VueRouter 中包含 router-link 和 router-view 两个组件的实现
let _Vue = null
export default class VueRouter {
    static install(Vue) {
        // 插件安装只安装一次，不要重复安装
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        // 将 Vue 构造函数保存到全局变量中
        _Vue = Vue
        // 我们在 install 方法里写创建 vue 实例时执行的，将 $router 属性添加上去的代码
        // 在 Vue 上 mixin 的会作用在所有 vue 实例上，也就是 new Vue 出来的 vue 实例都会执行 mixin 里的内容
        // 在每个 vue 实例中，都会执行 beforeCreate 钩子中的函数
        // 只有创建 vue 根实例的时候，才会传入 router 参数，所以判断条件只会在根实例时生效、
        // beforeCreate 中的 this 指代的就是当前的 vue 实例
        // 我们希望在所有 vue 实例上都添加 $router 属性，但是又不想重复添加，那么添加到 prototype 上是最好的
        // 传入的 Vue 构造函数的参数会添加到 vue 实例的 $options 属性上
        _Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                }
            }
        })
    }
    // 记：VueRouter 有3个属性，3个方法
    // 属性：options(构造函数参数)  routeMap(路由地址和组件的键值对)  data(响应式对象，包含current当前路由)
    // 方法：createRouteMap   initComponent   initEvent
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
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        });
    }
    // 创建 router-link 和 router-view 两个组件
    initComponent(Vue) {
        // self 保存的是 VueRouter 的实例
        const self = this
        // <router-link to="/">Index</router-link>
        Vue.component('router-link', {
            // 这里的 this 是 router-link 这个 vue 实例
            props: {to: String},
            // template: "<a :href='to'><slot></slot></a>"
            render(h) {
                // return h('a', {attrs: {href: this.to}}, [this.$slots.default])
                return h('a', {attrs: {href: ''}, on: {click: this.clickHandler}}, [this.$slots.default])
            },
            methods: {
              clickHandler(e) {
                e.preventDefault()
                // history.pushState({},'',this.to)
                location.hash = this.to
                self.data.current = this.to
              }
            }
        })
        // router-view 渲染的组件是 current 在 routes 中对应的组件
        Vue.component('router-view', {
          render(h) {
            return h(self.routeMap[self.data.current])
          }
        })
    }
    // 注册 popState 事件，监听浏览器历史的变化，即点击浏览器的前进后退按钮时应该的操作
    initEvent() {
      // window.addEventListener('popState', () => {
      //   this.data.current = window.location.pathname
      // })
      window.addEventListener('popState', () => {
        this.data.current = window.location.pathname
      })
    }
}
