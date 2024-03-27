// 接收参数，将 data 中的数据转换为 get/set 并绑定到 vue 实例上
class Vue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

        this._proxyData(this.$data)
        new Observer(this.$data)
        new Compiler(this)
    }

    _proxyData(data) {
        for (let key in data) {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue === data[key]) return
                    data[key] = newValue
                }
            })
        }
    }

}