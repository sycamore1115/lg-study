// 对于数据的处理完成后，就要开始渲染视图了，要将视图中的 {{}} v-text v-model 中用到的 data 属性都显示出来
// 我们要判断视图中的文本节点，再处理其中的插值表达式
// 判断视图中的元素节点，判断上面的属性有无 v- 指令，再处理指令
// 先写出以上的三个简单的判断函数：判断是否为文本节点，判断是否为元素节点，判断是否是v-指令
// 然后遍历 vm.$el 这个元素中的所有节点，根据节点类型做出 compilerText 和 compilerElement 的不同操作
class Compiler {
    constructor (vm) {
        this.vm = vm
        this.compiler(vm.$el)
    }

    compiler(el) {
        let childNodes = el.childNodes
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

    compilerText(node) {
        // 文本节点替换插值表达式
        let value = node.textContent
        let reg = /\{\{(.+?)\}\}/
        let key = ''
        if (reg.test(value)) {
            value.replace(reg, (match, p1) => {
                key = p1.trim()
                node.textContent = this.vm[key]
            })
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }
    compilerElement(node) {
        // 指令解析属性节点
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                let attrValue = attr.value
                this.update(node, attrName, attrValue)
            }
        })
    }
    // 用拼接指令名和 'Updater' 的方式为不同的指令操作方法命名
    update(node, attrName, key) {
        attrName = attrName.substr(2)
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
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