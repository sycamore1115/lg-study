/*
当我们看 vue 源码的时候，会有很多标红或者不显示高亮的地方，这需要我们设置一下 vscode:
1. 在 vscode 的 settings.json 中添加 "javascript.validate.enable": false,
2. 添加 vscode 插件: Babel JavaScript

我们先看一看 src/core/index.js 文件
initGlobalAPI :  Vue 的构造函数添加了很多静态属性和方法
这个方法在 src\core\global-api\index.js，我们看下这个方法做了什么：
1. 初始化 config 成员
   在 src\platforms\web\runtime\index.js(平台相关) 中给config上添加了相应的方法
2. 设置了 util 成员，其中的方法是内部使用的，不建议我们去调用的
3. 定义了 set、delete、nextTick、observable 方法
4. 初始化 Vue.options 对象
   设置其为原型为 null 的对象
   向上添加 components/directives/filters 属性，用来存储全局的组件，指令和过滤器
   将 Vue 的构造函数存储到 options 对象的 _base 属性上
   将 builtInComponents 上所有的成员复制到 options 的 components 属性上，也就是注册全局组件KeepAlive
5. 给 Vue 注册了静态方法
   initUse：注册了 Vue.use 方法，用于注册插件
   Vue.use/Vue.mixin/Vue.extend/Vue.component/Vue.directive/Vue.filter
**/
Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
        return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
        plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
}