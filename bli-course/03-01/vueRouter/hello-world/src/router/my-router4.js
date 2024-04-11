let _Vue = null
export default class VueRouter{
    static install(Vue) {
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        Vue.mixin({
            beforeCreate() {
                if (this.$option.router) Vue.prototype.$router = this.$option.router
            }
        })
        _Vue = Vue
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
            template:"<a href='' v-on:click='handleClick'><slot></slot></a>",
            methods: {
                handleClick(e) {
                    e.preventDefault()
                    if (self.options.mode === 'history'){
                        history.pushState({}, '', this.to)
                    } else {
                        location.hash = this.to
                    }
                    self.data.current = this.to
                }
            }
        })
        Vue.component('router-view', {
            render(h) {
                let router = self.options.routes.find(i => i.path === self.data.current)
                return h(router.component)
            }
        })
    } 
    initEvent() {
        if (this.options.mode === 'history'){
            window.addEventListener('popstate', () => {
                this.data.current = location.pathname
            })
        } else {
            window.addEventListener('hashchange', () => {
                this.data.current = location.hash.substring(1)
            })
        }
    }
}