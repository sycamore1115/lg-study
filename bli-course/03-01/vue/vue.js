// 先记住有 5 个类
class Dep {

}
class Watcher{

}
class Compiler {

}
// 将 data 中的属性转换为get/set
class Observe {

}
// Vue 类中整理传入的参数options，将 data 中的属性添加到 vm 上并将转换为get/set
class Vue {
    constructor(options) {
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el 
        this._proxyData(this.$data)
        new Observe(this.$data)
        new Compiler(this)
    }
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperties(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data.key
                },
                set(newValue) {
                    if (newValue == data[key]) return
                    data[key] = newValue
                }
            })
        })
    }
}