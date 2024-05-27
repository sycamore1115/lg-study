class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        if(sub && sub.update) this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => sub.update())
    }
}
class Watcher {
    constructor(vm, key, cb) {
        this.cb = cb
        Dep.target = this
        vm[key]
        Dep.target = null
    }
    update() {
        this.cb()
    }
}
class Compiler {
    constructor(vm) {
        this.vm = vm
        this.compiler(vm.$el)
    }
    compiler(el) {
        let childNodes = el.childNodes || []
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compilerText(node)
            } else if (this.isElementNode(node)) {
                this.compilerElement(node)
            }
            if (node.childNodes && node.childNodes.length) this.compiler(node)
        })
    }
    compilerElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                let updateFn = this[attrName.substring(2) + 'Updater']
                let key = attr.value
                updateFn && updateFn.call(this, node, key, this.vm[key])
            }
        })
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
    compilerText(node) {
        let value = node.textContent
        let reg = /\{\{(.+?)\}\}/
        if (reg.test(value)) {
            let key = ''
            value.replace(reg, (match, p1) => {
                key = p1.trim()
                node.textContent = this.vm[key]
            })
            new Watcher(this.vm, key, () => {
                node.textContent = this.vm[key]
            })
        }
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
        Object.keys(data).forEach((key) => {
            this.defineReactive(key, data)
        })
    }
    defineReactive(key, data) {
        let value = data[key]
        this.walk(value)
        let self = this
        let dep = new Dep()
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