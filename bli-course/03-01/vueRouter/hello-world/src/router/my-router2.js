let _Vue = null

export default class VueRouter{
    static install(Vue) {
        _Vue = Vue
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    Vue.prototype.$router = this.$options.router
                }
            }
        })
    }
    constructor(options) {
        this.options = options
        this.data = _Vue.observable({current: '/'})
        this.initComponent()
        this.initEvent()
    }
    initComponent() {
        const self = this
        _Vue.component('router-link',{
            props: {to: String},
            template: '<a href="" @click="handleClick"><slot></slot></a>',
            methods: {
                handleClick(e) {
                    e.preventDefault()
                    if (self.options.mode === 'history') {
                        history.pushState({}, '', this.to)
                    } else {
                        location.hash = this.to
                    }
                    self.data.current = this.to
                }
            }
        })
        _Vue.component('router-view',{
            render(h) {
                const route = self.options.routes.find(i => i.path === self.data.current)
                return h(route.component)
            }
        })
    }
    initEvent() {
        if (this.options.mode === 'history') {
            window.addEventListener('popstate', () => {
                this.data.current = window.location.pathname
            })
        } else {
            window.addEventListener('hashchange', () => {
                this.data.current = window.location.hash.substring(1)
            })
        }
    }
}