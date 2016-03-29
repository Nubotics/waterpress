'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = undefined;

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// to make this compatible with PhantomJS, add Function.prototype.bind polyfill if necessary
// from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function fNOP() {},
        fBound = function fBound() {
      return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
    };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
  };
}

var APIPrototype = {
  _onError: function _onError(err) {
    if (this.options.onError) {
      this.options.onError(err);
    } else if (this.options.throwErrors) throw err;
    return this;
  },


  // merge/overwrite objects
  _extend: function _extend(target, source, all) {
    target = target || {};
    for (var key in source) {
      // merge only if hasOwnProperty unless `all´ flag is set
      if (all || source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
    return target;
  },


  // add a method to the prototype
  _addMethod: function _addMethod(name, method, namespace, isNamespaceEnd) {

    var methodHandler = function methodHandler() {
      var _this = this;

      var args = Array.prototype.slice.call(arguments);

      this.chain(function (next) {
        args.push(next);
        method.apply(_this, args);
      });

      if (isNamespaceEnd || !namespace) {
        return this;
      } else {
        return this[namespace];
      }
    };

    if (!namespace) {
      this[name] = methodHandler.bind(this);
    } else {
      if (!(0, _util.has)(this, namespace)) this[namespace] = {};
      this[namespace][name] = methodHandler.bind(this);
    }

    return this;
  },


  // add a collection of methods (key/value pairs) to the prototype
  _addMethods: function _addMethods(methods, namespace) {
    for (var name in methods) {
      if (methods.hasOwnProperty(name)) {
        if (!namespace) {
          this._addMethod(name, methods[name]);
        } else {
          this._addMethod(name, methods[name], namespace);
        }
      }
    }
    return this;
  },


  // advance to next cb
  next: function next(err) {
    if (err) this._onError(err);
    if (this._continueErrors || !err) {
      var args = [].slice.call(arguments);
      if (this._callbacks.length > 0) {
        this._isQueueRunning = true;
        var cb = this._callbacks.shift();
        cb = cb.bind(this);
        args = args.slice(1);
        args.push(this.next);
        cb.apply(this, args);
      } else {
        this._isQueueRunning = false;
        this.start = function () {
          this.start = null;
          this.next.apply(this, args);
        }.bind(this);
      }
    }
    return this;
  },


  // set instance property
  set: function set(name, value, immediate) {
    if (immediate) {
      this[name] = value;
    } else this.chain(function () {
      var args = Array.prototype.slice.call(arguments);
      var next = args.pop();
      this[name] = value;
      args.unshift(null);
      next.apply(this, args);
    });
    return this;
  },


  // set an option value (chainable)
  setOption: function setOption(name, value) {
    this.options[name] = value;
    return this;
  },


  // set options based on key/value pairs (chainable)
  setOptions: function setOptions(options) {
    for (var name in options) {
      if (options.hasOwnProperty(name)) {
        this.setOption(name, options[name]);
      }
    }
    return this;
  },


  // add a callback to the execution chain
  chain: function chain(cb) {
    cb = this.wrap(cb);
    this._callbacks.push(cb);
    if (!this._isQueueRunning) {
      if (this.start) {
        this.start();
      } else this.next();
      // this.start()
    }
    return this;
  },


  // wrap a function that has a signature of ([arg1], [arg2], ...[argn], callback)
  // where callback has a signature of (err, [arg1], [arg2], ... [argn])
  // example: api.wrap(require('fs').readFile)
  wrap: function wrap(cb) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var next = args.pop();

      args.push(function () {
        // if (err) return next(err)
        var iargs = Array.prototype.slice.call(arguments);

        next.apply(this, iargs);
      });
      cb.apply(this, args);
    };
  },

  // wait - pause execution flow for specified milliseconds
  wait: function wait(ms) {
    this.chain(function (next) {
      setTimeout(function () {
        next();
      }, ms);
    });
    return this;
  },


  // until - pause execution flow until [cb] returns true
  until: function until(cb) {
    var timeout;
    this.chain(function (next) {
      function evaluate() {
        var ccb = cb.bind(api);
        var result = ccb();
        if (result) {
          clearInterval(poll);
          if (timeout !== undefined) clearTimeout(timeout);
          next();
        }
      }

      var api = this;
      var poll = setInterval(evaluate, api._untilInterval || 30);
      // to set a timeout for condition to be met, set the _untilTimeout property to ms value
      if (api.untilTimeout) {
        timeout = setTimeout(function () {
          if (poll !== undefined) {
            clearInterval(poll);
            // to catch timeout of until conditions, set onUntilTimeout handler
            if (api.onUntilTimeout) api.onUntilTimeout(next);
            // otherwise execution flow simply continues as if condition was met
            else next();
          }
        }, api.untilTimeout);
      }
    });
    return this;
  }
};

var BaseApi = function (_EventEmitter) {
  _inherits(BaseApi, _EventEmitter);

  function BaseApi(options) {
    _classCallCheck(this, BaseApi);

    //bootable(this)

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseApi).call(this, options));

    for (var method in APIPrototype) {
      if (APIPrototype.hasOwnProperty(method)) {
        _this2[method] = APIPrototype[method].bind(_this2);
      }
    }
    options = options || {};
    _this2._callbacks = [];
    _this2._isQueueRunning = false;
    _this2.options = _this2._extend({
      throwErrors: !options.onError,
      continueErrors: false
    }, options);
    return _this2;
  }

  return BaseApi;
}(_eventemitter2.default);

var create = function create(options, methods) {
  if (arguments.length === 1) {
    methods = options;
    options = null;
  }
  var api = new API(options);

  api = api._addMethods(methods);

  return api;
};

exports.create = create;
exports.default = BaseApi;