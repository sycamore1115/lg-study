class Watcher{
    // 在用到 data 里数据的地方加上 Watcher
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
    }
    update() {
        let newValue = this.vm[this.key]
        if (newValue === this.oldValue) return
        this.cb(newValue)
    }
}