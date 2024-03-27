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
        let val = data[key]
        this.walk(val)
        // 每个 data 中的属性都是 dep 目标
        let dep = new Dep()
        let that = this
        Object.defineProperty(data, key, {
            configurable: true, 
            enumerable: true,
            get(){
                // 在创建 watcher 观察者实例的时候，会将 watcher 实例设置到 Dep.target 上，
                // 然后触发这个属性的 getter，最后重置 Dep.target 为空
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newValue) {
                if (newValue === val) return
                val = newValue
                that.walk(newValue)
                // 值改变时，触发 watcher 实例的 update 方法
                dep.notify()
            }
        })
    }
}