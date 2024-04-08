class Dep {

}
class Watcher{

}
class Compiler {

}
/** 
我们需要在 Observe 类中处理 $data 相关的操作：
1. 将 $data 中的属性转换成响应式对象
2. $data 中的属性如果是对象，则该对象的属性也要转换为响应式对象
3. $data 中的数据发生变化时发送通知
 */
class Observe {
    constructor(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(data, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue === value) return
                    data[key] = newValue
                    // 发送通知
                }
            })
        })
    }
}
class Observe1 {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key)
        })
    }
    defineReactive(data, key) {
        let value = data[key]
        this.walk(value)
        const self = this
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get() {
                return value
            },
            set(newValue) {
                if (newValue === value) return
                value = newValue
                self.walk(newValue)
                // 发送通知
            }
        })
    }
}
class Vue {
    constructor(options) {
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el 
        this._proxyData(this.$data)
        new Observe(this.$data)
        // new Compiler(this)
    }
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue == data[key]) return
                    data[key] = newValue
                }
            })
        })
    }
}