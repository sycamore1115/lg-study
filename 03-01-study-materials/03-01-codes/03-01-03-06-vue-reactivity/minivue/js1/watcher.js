class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    // data中的属性名称
    this.key = key
    // 回调函数负责更新视图
    this.cb = cb

    // 把watcher对象记录到Dep类的静态属性target
    Dep.target = this
    // 触发get方法，在get方法中会调用addSub
    this.oldValue = vm[key]
    Dep.target = null
  }
  // 当数据发生变化的时候更新视图
  update () {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }
    this.cb(newValue)
  }
}

// watcher对象要做两件事
// 1. 当数据变化触发依赖, dep 通知所有的 Watcher 实例更新视图
   // data 中的数据发生变化的时候，视图上关联 data 的地方要自动更新
// 2. 自身实例化的时候往 dep 对象中添加自己
   // 自身实例化就是 new Watcher, Dep.target = this

// watcher具有以下属性和方法
// vm
// key : 根据 vm 和 key 我们可以获取到属性的值，vm[key] 就是 oldValue 的值
// cb ： 回调函数，在创建 watcher 实例是作为参数传入，不同指令的监听要执行不同的更新视图操作
// oldValue： 用来记录数据变化之前的值，用于在 update 中和最新值进行比较
// update()