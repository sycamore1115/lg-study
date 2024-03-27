// 观察者模式中的 目标
class Dep {
    constructor () {
        this.subs = []
    }
    // 收集依赖
    addSub (sub) {
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }
    // 发送通知
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}