import { arrayMethods } from './array'
import { defineProperty } from '../until'
class Observer {
  constructor(value) {

    // 判断一个对象是否被观测过，看有没有__ob__
    defineProperty(value, '__ob__', this)

    // 使用defineProperty重新定义树形
    if (Array.isArray(value)) {
      //函数劫持、切片编程 
      value.__proto__ = arrayMethods

      // 观测数组中的对象类型，对象变化也要做处理
      this.observerArray(value)
    } else {
      this.walk(value)
    }
  }

  observerArray(value) {
    value.forEach(item => {
      observer(item)
    })
  }

  walk(data) {
    let keys = Object.keys(data) //获取对象的key
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  observer(value) //如果值是对象，继续观测。对象套对象，递归检测
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue === value) return
      observer(newValue) // 设置值是对象，继续观测
      value = newValue
    }
  })
}

export function observer(data) {
  // 不是对象或者是null
  if (typeof data !== 'object' || data === null) {
    return data
  }

  if (data.__ob__) { // ？为什么可能被重复观测
    return data
  }
  return new Observer(data)
}