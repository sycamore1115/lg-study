let _Vue = null
export default class VueRouter{
    static install(Vue) {
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        _Vue = Vue
        Vue.mixin({
            beforeCreate() {
                if (this.$options.router) Vue.prototype.$router = this.$options.router
            }
        })
    }
    constructor(options) {
        this.options = options
        this.data = _Vue.observable({current: '/'})
        this.initComponent(_Vue)
        this.initEvent()
    }
    initComponent(Vue) {
        const self = this
        Vue.component('router-link',{
            props: {to: String},
            template: `<a href='' :click='handleClick'><slot></slot></a>`,
            methods: {
                handleClick(e) {
                    e.preventDefault()
                    if (self.$options.mode === 'history') {
                        history.pushState({}, '', this.to)
                    } else {
                        location.hash = this.to
                    }
                    self.data.current = this.to
                }
            }
        })
        Vue.component('router-view',{
            render(h) {
                const router = self.options.routes.find(route => {
                    route.path = self.data.current
                })
                return h(router.component)
            }
        })
    }
    initEvent() {
        if (this.options.mode === 'history') {
            window.addEventListener('popstate', () =>{
                this.data.current = location.pathname
            })
        } else {
            window.addEventListener('hashchange', () =>{
                this.data.current = location.hash.substring(1)
            })
        }
    }
}