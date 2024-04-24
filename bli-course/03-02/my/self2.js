/**
读 vue 源码2

入口文件: 
npm run dev
"rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
在 scripts/config.js 配置文件中定义了入口文件（web-full-dev）：
'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
}
web: resolve('src/platforms/web')
返回的入口文件：src/platforms/web/entry-runtime-with-compiler.js
查看入口文件：
同时设置 template 和 render 会执行哪个？ 
先判断是否有 render，没有 render 会将 template 编译成 render，有 render 则不会处理 template。

## 开始调试
引入我们打包后的 vue.js：
<body>
    <div id="app">
      vue
    </div>
    <script src="../../dist/vue.js"></script>
    <script>
      var vm = new Vue({
        el: '#app',
        template: '<h1>template</h1>',
        render(h) {
          return h('h1', 'render')
        }
      })
    </script>
  </body>
在浏览器中打开，并在控制台的 sources 栏下，找到入口文件 platforms/web/entry-runtime-with-compiler.js，
然后再 $mount 中设置断点，然后刷新界面。
此时我们看到右侧的 Call Stack 调用栈，这里可以看到方法的执行的过程，当前正在执行的是 Vue.$mount 方法，
上一个是 Vue._init  方法，点击这个方法可以进入，表示在这个方法中调用了 $mount 方法。
再往下是 Vue 函数，表示在 Vue 中调用了 Vue._init 。
最后是一个匿名函数，这个匿名函数是在 index.html 中调用 new Vue 的时候执行的构造函数，表示在这里调用了 Vue。

入口文件总结：
根据 el 参数选项找到对应的界面元素，判断 el 不能是 body 或者 html 标签
如果没有 render，把 template 转换成 render 函数
如果有 render 方法，直接调用 mount 挂载 DOM

## 问题
Vue 的构造函数在哪？
Vue 实例的成员/Vue 的静态成员从哪里来的？

entry-runtime.js 中非常简单的导入导出了 runtime 目录下的 index 中的 Vue
entry-runtime-with-compiler.js 中也是导入导出了 runtime 目录下的 index 中的 Vue，但是添加了一些代码，
重写了 Vue.prototype.$mount 方法，其中核心是将 template 转换为了 render 函数。

接下来，看看 runtime 目录下的 index 中的 Vue：
1. 在 Vue.config 上注册了一些和平台相关的特定通用的方法，从web/util/index中导入的，这是 Vue 内部使用的方法
2. 通过 extend 注册了一些全局的指令和组件
   extend(to, _from) 方法的作用是将 _from 上所有的成员都复制到 to 上。
   extend(Vue.options.directives, platformDirectives)  model,show
   extend(Vue.options.components, platformComponents)  Transition,TransitionGroup
   web平台特有的指令（v-model/v-show）和组件(<transition>/<transition-group>)
3. 在 Vue 的原型上注册了 __patch__ 方法
非浏览器环境会返回 noop，noop 是一个空函数：
export function noop (a?: any, b?: any, c?: any) {}
当前是浏览器环境，直接返回 patch：
patch 的功能是将虚拟 dom 转换成真实 dom，在学习 snabbdom 的时候，看过这个方法。

通过 inBrowser 来判断是否是浏览器环境：
typeof window !== 'undefined'  inBrowser 是通过是否有 window 全局变量来判断是否是浏览器环境的。

4. 在 Vue 的原型上注册了 $mount 方法
$mount 中调用了 mountComponent，它的作用就是渲染 DOM
5. 最后是一段关于 devtools 调试相关的代码，我们不关心
src\platforms\web\runtime\index.js

platforms 目录下的文件主要包含和平台相关的代码，接下来顺着 Vue 导入的地方，继续找到 src\core\index.js

### src\core\index.js
1. initGlobalAPI 给 Vue 的构造函数添加一些静态属性和方法：
   Vue.config
   Vue.util：存储公用的内部方法
   Vue.set
   Vue.delete
   Vue.nextTick
   Vue.observable：设置响应式数据
   Vue.options
   Vue.use
   Vue.mixin
2. 往 Vue 的原型上添加了一些成员，这些成员都是和服务的渲染相关的，可以忽略
3. 设置 Vue 的版本：Vue.version = '__VERSION__'

### core\instance\index.js
在这个文件中终于看到了 Vue 的构造函数！
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)  // 给 Vue 原型上添加 _init 方法
stateMixin(Vue)  // 混入 $data，$props 等属性
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
1. 非生产环境，必须使用 new 关键字调用 Vue，否则会提示警告
2. 调用 _init 方法，这个方法是在 initMixin 中初始化的。

创建了 Vue 构造函数
设置 Vue 实例的成员

为什么用构造函数实现，而不用类实现 Vue：
因为需要往 Vue 原型上挂载很多属性方法，如果用类的话，再使用原型就很不搭。

总结：
四个导出 Vue 的模块
src/platforms/web/entry-runtime-with-compiler.js
web 平台相关的入口
重写了平台相关的 $mount() 方法，添加将 template 转换为了 render 函数的代码
注册了 Vue.compile() 方法，传递一个 HTML 字符串返回 render 函数
主要就是增加了编译的功能
src/platforms/web/runtime/index.js
web 平台相关
注册和平台相关的全局指令：v-model、v-show
注册和平台相关的全局组件： transition、transition-group
都挂载到了 Vue.options.directives 和 Vue.options.components 上
原型上注册了两个全局方法：
__patch__：把虚拟 DOM 转换成真实 DOM
$mount：挂载方法
src/core/index.js
与平台无关
设置了 Vue 的静态方法 initGlobalAPI，给 Vue 的构造函数添加了很多静态属性和方法
src/core/instance/index.js
与平台无关
定义了构造函数，调用了 this._init(options) 方法
给 Vue 中混入了常用的实例成员

*/