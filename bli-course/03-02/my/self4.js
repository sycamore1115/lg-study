/* Vue 实例成员初始化的过程
   src/core/instance/index.js
   其中主要调用了以下几个方法，都是给 Vue 的原型（实例）上混入了相应的成员：
**/
1. initMixin(Vue)
/* 
initMixin(Vue)： Vue.prototype._init，注册了 _init 方法，Vue 的入口方法，在 Vue 的构造函数中调用
**/

2. stateMixin(Vue)
// 用 Object.defineProperty 给 Vue 原型上添加了 $data 和 $props 属性，为了设置 get 和 set 
// 取值时返回 this._data 和 this._props，不能修改
Object.defineProperty(Vue.prototype, '$data', dataDef)
Object.defineProperty(Vue.prototype, '$props', propsDef)
// 添加了 $set $delete 和 $watch 方法
Vue.prototype.$set = set  (===Vue.set)
Vue.prototype.$delete = del  (===Vue.delete)
Vue.prototype.$watch = function() {...}

3. eventsMixin(Vue)
/*
  注册事件 ： $on  $once  $off  $emit  发布订阅模式
*/
$on:(vm._events[event] || (vm._events[event] = [])).push(fn)

4. lifecycleMixin(Vue)
/* 生命周期相关： 
_update: 最核心的是调用 __patch__ 方法，将虚拟 Dom 转换为真实 Dom，最终挂载到 $el 上
$forceUpdate: 强制更新
$destroy：销毁
*/

5. renderMixin(Vue)
// 安装了渲染相关的帮助方法
installRenderHelpers(Vue.prototype)
Vue.prototype.$nextTick
// 注册 _render 方法
Vue.prototype._render = function () {
   // 核心，vm.$options.render 是用户定义的 render 或者 template 编译后的 render
   const { render, _parentVnode } = vm.$options
   vnode = render.call(vm._renderProxy, vm.$createElement)
   // ...
}
