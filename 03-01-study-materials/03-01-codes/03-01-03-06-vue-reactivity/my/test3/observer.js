// 将 data 中的对象递归转换为 get/set
class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if (!data || typeof data !== 'object') return
        for (let key in data) {
            this.defineReactive(data, key)
        }
    }
    defineReactive(data, key) {
        let value = data[key]
        this.walk(value)
        let self = this
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                return value
            },
            set(newValue) {
                if (newValue === value) return
                value = newValue
                self.walk(newValue)
            }
        })
    }
}