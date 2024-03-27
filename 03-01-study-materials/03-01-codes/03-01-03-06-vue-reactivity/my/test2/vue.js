// 存储属性，将 data 中的值转换为 get/set 添加到 vm 上
class Vue {
    constructor(options) {
        this.$options = options || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        this.$data = options.data || {}
        this._proxyData(this.$data)
        new Observer(this.$data)
        new Compiler(this)
    }
    _proxyData(data) {
        for(let key in data) {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue){
                    if(newValue === data[key]) return
                    data[key] = newValue
                }
            })
        }
    }
}