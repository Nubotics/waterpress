import EventEmitter from 'eventemitter3'
//import {API} from 'api-chain'
//const mixin = require('mixin')
//const mixed = mixin(EventEmitter, API)
import {
  has,

} from './util'
// to make this compatible with PhantomJS, add Function.prototype.bind polyfill if necessary
// from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {
      },
      fBound = function () {
        return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)))
      }
    fNOP.prototype = this.prototype
    fBound.prototype = new fNOP()
    return fBound
  }
}

var APIPrototype = {

  _onError(err) {
    if (this.options.onError) {
      this.options.onError(err)
    }
    else if (this.options.throwErrors) throw err
    return this
  },

  // merge/overwrite objects
  _extend(target, source, all) {
    target = target || {}
    for (var key in source) {
      // merge only if hasOwnProperty unless `all´ flag is set
      if (all || source.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
    return target
  },

  // add a method to the prototype
  _addMethod(name, method, namespace, isNamespaceEnd) {
    //console.log('name -> method -> namespace', name, method, namespace)

    let methodHandler = function () {
      var args = Array.prototype.slice.call(arguments)

      this.chain((next)=> {
        args.push(next)
        //args.push(this)
        if (namespace === 'catgory') {
          console.log('methodHandler', name, namespace, args)
          console.log('methodHandler', args)
        }

        method.apply(this, args)
      })

      if (isNamespaceEnd || !namespace) {
        return this
      } else {
        return this[namespace]
      }

    }

    if (!namespace) {
      this[name] = methodHandler.bind(this)
    } else {
      if (!has(this, namespace)) this[namespace] = {}
      this[namespace][name] = methodHandler.bind(this)
    }

    return this
  },

  // add a collection of methods (key/value pairs) to the prototype
  _addMethods(methods, namespace) {
    //console.log('methods -> namespace', methods, namespace)
    for (var name in methods) {
      if (methods.hasOwnProperty(name)) {
        if (!namespace) {
          this._addMethod(name, methods[name])
        } else {
          this._addMethod(name, methods[name], namespace)
        }

      }
    }
    return this
  },

  // advance to next cb
  next(err) {
    if (err) this._onError(err)
    if (this._continueErrors || !err) {
      var args = [].slice.call(arguments)
      if (this._callbacks.length > 0) {
        this._isQueueRunning = true
        var cb = this._callbacks.shift()
        cb = cb.bind(this)
        args = args.slice(1)
        args.push(this.next)
        cb.apply(this, args)

      } else {
        this._isQueueRunning = false
        this.start = (function () {
          this.start = null
          this.next.apply(this, args)
        }).bind(this)

      }
    }
    return this
  },

  // set instance property
  set(name, value, immediate) {
    if (immediate) {
      this[name] = value
    } else this.chain(function () {
      var args = Array.prototype.slice.call(arguments)
      var next = args.pop()
      this[name] = value
      args.unshift(null)
      next.apply(this, args)
    })
    return this
  },

  // set an option value (chainable)
  setOption(name, value) {
    this.options[name] = value
    return this
  },

  // set options based on key/value pairs (chainable)
  setOptions(options) {
    for (var name in options) {
      if (options.hasOwnProperty(name)) {
        this.setOption(name, options[name])
      }
    }
    return this
  },

  // add a callback to the execution chain
  chain(cb) {
    cb = this.wrap(cb)
    this._callbacks.push(cb)
    if (!this._isQueueRunning) {
      if (this.start) {
        this.start()
      } else this.next()
      // this.start()
    }
    return this
  },

  // wrap a function that has a signature of ([arg1], [arg2], ...[argn], callback)
  // where callback has a signature of (err, [arg1], [arg2], ... [argn])
  // example: api.wrap(require('fs').readFile)
  wrap (cb) {
    return function () {
      var args = Array.prototype.slice.call(arguments)
      var next = args.pop()

      args.push(function () {
        // if (err) return next(err)
        var iargs = Array.prototype.slice.call(arguments)

        next.apply(this, iargs)
      })
      cb.apply(this, args)
    }
  },
  // wait - pause execution flow for specified milliseconds
  wait(ms) {
    this.chain(function (next) {
      setTimeout(function () {
        next()
      }, ms)
    })
    return this
  },

  // until - pause execution flow until [cb] returns true
  until(cb) {
    var timeout
    this.chain(function (next) {
      function evaluate() {
        var ccb = cb.bind(api)
        var result = ccb()
        if (result) {
          clearInterval(poll)
          if (timeout !== undefined) clearTimeout(timeout)
          next()
        }
      }

      var api = this
      var poll = setInterval(evaluate, api._untilInterval || 30)
      // to set a timeout for condition to be met, set the _untilTimeout property to ms value
      if (api.untilTimeout) {
        timeout = setTimeout(function () {
          if (poll !== undefined) {
            clearInterval(poll)
            // to catch timeout of until conditions, set onUntilTimeout handler
            if (api.onUntilTimeout) api.onUntilTimeout(next)
            // otherwise execution flow simply continues as if condition was met
            else next()
          }
        }, api.untilTimeout)
      }
    })
    return this
  }

}

class BaseApi extends EventEmitter {
  constructor(options) {
    super(options)
    //bootable(this)
    for (var method in APIPrototype) {
      if (APIPrototype.hasOwnProperty(method)) {
        this[method] = APIPrototype[method].bind(this)
      }
    }
    options = options || {}
    this._callbacks = []
    this._isQueueRunning = false
    this.options = this._extend({
      throwErrors: !options.onError,
      continueErrors: false
    }, options)
  }
}

const create = function (options, methods) {
  if (arguments.length === 1) {
    methods = options
    options = null
  }
  var api = new API(options)

  api = api._addMethods(methods)

  return api
}

export { create }

export default BaseApi


