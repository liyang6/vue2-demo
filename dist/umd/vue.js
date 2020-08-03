(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('.')) :
  typeof define === 'function' && define.amd ? define(['.'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory(global._));
}(this, (function (_) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var oldArrayProtoMethods = Array.prototype; // 继承 arrayMrthods.__proto__ = oldArrayProtoMethods

  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reserve', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
      }

      var result = oldArrayProtoMethods[method].apply(this, arg); // ?

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          // 都是追加，需要继续检测
          inserted = arg;
          break;

        case 'splice':
          //vue.$set原理
          inserted = arg.slice(2);
          break;
      }

      if (inserted) ob.observerArray(inserted);
      return result;
    };
  });

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  }
  function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 判断一个对象是否被观测过，看有没有__ob__
      defineProperty(value, '__ob__', this); // 使用defineProperty重新定义树形

      if (Array.isArray(value)) {
        //函数劫持、切片编程 
        value.__proto__ = arrayMethods; // 观测数组中的对象类型，对象变化也要做处理

        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        value.forEach(function (item) {
          observer(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); //获取对象的key

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observer(value); //如果值是对象，继续观测。对象套对象，递归检测

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observer(newValue); // 设置值是对象，继续观测

        value = newValue;
      }
    });
  }

  function observer(data) {
    // 不是对象或者是null
    if (_typeof(data) !== 'object' || data === null) {
      return data;
    }

    if (data.__ob__) {
      // ？为什么可能被重复观测
      return data;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var options = vm.$options;

    if (options.props) ;

    if (options.methods) ;

    if (options.data) {
      initData(vm);
    }

    if (options.computed) ;

    if (options.watch) ;
  }

  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data; // 去vm上取值，代理到_data上

    for (var key in data) {
      console.log(vm, key, data);
      proxy(vm, '_data', key);
    } // 数据劫持，对象Object.defineProperty


    observer(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 响应式数据原理
      //初始化状态(data、props、watch、computed)，将数据初始化劫持，改变数据更新视图

      initState(vm); // Vue是个什么框架，借鉴MVVM
      // MVVM:数据变化视图会更新，视图变化数据会被影响，不能替你跳过数据去更新视图
      // ****要看下官网文档这块
    };
  }

  function Vue(options) {
    this._init(options); // 入口，初始化

  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
