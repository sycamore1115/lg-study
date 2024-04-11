/**
读 vue 源码

1. vue 源码的下载和目录
项目地址：https://github.com/vuejs/vue
项目中最重要的就是 src 目录中的内容
src
├─compiler 编译相关，把 template 转换为 render 函数
├─core Vue 核心库
  ├─components 定义了 Vue 中自带的 keep-alive 组件
  ├─global-api 定义了 Vue 中的静态方法
  ├─instance 创建 Vue 实例的位置，定义了 Vue 中的构造函数、初始化以及生命周期钩子函数
  ├─observer 响应式机制实例的位置
  ├─util 公共方法
  ├─vdom 虚拟 DOM，重写了 snabbdom，增加了组件的机制
├─platforms 平台相关代码
  ├─web 浏览器
  ├─weex 移动端
├─server SSR，服务端渲染
├─sfc single file component，将 .vue 单文件编译为 js 对象
└─shared 公共的代码

vue2 中引入了 flow 进行类型检测，自己在官网学习

2. vue 源码的打包和调试 

打包工具：Rollup
Webpack 会把所有文件当作模块处理，而 Rollup 只处理 js。
开发项目适合使用 Webpack，开发库适合使用 Rollup。

注意切换到 dev 分支然后再 npm i 下载依赖

运行命令
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
-w: watch 监视源码的变化，当源码变化时立即重新打包
-c: 设置配置文件，后面跟的 scripts/config.js 就是配置文件了
--environment: 设置环境变量，用于打包生成不同版本的 vue
+ --sourcemap: 开启代码地图

dist 目录下有很多 js 文件，这些 js 文件就是不同版本的 vue，此时并没有 .map 文件
我们先删除 dist 目录
运行 npm run dev
会发现重新生成了 dist 目录，且目录下生成 vue.js 和 vue.js.map 文件
.map 文件记录了 src 中的源码和我们打包生成的 vue.js 之间的关系
其他版本的 vue 需要通过 npm run build 命令生成

调试：
打开 examples\grid\index.html 文件，其中引入的是 ../../dist/vue.min.js 文件，我们要改成 ../../dist/vue.js
在浏览器访问这个 index.html，打开控制台，在 Sources 我们可以看到 dist 和 src 目录，只有开启了 sourcemap
才可以在这里看到 src 目录。

然后打开 grid.js，找到创建 Vue 的位置打上断点，就可以进入 Vue 源码进行调试啦。

首先进入的是 vue\src\core\instance\index.js 

不同版本之间 Vue 的区别
首先通过 npm run build 打包出不同版本的 vue


vue.common.dev.js  vue.common.prod.js
vue.esm.browser.js  vue.esm.browser.min.js  vue.esm.js
vue.js  vue.min.js

vue.runtime.common.dev.js  vue.runtime.common.prod.js
vue.runtime.esm.js 
vue.runtime.js  vue.runtime.min.js 

经过总结，我们可以得出命名规则：
'vue' + 'runtime'/'' + ''/'common'/'esm' + 'js'

'runtime'/'':此字段表示vue是否为运行时版本
编译器：将 template 编译成为 render 渲染函数的代码，体积大、效率低。
运行时版本：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码，体积小、效率高。
           不支持 template，我们需要使用 render 代替。名称中包含 runtime 的就是运行时版本。
完整版：编译器 + 运行时版本，名称中不包含 runtime 的就是完整版本。

''/'common'/'esm'：此字段表明vue文件的模块方式
没有标明模块方式的文件就是 UMD 版本，标明 common 的文件使用的就是 CommonJS，
标明 esm 的文件使用的就是 ES Modules，这是当前最主流的模块方式。

Vue-CLI 创建的项目默认使用的是  vue.runtime.esm.js
浏览器是不支持单文件组件的，需要在打包的时候将这些单文件组件转换为 js 对象，
其中会将 template 模板转换为 render 函数。

 */