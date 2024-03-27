// let vm = new Vue({
//     el: '#app',
//     data: {
//       msg: 'test',
//       count: 20,
//     }
//   })
// vue 构造函数接收 options 参数，参数对象中有 el 和 data 属性
// el 可以是一个 Dom，也可以是一个字符串，当为字符串的时候需要转换为 Dom 元素
// vm 实例上有 $options $el $data 属性
// data 中的属性要转换为 setter/getter 然后全部添加到 vue 实例上，方便访问
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
        for (let key in data) {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue === data[key]) return
                    data[key] = newValue
                }
            })
        }
    }
}