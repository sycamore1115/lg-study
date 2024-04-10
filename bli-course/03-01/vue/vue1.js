// 观察者模式
// 将data中的每个属性添加为目标，当调用属性的set方法是调用notify通知观察者
class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
// 将每个用到data中属性的界面位置都设置为观察者，观察到目标变化后，调用update更新界面
class Watcher {
    constructor(vm, key, cb) {
        this.cb = cb
        Dep.target = this
        // 调用data对应属性的get方法
        vm[key]
        Dep.target = null
    }
    update() {
        console.log('update')
        this.cb()
    }
}
class Compiler {
    constructor(vm) {
        this.vm = vm
        this.compiler(vm.$el)
    }
    // 遍历页面上的所有节点，找出使用了 data 中属性的地方
    // 区分文本节点和元素节点，文本节点使用插值表达式，元素节点使用指令
    compiler(el) {
        // TODO: 此次没有考虑根节点上有指令的情况
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compilerText(node)
            } else if (this.isElementNode(node)) {
                this.compilerElement(node)
            }
            if (node.childNodes && node.childNodes.length) this.compiler(node)
        })
    }
    // 处理插值表达式
    compilerText(node) {
        const reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        let key = ''
        if (reg.test(value)) {
            value.replace(reg, (match, p1) => {
                key = p1.trim()
                node.textContent = this.vm[key]
            })
            new Watcher(this.vm, key, () => {
                node.textContent = this.vm[key]
            })
        }
    }
    // 处理指令，遍历节点上的属性
    compilerElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                let attrValue = attr.value
                this.update(node, attrName, attrValue)
            }
        })
    }
    update(node, attrName, key) {
        let updateFn = this[attrName.substring(2) + 'Updater']
        updateFn && updateFn.call(this, node, key, this.vm[key])
    }
    textUpdater(node, key, value) {
        node.textContent = value
        new Watcher(this.vm, key, () => {
            node.textContent = this.vm[key]
        })
    }
    modelUpdater(node, key, value) {
        node.value = value
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
        new Watcher(this.vm, key, () => {
            node.value = this.vm[key]
        })
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
    isDirective(attrName) {
        return attrName.startsWith('v-')
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
        let dep = new Dep()
        // 接下来要给 dep 目标添加观察者，但此时观察者还没有生成
        let value = data[key]
        this.walk(value)
        const self = this
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
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
class Vue {
    constructor(options) {
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        this._proxyData(this.$data)
        new Observer(this.$data)
        new Compiler(this)
    }
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return data[key]
                },
                set(newValue){
                    if (newValue === data[key]) return
                    data[key] = newValue
                }
            })
        })
    }
}