class Compiler {
    constructor(vm) {
        this.vm = vm
        this.data = vm.$data
        this.compile(vm.$el)
    }
    compile(el) {
        // 遍历界面元素，元素节点和文本节点分开处理
        let childNodes = el.childNodes || []
        Array.from(childNodes).forEach((node) => {
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                this.compileElement(node)
            }
            if (node.childNodes && node.childNodes.length) this.compile(node)
        })
    }
    compileText(node) {
        let value = node.textContent
        let reg = /\{\{(.+?)\}\}/
        if (reg.test(value)) {
            let key = ''
            value.replace(reg, (match, p1) => {
                key = p1.trim()
                node.textContent = this.vm[key]
            })
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }

    }
    compileElement(node) {
        // 遍历元素上的属性
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name 
            if (this.isDirective(attrName)) {
                this.update(attrName, attr.value, node)
            }
        })
    }
    update(attrName, key, node) {
        let updateFn = this[attrName.substr(2) + 'Updater']
        updateFn && updateFn.call(this, node, key, this.vm[key])
    }
    textUpdater(node, key, value) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    modelUpdater(node, key, value) {
        node.value = value
        new Watcher(this.vm, key,(newValue) => {
            node.value = newValue
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