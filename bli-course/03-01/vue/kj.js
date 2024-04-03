// 先记住有 5 个类
class Dep {

}
class Watcher{

}
class Compiler {

}
/** 接下来看到 $data 属性，data 选项中的成员记录到了 $data 中，并且转换成了 getter 和 setter。
 * $data 中的 setter 是真正监视数据变化的地方。

我们需要在 Observe 类中处理 $data 相关的操作：
1. 将 $data 中的属性转换成响应式对象
2. $data 中的属性如果是对象，则该对象的属性也要转换为响应式对象
3. $data 中的数据发生变化时发送通知

我们模拟 vue 中的写法，定义 walk 和 defineReactive 方法，在 walk 中循环调用 defineReactive 方法，
在 defineReactive 方法中使用 Object.defineProperty 将数据转换为 getter/setter。

递归
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
class Observe {
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
/**
 * 打印的 vue 实例包含很多属性，我们需要模拟的简单功能只需要实现几个简单的属性：
 * $options：传入 vue 构造函数的参数
 * $data：参数中的 data 属性
 * $el：参数中 el 属性对应的页面元素
 * 我们还能看见 data 中的属性都直接显示在 vm 上了，所以我们需要将 data 中的属性添加到 vm 上并将转换为get/set
 */
class Vue {
    constructor(options) {
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el 
        this._proxyData(this.$data)
        // new Observe(this.$data)
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
/**
 * 替换 demo 中引入的 vue 文件并打印 vm，对比两次 vm 实例，我们已经实现了一部分属性了。
 */