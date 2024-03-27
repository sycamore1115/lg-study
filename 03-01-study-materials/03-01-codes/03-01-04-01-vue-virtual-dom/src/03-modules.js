import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

// 1. 导入模块
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

// 2. 注册模块
const patch = init([
  styleModule,
  eventListenersModule
])

// 3. 使用h() 函数的第二个参数传入模块中使用的数据（对象）
let vnode = h('div', [
  h('h1', { style: { backgroundColor: 'red' } }, 'Hello World'),
  h('p', { on: { click: eventHandler } }, 'Hello P')
])

function eventHandler () {
  console.log('别点我，疼')
}

let app = document.querySelector('#app')
patch(app, vnode)

// 模块的作用：
// Snabbdom 的核心库并不能处理DOM元素的属性、样式、事件等，
// 可以通过注册 Snabbdom 提供的模块来实现。
// Snabbdom中的模块可以用来扩展Snabbdom的功能
// Snabbdom中的模块的实现是通过注册全局的钩子函数来实现的

// Snabbdom 官方提供了6个模块
// 1. attributes
// 2. props
// 3. dataset
// 4. class
// 5. style
// 6. eventlisteners
// 对于以上模块的作用可以参见： 
// https://github.com/snabbdom/snabbdom/blob/master/README-zh_CN.md#%E6%A8%A1%E5%9D%97%E6%96%87%E6%A1%A3

// 模块的使用
// 1. 导入所需模块
// 2. init 中注册模块
// 3. h 函数的第二个参数中使用模块