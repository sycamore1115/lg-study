/*
// Vue 全局成员初始化的过程
我们先看一看 src/core/index.js 文件
src\core\global-api\index.js

initGlobalAPI :  Vue 的构造函数添加了很多静态属性和方法
这个方法一听名字就知道适用于初始化全局API的，在文档中，我们可以看到有以下全局API:
(
  use/mixin/extend/
  directive/filter/component/
  nextTick/set/delete/observable/
  compile/version
)
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
   Vue.use: 注册了 Vue.use 方法，用于注册插件，接收一个 plugin 插件作为参数
**/
    // 接收一个 plugin 插件作为参数
    Vue.use = function (plugin: Function | Object) {
        // *** 这里的 this 是 --- Vue的构造函数
        // 遍历已经安装的插件，如果已经安装就不再安装，返回已经安装的插件
        // 我们在实现 vueRouter 的时候也使用 install.installed 属性判断是否安装过，是否不必要？
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }

        // 如果是第一次安装这个插件
        // 获取去除 plugin 参数外的其他参数数组 args，并将 this 添加到数组的开头
        const args = toArray(arguments, 1)
        args.unshift(this)
        // 如果插件有 install 方法，执行插件的install方法，如果没有但是插件本身是个方法，那个执行插件方法
        if (typeof plugin.install === 'function') {
            plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') {
            plugin.apply(null, args)
        }
        // 将插件存储到已安装插件的数组中
        installedPlugins.push(plugin)
        return this
    }
/*
   Vue.mixin：混入
   // mixin 的属性，方法和生命周期，是覆盖还是添加？
   Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }

   Vue.extend：返回一个组件的构造函数
   // 核心代码 Sub 是一个 VueComponent 方法
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    // 改变了构造函数的原型，Super 是 Vue 的构造函数，将 Sub 的原型重置为了 Vue 的原型
    // 也就是 VueComponent 继承了 Vue
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    ...
    return Sub

   initAssetRegisters(Vue) 方法用于定义以下三个方法。这三个方法之所以可以一起定义，是因为他们的参数
   基本一致，可以参考 https://v2.cn.vuejs.org/v2/api/#Vue-directive 文档，都接收两个参数：
   1. {string} id
   2. {Function | Object} [definition] （filter 只可以是 Function)
   Vue.component: 全局组件
   Vue.directive：全局指令
   Vue.filter：全局过滤器
   
**/
// ASSET_TYPES: [ 'component', 'directive', 'filter' ]
ASSET_TYPES.forEach(type => {
    Vue[type] = function ( id: string, definition: Function | Object ): Function | Object | void {
      // 没有传 definition 定义参数，就是获取，直接返回
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        // 定义 component/directive/filter

        // 组件名校验，要符合 html5规范且不能是保留字符
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 如果类型是 component，且定义参数是普通对象，也就是没有经过 Vue.component 或者 Vue.extend 的
        if (type === 'component' && isPlainObject(definition)) {
          // 组件名取 name，没有设置 name 取 id
          definition.name = definition.name || id
          // this.options._base 就是 Vue 构造函数，Vue.extend(definition)，返回一个 VueComponent 构造函数
          definition = this.options._base.extend(definition)
        }
        // 如果类型是 directive ，且定义参数是是一个方法，对象则不做处理
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 类型为 filter 不做处理
        // 直接在 options 上添加 components/directives/filters
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
