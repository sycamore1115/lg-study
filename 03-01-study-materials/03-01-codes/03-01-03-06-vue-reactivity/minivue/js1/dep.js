class Dep {
  constructor () {
    // 存储所有的观察者
    this.subs = []
  }
  // 添加观察者
  addSub (sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发送通知
  notify () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

//  dep 的作用就是在 getter 方法中收集依赖,
// 我们每一个响应式的属性,将来都会创建一个对应的 dep 对象
// 他负责收集所有依赖于该属性的地方
// 所有依赖于该属性的地方都会创建一个 watcher 对象
// 所以dep收集的就是依赖于该属性的 watcher 对象
// 我们在 setter 方法中会通知依赖,
// 当该属性的值发生变化的时候,会调用对应dep对象的 notify 发送通知
// 调用watcher 对象的 update 方法,

// 在 getter 中收集依赖,添加观察者,
// 在 setter 中触发依赖,调用观察者的 update

// 在使用 setter 修改值之前都会触发 getter 方法获取值的,

// 在 Observer 对象中创建 dep 对象


