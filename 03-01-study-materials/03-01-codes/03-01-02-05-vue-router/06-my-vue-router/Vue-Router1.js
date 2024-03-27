let _Vue = null
// 1. VueRouter是一个插件：具有install静态方法的类
class VueRouter {
    // install 方法接收两个参数，一个是Vue构造函数，一个是options
    static install(Vue) {
        // 插件只注册一次
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        // 2. 将 install 方法接收的 Vue 构造函数存储到全局变量中
        _Vue = Vue
        // 3. new Vue({router}) 往Vue上添加 $router
        // 全局混入，影响注册之后所有创建的 Vue 实例，就是每次创建 Vue 实例的时候都会执行
        // 但是只有创建根实例的时候会传入 router 属性，此时往 Vue 的原型上添加传入的 router
        // 以后创建的 Vue 实例不会再进行赋值，但是会在原型上找到 $router 的值
        _Vue.mixin({
            beforeCreate() {
                // beforeCreate 中的 this 就是 vue 实例
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                }
            }
        })
    }

    // 属性： options, routeMap, data
    constructor(options) {
        this.options = options
        this.routerMap = {}
        this.data = _Vue.observable({
            current: '/'
        })
        this.init()
    }

    // 方法： init, createRouteMap, initComponents, initEvent
    init() {
        this.createRouteMap()
        this.initComponent()
        this.initEvent()
    }

    createRouteMap() {
        this.options.routes.forEach(route => {
            this.routerMap[route.path] = route.component
        })
    }

    initComponent() {

    }

    initEvent() {

    }

// 接收4个参数：父元素，要删除元素对应的vnode数组，要删除节点的开始和结束位置
  function removeVnodes (parentElm: Node, vnodes: VNode[], startIdx: number, endIdx: number): void {
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners: number
      let rm: () => void
      const ch = vnodes[startIdx]
      if (ch != null) {
        // ch.sel 表示元素节点，没有则表示文本节点
        // 元素节点
        if (isDef(ch.sel)) {
          // 触发 vnode 的 destory 钩子函数
          invokeDestroyHook(ch)
          // 获取 cbs（存储的就是模块的钩子函数） 中钩子函数的个数，并+1，赋值给 listeners，listeners变量的作用是为了防止重复删除 DOM 元素
          listeners = cbs.remove.length + 1
          // 高阶函数，返回真正删除 DOM 元素的函数 rm
          rm = createRmCb(ch.elm!, listeners)
          // 依次调用 cbs 中的 remove 钩子函数
          for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm)
          // 获取用户传入的 remove 钩子函数
          const removeHook = ch?.data?.hook?.remove
          if (isDef(removeHook)) {
            // 如果取用户传入了 remove 钩子函数，需要用户手动调用 rm 删除 DOM 元素
            removeHook(ch, rm)
          } else {
            rm()
          }
        } else { 
          // 文本节点直接删除
          api.removeChild(parentElm, ch.elm!)
        }
      }
    }
  }
}