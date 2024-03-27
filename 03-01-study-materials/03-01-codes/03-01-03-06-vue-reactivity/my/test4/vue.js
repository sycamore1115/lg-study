class Vue {
    constructor(options) {
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el == 'string' ? document.querySelector(options.el) : options.el

        this._ProxyData(this.$data)
        this._setMethods(this.$options.methods)
        new Observer(this.$data)
        new Compiler(this)
    }
    _setMethods(methods) {
        Object.keys(methods).forEach(key => {
            this[key] = methods[key]
        })
    }
    _ProxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue === data[key]) return
                    data[key] = newValue
                }
            })
        })
    }
}