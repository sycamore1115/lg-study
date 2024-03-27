// import { init } from 'snabbdom/build/package/init'
// import { h } from 'snabbdom/build/package/h'

// const patch = init([])

// // 第一个参数：标签+选择器
// // 第二个参数：如果是字符串就是标签中的文本内容
// let vnode = h('div#container.cls',{
//   hook: {
//     init (vnode) {
//       console.log(vnode.elm)
//     },
//     create (emptyNode, vnode) {
//       console.log(vnode.elm)
//     }
//   }
// }, 'Hello World')
// let app = document.querySelector('#app')
// // 第一个参数：旧的 VNode，可以是 DOM 元素
// // 第二个参数：新的 VNode
// // 返回新的 VNode
// let oldVnode = patch(app, vnode)

// vnode = h('div#container.xxx', 'Hello Snabbdom')
// patch(oldVnode, vnode)

// import { init } from 'snabbdom/build/package/init'
// import { h } from 'snabbdom/build/package/h'

// const patch = init([])

// // 第一个参数：标签+选择器
// // 第二个参数：如果是字符串就是标签中的文本内容
// let vnode = h('div#container.cls', 'Hello World')
// // #app 占位
// let app = document.querySelector('#app')
// // patch 函数：对比两个 vnode，把两个 vnode 的差异更新到真实 Dom 上
// // 第一个参数：旧的 VNode，可以 vnode 也可以是真实 DOM 元素，如果是 Dom 真实 DOM 元素，在内部会转换为 vnode
// // 第二个参数：新的 VNode
// // 返回新的 VNode，可以作为下一次 patch 的旧的 VNode
// let oldVnode = patch(app, vnode)

// // setTimeout(() => {
// //     // 清除div中的内容，替换为空的注释节点
// //     patch(oldVnode, h('!'))
// //   }, 2000);

// vnode = h('div#container.xxx', 'Hello Snabbdom')
// patch(oldVnode, vnode)


import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

const patch = init([])

// data.hook
let vnode = h('div#container.cls', {
    hook: {
        // init: 创建 DOM 之前执行的，其中获取不到 vnode 对应的 DOM 元素
        init (vnode) {
            console.log(vnode.elm)
        },
        // create：创建 DOM 完成之后执行的，其中可以获取 vnode 对应的 DOM 元素
        create (emptyNode, vnode) {
            console.log(vnode.elm)
        }
    }
}, 'Hello World')
let app = document.querySelector('#app')
// app.sel="test"  不可以在 dom 元素上添加 sel 属性，因为 snabbdom 是根据是否有 sel 属性判断是不是 vnode 的
patch(app, vnode)
// let oldVnode = patch(app, vnode)

// vnode = h('div#container.xxx', 'Hello Snabbdom')
// patch(oldVnode, vnode)

// f11 进入 patch 方法，继续按 f11 单步执行
// 由于我们 init 中没有传入模块，所以 cbs 中没有任何钩子函数
// 此时 vnode 不是一个 vnode 对象（dom对象没有sel属性），而是页面上的 #app 元素
// 会调用 emptyNodeAt 转换成 vnode 对象
// { "sel": "div#app", "data": {}, "children": [], "elm": {} }
// 判断新旧节点是否为相同节点（key 和 sel 是否相同），当前新旧节点不是
// vnode为：{ "sel": "div#container.cls", "data": {}, "text": "Hello World" }
// createElm 后为 vnode 添加了 key 和 children 属性为 undefined，添加了 elm 属性为 真实DOM
// 创建新节点的 dom 并插入，插入到 app 的前面，
// 移除旧节点的 dom

// patchVnode  createElm  removeVnodes
