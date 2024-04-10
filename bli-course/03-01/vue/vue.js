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
class Observe1 {
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
class Observe2 {
    constructor(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            let value = data[key]
            // TODO 递归该对象的属性，转换为响应式对象
            // 为了递归调用，需要将这一部分代码抽出到一个独立的方法
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
class Observe3 {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            let value = data[key]
            this.walk(value)
            const self = this
            Object.defineProperty(data, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue === value) return
                    data[key] = newValue
                    // 在 set 方法中的 this 指向的是 data，而不是 Observer 实例
                    // this.walk(newValue)
                    self.walk(newValue)
                    // 发送通知
                }
            })
        })
    }
}
// 此时如果我们访问或者修改 data 中的数据，都会有堆栈溢出的报错：Maximum call stack size exceeded
class Observe4 {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            let value = data[key]
            this.walk(value)
            const self = this
            Object.defineProperty(data, key, {
                configurable: true,
                enumerable: true,
                get() {
                    // return data[key]
                    return value
                },
                set(newValue) {
                    if (newValue === value) return
                    // data[key] = newValue
                    // 这里给 value 赋值，是因为 get 的时候用的也是 value，它存在于闭包之中
                    value = newValue
                    self.walk(newValue)
                    // 发送通知
                }
            })
        })
    }
}
class Observer {
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