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

--sourcemap 打包后不仅会生成对应的 .map 文件，且在 vue.js 的最后一行会生成注释：
//# sourceMappingURL=vue.js.map

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
el 不能是 body 或者 html 标签
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

*/