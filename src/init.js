import { initState } from './state'
import { compileToFunctions } from './compiler/index'
export function initMixin(Vue) {

  Vue.prototype._init = function (options) {

    const vm = this
    vm.$options = options

    // 响应式数据原理

    //初始化状态(data、props、watch、computed)，将数据初始化劫持，改变数据更新视图
    initState(vm)

    // Vue是个什么框架，借鉴MVVM
    // MVVM:数据变化视图会更新，视图变化数据会被影响，不能替你跳过数据去更新视图
    // ****要看下官网文档这块


    // 如果有el树形说明要渲染模板
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    // 挂在操作
    const vm = this
    el = document.querySelector(el)
    const options = vm.$options

    if (!options.render) {
      // 没render ，将template转成render
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML
      }

      // 编译原理，template转成render
      const render = compileToFunctions(template)
      options.render = render
    }
  }
}