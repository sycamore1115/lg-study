// 将 data 上的属性都转换为 set/get，如果属性为对象，那此对象上的属性也转换为 set/get
class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if (!data || typeof data !== 'object' ) return
        for(let key in data) {
            this.defineReactive(data, key)
        }
    }
    defineReactive(data, key) {
        let value = data[key]
        this.walk(value)
        let self = this
        let dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                if (newValue === value) return
                value = newValue
                self.walk(newValue)
                // 发送通知
                dep.notify()
            }
        })
    }
}