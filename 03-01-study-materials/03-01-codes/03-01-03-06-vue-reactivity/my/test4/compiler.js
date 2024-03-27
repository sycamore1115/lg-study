class Compiler{
    constructor(vm) {
        this.vm = vm
        this.compiler(vm.$el)
    }
    compiler(el) {
        let childNodes = el.childNodes || []
        // 遍历 el 的子节点
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)){
                this.compilerText(node)
            } else if(this.isElementNode(node)) {
                this.compilerElement(node)
            }

            if(node.childNodes && node.childNodes.length) this.compiler(node)
        })
    }
    // 处理插值表达式
    compilerText(node) {
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        let key
        value.replace(reg, (match, p1) => {
            key = p1.trim()
            node.textContent = this.vm[key]
        })

        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    // 处理v-指令
    compilerElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if(this.isDirective(attrName)){
                this.update(attrName, node, attr.value)
            }
        })
    }
    // 各个指令对应的 update 方法
    update(attrName, node, key) {
        // v-on:click 需要特殊处理
        let eventName
        [attrName, eventName] = attrName.split(':')
        let updateFn = this[attrName.substr(2) + 'Updater']
        updateFn && updateFn.call(this, node, key, this.vm[key], eventName)
    }
    textUpdater(node, key, value) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    modelUpdater(node, key, value) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    // 实现 v-html 和 v-on
    htmlUpdater(node, key, value) {
        node.innerHTML = value
        new Watcher(this.vm, key, (newValue) => {
            node.innerHTML = newValue
        })
    }
    onUpdater(node, key, value, eventName) {
        node.addEventListener(eventName, () => {
            this.vm[key]()
        })
    }
    // 三个工具方法
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