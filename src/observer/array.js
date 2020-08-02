import { observer } from "."

// 拿到数组原型上的方法
let oldArrayProtoMethods = Array.prototype

// 继承 arrayMrthods.__proto__ = oldArrayProtoMethods
export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reserve',
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function (...arg) {
    const result = oldArrayProtoMethods[method].apply(this, arg)  // ?
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift': // 都是追加，需要继续检测
        inserted = arg
        break;

      case 'splice': //vue.$set原理
        inserted = arg.slice(2)
        break;
      default:
        break;
    }

    if (inserted) ob.observerArray(inserted)

    return result
  }
})
