// 遍历视图，所有用到 data 属性的地方替换掉
// 元素节点找属性节点处理为指令，文本节点处理为插值表达式
class Compiler {
    constructor(vm) {
        let el = vm.$el
        this.vm = vm
        this.compiler(el)
    }
    compiler(el) {
        let childNodes = el.childNodes || []
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compilerText(node)
            } else if (this.isElementNode(node)) {
                this.compilerElement(node)
            }
            if (node.childNodes && node.childNodes.length) {
                this.compiler(node)
            }
        })
    }
    compilerText (node) {
        let value = node.textContent
        let reg = /\{\{(.+?)\}\}/
        let key = ''
        if (reg.test(value)) {
            value.replace(reg, (match, p1) => {
                key = p1.trim()
                node.textContent = this.vm[key]
            })

            new Watcher(this.vm, key,(newValue) => {
                node.textContent = newValue
            })
        }
    }
    compilerElement (node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)){
                this.update(attrName, attr.value, node)
            }
        })
    }
    update(attrName, key, node) {
        attrName = attrName.substr(2)
        let updateFn = this[attrName + 'Updater']
        let value = this.vm[key]
        updateFn && updateFn.call(this, node, key, value)
    }
    textUpdater(node, key, value) {
        node.textContent = value
        new Watcher(this.vm, key,(newValue) => {
            node.textContent = newValue
        })
    }
    modelUpdater (node, key, value) {
        node.value = value
        new Watcher(this.vm, key,(newValue) => {
            node.value = newValue
        })
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    isTextNode (node) {
        return node.nodeType === 3
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
}