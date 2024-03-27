// 将 $data 中的值转换为 setter/getter
// 其中定义了 walk 和 defineReactive 方法
// 如果 data 中的属性值也是对象，那也要转换成 setter/getter
class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if (!data || typeof data !== 'object') return
        for(let key in data) {
            this.defineReactive(data, key)
        }
    }
    defineReactive(data, key) {
        let dep = new Dep()
        let value = data[key]
        this.walk(value)
        const self = this
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                if (newValue === value) return
                value = newValue
                self.walk(newValue)
                dep.notify()
            }
        })
    }
}