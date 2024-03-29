// 大家首先可以随便找一个 Vue 项目，看下其中 VueRouter 的使用，大概分为以下几步：

// 1. VueRouter 是一个 Vue 插件，需要使用 Vue.use(VueRouter) 注册

// Vue.use 接收一个函数或者对象，如果是一个方法则直接调用，如果是一个对象则调用其 install 方法。
// install 方法接收 2 个参数，一个是 Vue 的构造函数，一个是可选的选项对象（这里不做设置）。
// 所以从这句话来看，我们可以将 VueRouter 看做一个有 install 静态方法的类。
class VueRouter {
    static install(Vue) {       
    }
}
// 插件是只注册一次，不会重复注册的。
// 那我们不妨在 install 方法上添加一个属性表明此组件是否被注册过。
class VueRouter {
    static install(Vue) {     
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true  
    }
}

// 2. 接收 routes 路由规则创建 VueRouter 实例
// const routes = [ { path: '/', name: 'Index', component: Index } ...]
// const router = new VueRouter({ routes })
// 所以从这句话来看，我们可以定义以下 VueRouter 的构造函数
// 构造函数接收包含 routes 路由规则的参数 options，
// 然后创建出来的 VueRouter 实例上应该有 options 和包含当前路由的 data 对象
// data 是一个响应式对象，因为需要监听当前路由地址的变化，从而使对应的组件也自动更新。默认当前路由地址为 '/'。
// 我们可以使用 Vue 提供的 observable 方法将传入的对象转换为一个响应式对象。
// 这里要用到 Vue 上提供的方法，所以在 install 中接收 Vue 的时候，应该存为全局变量便于使用
let _Vue = null
class VueRouter {
    static install(Vue) {     
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true  
        _Vue = Vue
    }
    constructor(options) {
        this.options = options
        this.data = _Vue.observable({ current: '/' })
    }
}

// 3. 创建 Vue 根实例时传入 VueRouter 实例
// new Vue({ router, render: h => h(App) }).$mount('#app')  

// 创建 Vue 根实例时传入 router 实例，会往所有 Vue 实例上添加 $router 属性。
// 我们仔细分析这句话，有三个重点：
// a. 在 VueRouter 类中怎么写会让代码等待 Vue 创建实例的时候再执行？
//    这要利用 Vue 给我们提供的钩子函数，在创建 Vue 实例的时候，会执行 beforeCreate 钩子函数
//    我们可以使用 Vue.mixin 进行全局混入，这个会影响注册之后所有创建的 Vue 实例
// b. 怎么判断是否是 Vue 根实例的创建
//    只有在创建根实例的时候，才会传入 router 选项
// c. 怎么往所有 Vue 实例上添加 $router 属性
//    往 Vue 的原型上添加，那以后创建的所有 Vue 实例上就会有这个 $router 属性
class VueRouter {
    static install(Vue) {     
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true  
        _Vue = Vue
        _Vue.mixin({
            beforeCreate(){
                // 这段代码写在 beforeCreate 中，this 的值指向的就是 Vue 实例，那么 this.$options.router 就可以取到传入的 router 选项。
                if(this.$options.router){
                    _Vue.prototype.$router = this.$options.router
                }
            }
        })
    }
    constructor(options) {
        this.options = options
        this.data = _Vue.observable({ current: '/' })
    }
}

// 4. 创建 router-link 和 router-view 两个组件
//    <router-link to="/">Index</router-link> 
//    <router-view/>
class VueRouter {
    static install(Vue) {     
        _Vue = Vue
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true  
    }
    constructor(options) {
        this.options = options
        this.data = _Vue.observable({ current: '/' })
        this.initComponent()
    }
    initComponent() {

    }
}