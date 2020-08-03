import { observer } from "./observer/index"
import { proxy } from './until'
export function initState(vm) {
  const options = vm.$options

  if (options.props) {
    initProps(vm)
  }

  if (options.methods) {
    initMethods(vm)
  }

  if (options.data) {
    initData(vm)
  }

  if (options.computed) {
    initComputed(vm)
  }

  if (options.watch) {
    initWatch(vm)
  }
}

function initProps() { }
function initMethods() { }


function initData(vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data

  // 去vm上取值，代理到_data上
  for (const key in data) {
    console.log(vm, key, data);

    proxy(vm, '_data', key)
  }


  // 数据劫持，对象Object.defineProperty
  observer(data)

}
function initComputed() { }
function initWatch() { }