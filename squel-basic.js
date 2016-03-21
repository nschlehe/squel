'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Copyright (c) [Ramesh Nair](http://www.hiddentao.com/)

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return root.returnExportsGlobal = factory();
    });
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.squel = factory();
  }
})(undefined, function () {

  // append to string if non-empty
  function _pad(str, pad) {
    return str.length ? str + pad : str;
  }

  // for-of (temporary fix for #219 until v5 is released)
  function _forOf(arr, cb) {
    if (arr) {
      for (var i = 0; i < arr.length; ++i) {
        cb(arr[i]);
      }
    }
  };

  // Extend given object's with other objects' properties, overriding existing ones if necessary
  function _extend(dst) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    if (sources) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var src = _step.value;

          if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) === 'object') {
            Object.getOwnPropertyNames(src).forEach(function (key) {
              if (typeof src[key] !== 'function') {
                dst[key] = src[key];
              }
            });
          }
        };

        for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    return dst;
  };

  // get whether object is a plain object
  function _isPlainObject(obj) {
    return obj && obj.constructor.prototype === Object.prototype;
  };

  // get whether object is an array
  function _isArray(obj) {
    return obj && obj.constructor.prototype === Array.prototype;
  };

  // get class name of given object
  function _getObjectClassName(obj) {
    if (obj && obj.constructor && obj.constructor.toString) {
      var arr = obj.constructor.toString().match(/function\s*(\w+)/);

      if (arr && 2 === arr.length) {
        return arr[1];
      }
    }
  }

  // clone given item
  function _clone(src) {
    if (!src) {
      return src;
    }

    if (typeof src.clone === 'function') {
      return src.clone();
    } else if (_isPlainObject(src) || _isArray(src)) {
      var _ret2 = function () {
        var ret = new src.constructor();

        Object.getOwnPropertyNames(src).forEach(function (key) {
          if (typeof src[key] !== 'function') {
            ret[key] = _clone(src[key]);
          }
        });

        return {
          v: ret
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    } else {
      return JSON.parse(JSON.stringify(src));
    }
  };

  /**
   * Register a value type handler
   *
   * Note: this will override any existing handler registered for this value type.
   */
  function _registerValueHandler(handlers, type, handler) {
    var typeofType = typeof type === 'undefined' ? 'undefined' : _typeof(type);

    if (typeofType !== 'function' && typeofType !== 'string') {
      throw new Error("type must be a class constructor or string");
    }

    if (typeof handler !== 'function') {
      throw new Error("handler must be a function");
    }

    for (var idx in handlers) {
      var typeHandler = handlers[idx];

      if (typeHandler.type === type) {
        typeHandler.handler = handler;

        return;
      }
    }

    handlers.push({
      type: type,
      handler: handler
    });
  };

  /**
   * Get value type handler for given type
   */
  function getValueHandler(value) {
    for (var _len2 = arguments.length, handlerLists = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      handlerLists[_key2 - 1] = arguments[_key2];
    }

    for (var listIdx in handlerLists) {
      var handlers = handlerLists[listIdx];

      for (var handlerIdx in handlers) {
        var typeHandler = handlers[handlerIdx];

        // if type is a string then use `typeof` or else use `instanceof`
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === typeHandler.type || typeof typeHandler.type !== 'string' && value instanceof typeHandler.type) {
          return typeHandler.handler;
        }
      }
    }
  };

  /**
   * Build base squel classes and methods
   */
  function _buildSquel() {
    var flavour = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    var cls = {
      _getObjectClassName: _getObjectClassName
    };

    // default query builder options
    cls.DefaultQueryBuilderOptions = {
      // If true then table names will be rendered inside quotes. The quote character used is configurable via the nameQuoteCharacter option.
      autoQuoteTableNames: false,
      // If true then field names will rendered inside quotes. The quote character used is configurable via the nameQuoteCharacter option.
      autoQuoteFieldNames: false,
      // If true then alias names will rendered inside quotes. The quote character used is configurable via the `tableAliasQuoteCharacter` and `fieldAliasQuoteCharacter` options.
      autoQuoteAliasNames: true,
      // If true then table alias names will rendered after AS keyword.
      useAsForTableAliasNames: false,
      // The quote character used for when quoting table and field names
      nameQuoteCharacter: '`',
      // The quote character used for when quoting table alias names
      tableAliasQuoteCharacter: '`',
      // The quote character used for when quoting table alias names
      fieldAliasQuoteCharacter: '"',
      // Custom value handlers where key is the value type and the value is the handler function
      valueHandlers: [],
      // Character used to represent a parameter value
      parameterCharacter: '?',
      // Numbered parameters returned from toParam() as $1, $2, etc.
      numberedParameters: false,
      // Numbered parameters prefix character(s)
      numberedParametersPrefix: '$',
      // Numbered parameters start at this number.
      numberedParametersStartAt: 1,
      // If true then replaces all single quotes within strings. The replacement string used is configurable via the `singleQuoteReplacement` option.
      replaceSingleQuotes: false,
      // The string to replace single quotes with in query strings
      singleQuoteReplacement: '\'\'',
      // String used to join individual blocks in a query when it's stringified
      separator: ' '
    };

    // Global custom value handlers for all instances of builder
    cls.globalValueHandlers = [];

    /*
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    # Custom value types
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
     */

    // Register a new value handler
    cls.registerValueHandler = function (type, handler) {
      _registerValueHandler(cls.globalValueHandlers, type, handler);
    };

    /*
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    # Base classes
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    */

    // Base class for cloneable builders
    cls.Cloneable = function () {
      function _class() {
        _classCallCheck(this, _class);
      }

      _createClass(_class, [{
        key: 'clone',

        /**
         * Clone this builder
         */
        value: function clone() {
          var newInstance = new this.constructor();

          return _extend(newInstance, _clone(_extend({}, this)));
        }
      }]);

      return _class;
    }();

    // Base class for all builders
    cls.BaseBuilder = function (_cls$Cloneable) {
      _inherits(_class2, _cls$Cloneable);

      /**
       * Constructor.
       * this.param  {Object} options Overriding one or more of `cls.DefaultQueryBuilderOptions`.
       */

      function _class2(options) {
        _classCallCheck(this, _class2);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class2).call(this));

        var defaults = JSON.parse(JSON.stringify(cls.DefaultQueryBuilderOptions));

        _this.options = _extend({}, defaults, options);
        return _this;
      }

      /**
       * Register a custom value handler for this builder instance.
       *
       * Note: this will override any globally registered handler for this value type.
       */


      _createClass(_class2, [{
        key: 'registerValueHandler',
        value: function registerValueHandler(type, handler) {
          _registerValueHandler(this.options.valueHandlers, type, handler);

          return this;
        }

        /**
         * Sanitize given expression.
         */

      }, {
        key: '_sanitizeExpression',
        value: function _sanitizeExpression(expr) {
          // If it's not an Expression builder instance
          if (!(expr instanceof cls.Expression)) {
            // It must then be a string
            if (typeof expr !== "string") {
              throw new Error("expression must be a string or Expression instance");
            }
          }

          return expr;
        }

        /**
         * Sanitize the given name.
         *
         * The 'type' parameter is used to construct a meaningful error message in case validation fails.
         */

      }, {
        key: '_sanitizeName',
        value: function _sanitizeName(value, type) {
          if (typeof value !== "string") {
            throw new Error(type + ' must be a string');
          }

          return value;
        }
      }, {
        key: '_sanitizeField',
        value: function _sanitizeField(item) {
          var _this2 = this;

          var formattingOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          if (item instanceof cls.QueryBuilder) {
            item = '(' + item + ')';
          } else {
            item = this._sanitizeName(item, "field name");

            if (this.options.autoQuoteFieldNames) {
              (function () {
                var quoteChar = _this2.options.nameQuoteCharacter;

                if (formattingOptions.ignorePeriodsForFieldNameQuotes) {
                  // a.b.c -> `a.b.c`
                  item = '' + quoteChar + item + quoteChar;
                } else {
                  // a.b.c -> `a`.`b`.`c`
                  item = item.split('.').map(function (v) {
                    // treat '*' as special case (#79)
                    return '*' === v ? v : '' + quoteChar + v + quoteChar;
                  }).join('.');
                }
              })();
            }
          }

          return item;
        }
      }, {
        key: '_sanitizeNestableQuery',
        value: function _sanitizeNestableQuery(item) {
          if (item instanceof cls.QueryBuilder && item.isNestable()) {
            return item;
          }

          throw new Error("must be a nestable query, e.g. SELECT");
        }
      }, {
        key: '_sanitizeTable',
        value: function _sanitizeTable(item) {
          var allowNested = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

          if (allowNested) {
            if (typeof item !== "string") {
              try {
                item = this._sanitizeNestableQuery(item);
              } catch (e) {
                throw new Error("table name must be a string or a nestable query instance");
              }
            }
          } else {
            item = this._sanitizeName(item, 'table name');
          }

          if (this.options.autoQuoteTableNames) {
            var quoteChar = this.options.nameQuoteCharacter;

            return '' + quoteChar + item + quoteChar;
          } else {
            return item;
          }
        }
      }, {
        key: '_sanitizeTableAlias',
        value: function _sanitizeTableAlias(item) {
          var sanitized = this._sanitizeName(item, "table alias");

          if (this.options.autoQuoteAliasNames) {
            var quoteChar = this.options.tableAliasQuoteCharacter;

            sanitized = '' + quoteChar + sanitized + quoteChar;
          }

          if (this.options.useAsForTableAliasNames) {
            return 'AS ' + sanitized;
          } else {
            return sanitized;
          }
        }
      }, {
        key: '_sanitizeFieldAlias',
        value: function _sanitizeFieldAlias(item) {
          var sanitized = this._sanitizeName(item, "field alias");

          if (this.options.autoQuoteAliasNames) {
            var quoteChar = this.options.fieldAliasQuoteCharacter;

            return '' + quoteChar + sanitized + quoteChar;
          } else {
            return sanitized;
          }
        }

        // Sanitize the given limit/offset value.

      }, {
        key: '_sanitizeLimitOffset',
        value: function _sanitizeLimitOffset(value) {
          value = parseInt(value);

          if (0 > value || isNaN(value)) {
            throw new Error("limit/offset must be >= 0");
          }

          return value;
        }

        // Santize the given field value

      }, {
        key: '_sanitizeValue',
        value: function _sanitizeValue(item) {
          var itemType = typeof item === 'undefined' ? 'undefined' : _typeof(item);

          if (null === item) {
            // null is allowed
          } else if ("string" === itemType || "number" === itemType || "boolean" === itemType) {
              // primitives are allowed
            } else if (item instanceof cls.QueryBuilder && item.isNestable()) {
                // QueryBuilder instances allowed
              } else if (item instanceof cls.FunctionBlock) {
                  // FunctionBlock instances allowed
                } else {
                    var typeIsValid = !!getValueHandler(item, this.options.valueHandlers, cls.globalValueHandlers);

                    if (!typeIsValid) {
                      throw new Error("field value must be a string, number, boolean, null or one of the registered custom value types");
                    }
                  }

          return item;
        }

        // Escape a string value, e.g. escape quotes and other characters within it.

      }, {
        key: '_escapeValue',
        value: function _escapeValue(value) {
          return !this.options.replaceSingleQuotes ? value : value.replace(/\'/g, this.options.singleQuoteReplacement);
        }

        // Format the given custom value

      }, {
        key: '_formatCustomValue',
        value: function _formatCustomValue(value) {
          var asParam = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

          // user defined custom handlers takes precedence
          var customHandler = getValueHandler(value, this.options.valueHandlers, cls.globalValueHandlers);

          // use the custom handler if available
          if (customHandler) {
            value = customHandler(value, asParam);
          }

          return value;
        }

        // Format the given field value for inclusion into query parameter array

      }, {
        key: '_formatValueAsParam',
        value: function _formatValueAsParam(value) {
          var _this3 = this;

          if (_isArray(value)) {
            return value.map(function (v) {
              return _this3._formatValueAsParam(v);
            });
          } else {
            if (value instanceof cls.QueryBuilder && value.isNestable()) {
              value.updateOptions({
                "nestedBuilder": true
              });

              return value.toParam();
            } else if (value instanceof cls.Expression) {
              return value.toParam();
            } else {
              return this._formatCustomValue(value, true);
            }
          }
        }

        // Format the given field value for inclusion into the query string

      }, {
        key: '_formatValue',
        value: function _formatValue(value) {
          var _this4 = this;

          var formattingOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          var customFormattedValue = this._formatCustomValue(value);

          // if formatting took place then return it directly
          if (customFormattedValue !== value) {
            return '(' + customFormattedValue + ')';
          }

          // if it's an array then format each element separately
          if (_isArray(value)) {
            value = value.map(function (v) {
              return _this4._formatValue(v);
            });

            value = '(' + value.join(', ') + ')';
          } else {
            var typeofValue = typeof value === 'undefined' ? 'undefined' : _typeof(value);

            if (null === value) {
              value = "NULL";
            } else if (typeofValue === "boolean") {
              value = value ? "TRUE" : "FALSE";
            } else if (value instanceof cls.QueryBuilder) {
              value = '(' + value + ')';
            } else if (value instanceof cls.Expression) {
              value = '(' + value + ')';
            } else if (typeofValue !== "number") {
              if (formattingOptions.dontQuote) {
                value = '' + value;
              } else {
                var escapedValue = this._escapeValue(value);

                value = '\'' + escapedValue + '\'';
              }
            }
          }

          return value;
        }

        /** 
         * Build given string and its corresponding parameter values into 
         * output.
         * 
         * @param {String} str
         * @param {Array}  values
         * @param {Object} [options] Additional options.
         * @param {Boolean} [options.buildParameterized] Whether to build paramterized string. Default is false.
         * @param {Boolean} [options.nested] Whether this expression is nested within another.
         * @return {Object}
         */

      }, {
        key: '_buildString',
        value: function _buildString(str, values) {
          var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          values = values || [];
          str = str || '';

          var formattedStr = '',
              curValue = -1,
              formattedValues = [];

          var paramChar = this.options.parameterCharacter;

          var idx = 0;

          while (str.length > idx) {
            // param char?
            if (str.substr(idx, paramChar.length) === paramChar) {
              var value = values[++curValue];

              if (options.buildParameterized) {
                var finalValue = this._formatValueAsParam(value);

                if (_isArray(finalValue)) {
                  // 6 -> "(??, ??, ??, ??, ??, ??)"
                  var tmpStr = '';
                  for (var num = 0; finalValue.length > num; ++num) {
                    tmpStr = _pad(tmpStr, ', ');
                    tmpStr += paramChar;
                  }
                  formattedStr += '(' + tmpStr + ')';

                  formattedValues.push.apply(formattedValues, _toConsumableArray(finalValue));
                } else {
                  formattedStr += this.options.parameterCharacter;

                  formattedValues.push(finalValue);
                }
              } else {
                formattedStr += this._formatValue(value);
              }

              idx += paramChar.length;
            } else {
              formattedStr += str.charAt(idx);

              idx++;
            }
          }

          if (options.nested) {
            formattedStr = '(' + formattedStr + ')';
          }

          return {
            text: formattedStr,
            values: formattedValues
          };
        }
      }]);

      return _class2;
    }(cls.Cloneable);

    cls.StringsBuilder = function (_cls$BaseBuilder) {
      _inherits(_class3, _cls$BaseBuilder);

      function _class3(options) {
        _classCallCheck(this, _class3);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class3).call(this, options));

        _this5._strings = [];
        _this5._values = [];
        return _this5;
      }

      /** 
       * Add a string and its corresponding parameter values.
       * @param {String} str
       * @param {Array}  values
       */


      _createClass(_class3, [{
        key: '_addToStrings',
        value: function _addToStrings() {
          var str = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
          var values = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

          this.__strings.push(str);
          this.__values.push(values);
        }

        /** 
         * Build all added strings and values.
         * 
         * @param {Object} [options] Options.
         * @param {Boolean} [options.buildParameterized] Whether to build paramterized string. Default is false.
         * @return {Object}
         */

      }, {
        key: '_buildAllStrings',
        value: function _buildAllStrings() {
          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var totalStr = [],
              totalValues = [];

          for (var idx in this.__strings) {
            var str = this.__strings[idx],
                values = this.__values[idx];

            var _processString = this._processString(str, values, options);

            var text = _processString.text;
            var finalValues = _processString.finalValues;


            totalStr.push(text);
            totalValues.push.apply(totalValues, _toConsumableArray(finalValues));
          }

          return {
            text: totalStr.join(this.options.separator),
            values: totalValues
          };
        }
      }]);

      return _class3;
    }(cls.BaseBuilder);

    /*
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    # cls.Expressions
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    */

    /**
     * An SQL expression builder.
     *
     * SQL expressions are used in WHERE and ON clauses to filter data by various criteria.
     *
     * Expressions can be nested. Nested expression contains can themselves 
     * contain nested expressions. When rendered a nested expression will be 
     * fully contained within brackets.
     * 
     * All the build methods in this object return the object instance for chained method calling purposes.
     */
    cls.Expression = function (_cls$BaseBuilder2) {
      _inherits(_class4, _cls$BaseBuilder2);

      // Initialise the expression.

      function _class4(options) {
        _classCallCheck(this, _class4);

        var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class4).call(this, options));

        _this6._nodes = [];
        return _this6;
      }

      // Combine the current expression with the given expression using the intersection operator (AND).


      _createClass(_class4, [{
        key: 'and',
        value: function and(expr) {
          for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            params[_key3 - 1] = arguments[_key3];
          }

          expr = this._sanitizeExpression(expr);

          this._nodes.push({
            type: 'AND',
            expr: expr,
            para: params
          });

          return this;
        }

        // Combine the current expression with the given expression using the union operator (OR).

      }, {
        key: 'or',
        value: function or(expr) {
          for (var _len4 = arguments.length, params = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            params[_key4 - 1] = arguments[_key4];
          }

          expr = this._sanitizeExpression(expr);

          this._nodes.push({
            type: 'OR',
            expr: expr,
            para: params
          });

          return this;
        }

        /**
         * Get the expression string.
         * @return {String}
         */

      }, {
        key: 'toString',
        value: function toString() {
          return this._toString().text;
        }

        /**
         * Get the parameterized expression string.
         * @return {Object}
         */

      }, {
        key: 'toParam',
        value: function toParam() {
          return this._toString({
            buildParameterized: true
          });
        }

        /**
         * @param {Object} [options] Options.
         * @param {Boolean} [options.buildParameterized] Whether to build paramterized string. Default is false.
         * @param {Boolean} [options.nested] Whether this expression is nested within another.
         * @return {Object}
         */

      }, {
        key: '_toString',
        value: function _toString() {
          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var totalStr = [],
              totalValues = [];

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this._nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var node = _step2.value;
              var type = node.type;
              var expr = node.expr;
              var para = node.para;


              var ret = expr instanceof cls.Expression ? expr._toString({
                buildParameterized: options.buildParameterized,
                nested: true
              }) : this._buildString(expr, para, {
                buildParameterized: options.buildParameterized
              });

              var text = ret.text;
              var values = ret.values;


              if (totalStr.length) {
                totalStr.push(type);
              }

              totalStr.push(text);
              totalValues.push.apply(totalValues, _toConsumableArray(values));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          totalStr = totalStr.join(' ');

          if (options.nested) {
            totalStr = '(' + totalStr + ')';
          }

          return {
            text: totalStr,
            values: totalValues
          };
        }
      }]);

      return _class4;
    }(cls.BaseBuilder);

    /*
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    # cls.Case
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    */

    /**
     * An SQL CASE expression builder.
     *
     * SQL cases are used to select proper values based on specific criteria.
     */
    cls.Case = function (_cls$BaseBuilder3) {
      _inherits(_class5, _cls$BaseBuilder3);

      function _class5(fieldName) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, _class5);

        var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class5).call(this, options));

        if (_isPlainObject(fieldName)) {
          options = fieldName;

          fieldName = null;
        }

        if (fieldName) {
          _this7._fieldName = _this7._sanitizeField(fieldName);
        }

        _this7.options = _extend({}, cls.DefaultQueryBuilderOptions, options);

        _this7._cases = [];
        _this7._elseValue = null;
        return _this7;
      }

      _createClass(_class5, [{
        key: 'when',
        value: function when(expression) {
          for (var _len5 = arguments.length, values = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            values[_key5 - 1] = arguments[_key5];
          }

          this._cases.unshift({
            expression: expression,
            values: values
          });

          return this;
        }
      }, {
        key: 'then',
        value: function then(result) {
          if (this._cases.length == 0) {
            throw new Error("when() needs to be called first");
          }

          this._cases[0].result = result;

          return this;
        }
      }, {
        key: 'else',
        value: function _else(elseValue) {
          this._elseValue = elseValue;

          return this;
        }
      }, {
        key: 'toString',
        value: function toString() {
          return this._toString().text;
        }
      }, {
        key: 'toParam',
        value: function toParam() {
          return this._toString({
            buildParameterized: true
          });
        }

        /**
         * @param {Object} [options] Options.
         * @param {Boolean} [options.buildParameterized] Whether to build paramterized string. Default is false.
         * @param {Boolean} [options.nested] Whether this expression is nested within another.
         * @return {Object}
         */

      }, {
        key: '_toString',
        value: function _toString() {
          var _this8 = this;

          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var totalStr = [],
              totalValues = [];

          if (this._cases.length == 0) {
            totalStr = '' + this._formatValue(this._elseValue);
          } else {
            var cases = this._cases.map(function (part) {
              var expression = part.expression;
              var values = part.values;
              var result = part.result;


              var condition = new cls.AbstractConditionBlock("WHEN");

              condition._condition.apply(condition, [expression].concat(values));

              var str = '';

              if (!options.buildParameterized) {
                str = condition.buildStr();
              } else {
                var ret = condition.buildParam();
                str = ret.text;
                totalValues.push.apply(totalValues, _toConsumableArray(ret.values));
              }

              return str + ' THEN ' + _this8._formatValue(result);
            });

            var str = cases.join(" ") + ' ELSE ' + this._formatValue(this._elseValue) + ' END';

            if (this._fieldName) {
              str = this._fieldName + ' ' + str;
            }

            totalStr = 'CASE ' + str;
          }

          return {
            text: totalStr,
            values: totalValues
          };
        }
      }]);

      return _class5;
    }(cls.BaseBuilder);

    /*
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    # Building blocks
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    */

    /*
    # A building block represents a single build-step within a query building process.
    #
    # Query builders consist of one or more building blocks which get run in a particular order. Building blocks can
    # optionally specify methods to expose through the query builder interface. They can access all the input data for
    # the query builder and manipulate it as necessary, as well as append to the final query string output.
    #
    # If you wish to customize how queries get built or add proprietary query phrases and content then it is recommended
    # that you do so using one or more custom building blocks.
    #
    # Original idea posted in https://github.com/hiddentao/export/issues/10#issuecomment-15016427
    */
    cls.Block = function (_cls$BaseBuilder4) {
      _inherits(_class6, _cls$BaseBuilder4);

      function _class6(options) {
        _classCallCheck(this, _class6);

        var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class6).call(this, options));

        _this9._strings = [];
        _this9._values = [];
        return _this9;
      }

      /**
      # Get input methods to expose within the query builder.
      #
      # By default all methods except the following get returned:
      #   methods prefixed with _
      #   constructor and buildStr()
      #
      # @return Object key -> function pairs
      */


      _createClass(_class6, [{
        key: 'exposedMethods',
        value: function exposedMethods() {
          var ret = {};

          var obj = this;

          while (obj) {
            Object.getOwnPropertyNames(obj).forEach(function (prop) {
              if ('constructor' !== prop && typeof obj[prop] === "function" && prop.charAt(0) !== '_' && !cls.Block.prototype[prop]) {
                ret[prop] = obj[prop];
              }
            });

            obj = Object.getPrototypeOf(obj);
          };

          return ret;
        }

        /**
         # Build this block.
         #
         # Subclasses may override this method.
         #
         # @param queryBuilder cls.QueryBuilder a reference to the query builder that owns this block.
         #
         # @return String the string representing this block
         */

      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          return '';
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          return {
            text: this.buildStr(queryBuilder),
            values: []
          };
        }
      }]);

      return _class6;
    }(cls.BaseBuilder);

    // A String which always gets output
    cls.StringBlock = function (_cls$Block) {
      _inherits(_class7, _cls$Block);

      function _class7(options, str) {
        _classCallCheck(this, _class7);

        var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class7).call(this, options));

        _this10.str = str;
        return _this10;
      }

      _createClass(_class7, [{
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          return this.str;
        }
      }]);

      return _class7;
    }(cls.Block);

    // An arbitrary value or db function with parameters
    cls.AbstractValueBlock = function (_cls$Block2) {
      _inherits(_class8, _cls$Block2);

      // Constructor

      function _class8(options) {
        _classCallCheck(this, _class8);

        var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class8).call(this, options));

        _this11._str = '';
        _this11._values = [];
        return _this11;
      }

      _createClass(_class8, [{
        key: '_setValue',
        value: function _setValue(str) {
          this._str = str;

          for (var _len6 = arguments.length, values = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            values[_key6 - 1] = arguments[_key6];
          }

          this._values = values;
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          var str = this._str;
          var finalStr = '';
          var values = [].concat(this._values);

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = str[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var c = _step3.value;

              if (this.options.parameterCharacter === c && 0 < values.length) {
                c = values.shift();
              }

              finalStr += c;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          return finalStr;
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          return { text: this._str, values: this._values };
        }
      }]);

      return _class8;
    }(cls.Block);

    // A function string block
    cls.FunctionBlock = function (_cls$AbstractValueBlo) {
      _inherits(_class9, _cls$AbstractValueBlo);

      function _class9() {
        _classCallCheck(this, _class9);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class9).apply(this, arguments));
      }

      _createClass(_class9, [{
        key: 'function',
        value: function _function(str) {
          for (var _len7 = arguments.length, values = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
            values[_key7 - 1] = arguments[_key7];
          }

          this._setValue.apply(this, [str].concat(values));
        }
      }]);

      return _class9;
    }(cls.AbstractValueBlock);

    // Construct a FunctionValueBlock object for use as a value
    cls.fval = function () {
      var inst = new cls.FunctionBlock();
      inst.function.apply(inst, arguments);
      return inst;
    };

    // value handler for FunctionValueBlock objects
    cls.registerValueHandler(cls.FunctionBlock, function (value) {
      var asParam = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      return asParam ? value.buildParam() : value.buildStr();
    });

    /*
    # Table specifier base class
    #
    # Additional options
    #  - singleTable - only allow one table to be specified  (default: false)
    #  - allowNested - allow nested query to be specified as a table    (default: false)
    */
    cls.AbstractTableBlock = function (_cls$Block3) {
      _inherits(_class10, _cls$Block3);

      function _class10(options) {
        _classCallCheck(this, _class10);

        var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class10).call(this, options));

        _this13.tables = [];
        return _this13;
      }

      /**
      # Update given table.
      #
      # An alias may also be specified for the table.
      #
      # Concrete subclasses should provide a method which calls this
      */


      _createClass(_class10, [{
        key: '_table',
        value: function _table(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          if (alias) {
            alias = this._sanitizeTableAlias(alias);
          }

          table = this._sanitizeTable(table, !!this.options.allowNested);

          if (this.options.singleTable) {
            this.tables = [];
          }

          this.tables.push({
            table: table,
            alias: alias
          });
        }

        // get whether a table has been set

      }, {
        key: '_hasTable',
        value: function _hasTable() {
          return 0 < this.tables.length;
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          if (!this._hasTable()) {
            return "";
          }

          var tables = "";

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = this.tables[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var table = _step4.value;

              if (tables.length) {
                tables += ", ";
              }

              if ("string" === typeof table.table) {
                tables += table.table;
              } else {
                // building a nested query
                tables += '(' + table.table + ')';
              }

              if (table.alias) {
                // add the table alias
                tables += ' ' + table.alias;
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          return tables;
        }
      }, {
        key: '_buildParam',
        value: function _buildParam(queryBuilder) {
          var prefix = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          var ret = {
            text: "",
            values: []
          };

          var params = [];
          var paramStr = "";

          if (!this._hasTable()) {
            return ret;
          }

          // retrieve the parameterised queries
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = this.tables[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var blk = _step5.value;

              var p = void 0;

              if ("string" === typeof blk.table) {
                p = { "text": '' + blk.table, "values": [] };
              } else if (blk.table instanceof cls.QueryBuilder) {
                // building a nested query
                blk.table.updateOptions({ "nestedBuilder": true });
                p = blk.table.toParam();
              } else {
                // building a nested query
                blk.updateOptions({ "nestedBuilder": true });
                p = blk.buildParam(queryBuilder);
              }

              p.table = blk;

              params.push(p);
            }

            // join the queries and their parameters
            // this is the last building block processed so always add UNION if there are any UNION blocks
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = params[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var _p = _step6.value;

              if (paramStr.length) {
                paramStr += ", ";
              } else {
                if (!!prefix && prefix.length) {
                  paramStr += prefix + ' ' + paramStr;
                }
              }

              if ("string" === typeof _p.table.table) {
                paramStr += '' + _p.text;
              } else {
                paramStr += '(' + _p.text + ')';
              }

              // add the table alias, the AS keyword is optional
              if (!!_p.table.alias) {
                paramStr += ' ' + _p.table.alias;
              }

              var _iteratorNormalCompletion7 = true;
              var _didIteratorError7 = false;
              var _iteratorError7 = undefined;

              try {
                for (var _iterator7 = _p.values[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                  var v = _step7.value;

                  ret.values.push(this._formatCustomValue(v));
                }
              } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                  }
                } finally {
                  if (_didIteratorError7) {
                    throw _iteratorError7;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          ret.text += paramStr;

          return ret;
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          return this._buildParam(queryBuilder);
        }
      }]);

      return _class10;
    }(cls.Block);

    // Update Table
    cls.UpdateTableBlock = function (_cls$AbstractTableBlo) {
      _inherits(_class11, _cls$AbstractTableBlo);

      function _class11() {
        _classCallCheck(this, _class11);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class11).apply(this, arguments));
      }

      _createClass(_class11, [{
        key: 'table',
        value: function table(_table2) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          this._table(_table2, alias);
        }
      }]);

      return _class11;
    }(cls.AbstractTableBlock);

    // FROM table
    cls.FromTableBlock = function (_cls$AbstractTableBlo2) {
      _inherits(_class12, _cls$AbstractTableBlo2);

      function _class12() {
        _classCallCheck(this, _class12);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class12).apply(this, arguments));
      }

      _createClass(_class12, [{
        key: 'from',
        value: function from(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          this._table(table, alias);
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          var tables = _get(Object.getPrototypeOf(_class12.prototype), 'buildStr', this).call(this, queryBuilder);

          return tables.length ? 'FROM ' + tables : "";
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          return this._buildParam(queryBuilder, "FROM");
        }
      }]);

      return _class12;
    }(cls.AbstractTableBlock);

    // INTO table
    cls.IntoTableBlock = function (_cls$Block4) {
      _inherits(_class13, _cls$Block4);

      function _class13(options) {
        _classCallCheck(this, _class13);

        var _this16 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class13).call(this, options));

        _this16.table = null;
        return _this16;
      }

      // Into given table.


      _createClass(_class13, [{
        key: 'into',
        value: function into(table) {
          // do not allow nested table to be the target
          this.table = this._sanitizeTable(table, false);
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          if (!this.table) {
            throw new Error("into() needs to be called");
          }

          return 'INTO ' + this.table;
        }
      }]);

      return _class13;
    }(cls.Block);

    // (SELECT) Get field
    cls.GetFieldBlock = function (_cls$Block5) {
      _inherits(_class14, _cls$Block5);

      function _class14(options) {
        _classCallCheck(this, _class14);

        var _this17 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class14).call(this, options));

        _this17._fieldAliases = {};
        _this17._fields = [];
        return _this17;
      }

      /**
      # Add the given fields to the final result set.
      #
      # The parameter is an Object containing field names (or database functions) as the keys and aliases for the fields
      # as the values. If the value for a key is null then no alias is set for that field.
      #
      # Internally this method simply calls the field() method of this block to add each individual field.
      #
      # options.ignorePeriodsForFieldNameQuotes - whether to ignore period (.) when automatically quoting the field name
      */


      _createClass(_class14, [{
        key: 'fields',
        value: function fields(_fields) {
          var _this18 = this;

          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          if (_isArray(_fields)) {
            _forOf(_fields, function (field) {
              _this18.field(field, null, options);
            });
          } else {
            for (var field in _fields) {
              var alias = _fields[field];

              this.field(field, alias, options);
            }
          }
        }

        /**
        # Add the given field to the final result set.
        #
        # The 'field' parameter does not necessarily have to be a fieldname. It can use database functions too,
        # e.g. DATE_FORMAT(a.started, "%H")
        #
        # An alias may also be specified for this field.
        #
        # options.ignorePeriodsForFieldNameQuotes - whether to ignore period (.) when automatically quoting the field name
        */

      }, {
        key: 'field',
        value: function field(_field) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          if (alias) {
            alias = this._sanitizeFieldAlias(alias);
          }

          // if field-alias already present then don't add
          if (this._fieldAliases.hasOwnProperty(_field) && this._fieldAliases[_field] === alias) {
            return this;
          }

          var fieldRec = {
            alias: alias
          };

          if (_field instanceof cls.Case) {
            fieldRec.func = _field;
          } else {
            fieldRec.name = this._sanitizeField(_field, options);
          }

          if (options.aggregation) {
            fieldRec.aggregation = options.aggregation;
          }

          this._fieldAliases[_field] = alias;
          this._fields.push(fieldRec);
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          return this._build(queryBuilder);
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          return this._build(queryBuilder, true);
        }
      }, {
        key: '_build',
        value: function _build(queryBuilder) {
          var paramMode = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

          if (!queryBuilder.getBlock(cls.FromTableBlock)._hasTable()) {
            if (paramMode) {
              return {
                text: "",
                values: []
              };
            } else {
              return "";
            }
          }

          var fields = "";
          var values = [];

          _forOf(this._fields, function (field) {
            if (fields.length) {
              fields += ", ";
            }
            if (field.aggregation) {
              fields += field.aggregation + "(";
            }
            if (field.func) {
              if (paramMode) {
                var caseExpr = field.func.toParam();
                fields += caseExpr.text;
                values = values.concat(caseExpr.values);
              } else {
                fields += field.func.toString();
              }
            } else {
              fields += field.name;
            }
            if (field.aggregation) {
              fields += ")";
            }

            if (field.alias) {
              fields += ' AS ' + field.alias;
            }
          });

          if (!fields.length) {
            fields = "*";
          }

          if (paramMode) {
            return { text: fields, values: values };
          } else {
            return fields;
          }
        }
      }]);

      return _class14;
    }(cls.Block);

    // Base class for setting fields to values (used for INSERT and UPDATE queries)
    cls.AbstractSetFieldBlock = function (_cls$Block6) {
      _inherits(_class15, _cls$Block6);

      function _class15(options) {
        _classCallCheck(this, _class15);

        var _this19 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class15).call(this, options));

        _this19.fieldOptions = [];
        _this19.fields = [];
        _this19.values = [];
        return _this19;
      }

      // Update the given field with the given value.
      // This will override any previously set value for the given field.


      _createClass(_class15, [{
        key: '_set',
        value: function _set(field, value) {
          var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          if (this.values.length > 1) {
            throw new Error("Cannot call set or setFields on multiple rows of fields.");
          }

          if (undefined !== value) {
            value = this._sanitizeValue(value);
          }

          // Explicity overwrite existing fields
          var index = this.fields.indexOf(this._sanitizeField(field, options));

          if (index !== -1) {
            this.values[0][index] = value;
            this.fieldOptions[0][index] = options;
          } else {
            this.fields.push(this._sanitizeField(field, options));
            index = this.fields.length - 1;

            // The first value added needs to create the array of values for the row
            if (_isArray(this.values[0])) {
              this.values[0][index] = value;
              this.fieldOptions[0][index] = options;
            } else {
              this.values.push([value]);
              this.fieldOptions.push([options]);
            }
          }
        }

        // Insert fields based on the key/value pairs in the given object

      }, {
        key: '_setFields',
        value: function _setFields(fields) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          if ((typeof fields === 'undefined' ? 'undefined' : _typeof(fields)) !== 'object') {
            throw new Error("Expected an object but got " + (typeof fields === 'undefined' ? 'undefined' : _typeof(fields)));
          }

          for (var field in fields) {
            this._set(field, fields[field], options);
          }
        }

        // Insert multiple rows for the given fields. Accepts an array of objects.
        // This will override all previously set values for every field.

      }, {
        key: '_setFieldsRows',
        value: function _setFieldsRows(fieldsRows) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          if (!_isArray(fieldsRows)) {
            throw new Error("Expected an array of objects but got " + (typeof fieldsRows === 'undefined' ? 'undefined' : _typeof(fieldsRows)));
          }

          // Reset the objects stored fields and values
          this.fields = [];
          this.values = [];

          for (var i in fieldsRows) {
            var fieldRow = fieldsRows[i];

            for (var field in fieldRow) {
              var value = fieldRow[field];

              var index = this.fields.indexOf(this._sanitizeField(field, options));

              if (0 < i && -1 === index) {
                throw new Error('All fields in subsequent rows must match the fields in the first row');
              }

              // Add field only if it hasn't been added before
              if (-1 === index) {
                this.fields.push(this._sanitizeField(field, options));
                index = this.fields.length - 1;
              }

              value = this._sanitizeValue(value);

              // The first value added needs to add the array
              if (_isArray(this.values[i])) {
                this.values[i][index] = value;
                this.fieldOptions[i][index] = options;
              } else {
                this.values[i] = [value];
                this.fieldOptions[i] = [options];
              }
            }
          }
        }
      }, {
        key: 'buildStr',
        value: function buildStr() {
          throw new Error('Not yet implemented');
        }
      }, {
        key: 'buildParam',
        value: function buildParam() {
          throw new Error('Not yet implemented');
        }
      }]);

      return _class15;
    }(cls.Block);

    // (UPDATE) SET field=value
    cls.SetFieldBlock = function (_cls$AbstractSetField) {
      _inherits(_class16, _cls$AbstractSetField);

      function _class16() {
        _classCallCheck(this, _class16);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class16).apply(this, arguments));
      }

      _createClass(_class16, [{
        key: 'set',
        value: function set(field, value, options) {
          this._set(field, value, options);
        }
      }, {
        key: 'setFields',
        value: function setFields(fields, options) {
          this._setFields(fields, options);
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          if (0 >= this.fields.length) {
            throw new Error("set() needs to be called");
          }

          var str = "";

          for (var i in this.fields) {
            if (str.length) {
              str += ", ";
            }

            var field = this.fields[i];

            var value = this.values[0][i];

            var fieldOptions = this.fieldOptions[0][i];

            // e.g. if field is an expression such as: count = count + 1
            if (typeof value === 'undefined') {
              str += field;
            } else {
              str += field + ' = ' + this._formatValue(value, fieldOptions);
            }
          }

          return 'SET ' + str;
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          if (0 >= this.fields.length) {
            throw new Error("set() needs to be called");
          }

          var str = "";
          var vals = [];

          for (var i in this.fields) {
            if (str.length) {
              str += ", ";
            }

            var field = this.fields[i];

            var value = this.values[0][i];

            // e.g. if field is an expression such as: count = count + 1
            if (typeof value === 'undefined') {
              str += field;
            } else {
              var p = this._formatValueAsParam(value);

              if (!!p && !!p.text) {
                str += field + ' = (' + p.text + ')';

                _forOf(p.values, function (v) {
                  vals.push(v);
                });
              } else {
                str += field + ' = ' + this.options.parameterCharacter;

                vals.push(p);
              }
            }
          }

          return { text: 'SET ' + str, values: vals };
        }
      }]);

      return _class16;
    }(cls.AbstractSetFieldBlock);

    // (INSERT INTO) ... field ... value
    cls.InsertFieldValueBlock = function (_cls$AbstractSetField2) {
      _inherits(_class17, _cls$AbstractSetField2);

      function _class17() {
        _classCallCheck(this, _class17);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class17).apply(this, arguments));
      }

      _createClass(_class17, [{
        key: 'set',
        value: function set(field, value) {
          var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          this._set(field, value, options);
        }
      }, {
        key: 'setFields',
        value: function setFields(fields, options) {
          this._setFields(fields, options);
        }
      }, {
        key: 'setFieldsRows',
        value: function setFieldsRows(fieldsRows, options) {
          this._setFieldsRows(fieldsRows, options);
        }
      }, {
        key: '_buildVals',
        value: function _buildVals() {
          var vals = [];

          for (var i in this.values) {
            for (var j in this.values[i]) {
              var formattedValue = this._formatValue(this.values[i][j], this.fieldOptions[i][j]);

              if ('string' === typeof vals[i]) {
                vals[i] += ', ' + formattedValue;
              } else {
                vals[i] = '' + formattedValue;
              }
            }
          }

          return vals;
        }
      }, {
        key: '_buildValParams',
        value: function _buildValParams() {
          var vals = [];
          var params = [];

          for (var i in this.values) {
            for (var j in this.values[i]) {
              var p = this._formatValueAsParam(this.values[i][j]);
              var str = void 0;

              if (!!p && !!p.text) {
                str = p.text;

                _forOf(p.values, function (v) {
                  params.push(v);
                });
              } else {
                str = this.options.parameterCharacter;
                params.push(p);
              }

              if ('string' === typeof vals[i]) {
                vals[i] += ', ' + str;
              } else {
                vals[i] = str;
              }
            }
          }

          return {
            vals: vals,
            params: params
          };
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          if (0 >= this.fields.length) {
            return '';
          }

          return '(' + this.fields.join(', ') + ') VALUES (' + this._buildVals().join('), (') + ')';
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          if (0 >= this.fields.length) {
            return { text: '', values: [] };
          }

          // fields
          var str = "";

          var _buildValParams2 = this._buildValParams();

          var vals = _buildValParams2.vals;
          var params = _buildValParams2.params;

          for (var i in this.fields) {
            if (str.length) {
              str += ', ';
            }
            str += this.fields[i];
          }

          return { text: '(' + str + ') VALUES (' + vals.join('), (') + ')', values: params };
        }
      }]);

      return _class17;
    }(cls.AbstractSetFieldBlock);

    // (INSERT INTO) ... field ... (SELECT ... FROM ...)
    cls.InsertFieldsFromQueryBlock = function (_cls$Block7) {
      _inherits(_class18, _cls$Block7);

      function _class18(options) {
        _classCallCheck(this, _class18);

        var _this22 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class18).call(this, options));

        _this22._fields = [];
        _this22._query = null;
        return _this22;
      }

      _createClass(_class18, [{
        key: 'fromQuery',
        value: function fromQuery(fields, selectQuery) {
          var _this23 = this;

          this._fields = fields.map(function (v) {
            return _this23._sanitizeField(v);
          });

          this._query = this._sanitizeNestableQuery(selectQuery);
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          if (0 >= this._fields.length) {
            return '';
          }

          return '(' + this._fields.join(', ') + ') (' + this._query.toString() + ')';
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          if (0 >= this._fields.length) {
            return { text: '', values: [] };
          }

          this._query.updateOptions({ "nestedBuilder": true });
          var qryParam = this._query.toParam();

          return {
            text: '(' + this._fields.join(', ') + ') (' + qryParam.text + ')',
            values: qryParam.values
          };
        }
      }]);

      return _class18;
    }(cls.Block);

    // DISTINCT
    cls.DistinctBlock = function (_cls$Block8) {
      _inherits(_class19, _cls$Block8);

      function _class19(options) {
        _classCallCheck(this, _class19);

        var _this24 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class19).call(this, options));

        _this24.useDistinct = false;
        return _this24;
      }

      // Add the DISTINCT keyword to the query.


      _createClass(_class19, [{
        key: 'distinct',
        value: function distinct() {
          this.useDistinct = true;
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          return this.useDistinct ? "DISTINCT" : "";
        }
      }]);

      return _class19;
    }(cls.Block);

    // GROUP BY
    cls.GroupByBlock = function (_cls$Block9) {
      _inherits(_class20, _cls$Block9);

      function _class20(options) {
        _classCallCheck(this, _class20);

        var _this25 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class20).call(this, options));

        _this25.groups = [];
        return _this25;
      }

      // Add a GROUP BY transformation for the given field.


      _createClass(_class20, [{
        key: 'group',
        value: function group(field) {
          field = this._sanitizeField(field);
          this.groups.push(field);
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          if (0 < this.groups.length) {
            var groups = this.groups.join(', ');

            return 'GROUP BY ' + groups;
          } else {
            return "";
          }
        }
      }]);

      return _class20;
    }(cls.Block);

    // OFFSET x
    cls.OffsetBlock = function (_cls$Block10) {
      _inherits(_class21, _cls$Block10);

      function _class21(options) {
        _classCallCheck(this, _class21);

        var _this26 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class21).call(this, options));

        _this26.offsets = null;
        return _this26;
      }

      /**
      # Set the OFFSET transformation.
      #
      # Call this will override the previously set offset for this query. Also note that Passing 0 for 'max' will remove
      # the offset.
      */


      _createClass(_class21, [{
        key: 'offset',
        value: function offset(start) {
          start = this._sanitizeLimitOffset(start);
          this.offsets = start;
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          return this.offsets ? 'OFFSET ' + this.offsets : '';
        }
      }]);

      return _class21;
    }(cls.Block);

    // Abstract condition base class
    cls.AbstractConditionBlock = function (_cls$Block11) {
      _inherits(_class22, _cls$Block11);

      function _class22(verb, options) {
        _classCallCheck(this, _class22);

        var _this27 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class22).call(this, options));

        _this27.conditionVerb = verb;
        _this27.conditions = [];
        return _this27;
      }

      /**
      # Add a condition.
      #
      # When the final query is constructed all the conditions are combined using the intersection (AND) operator.
      #
      # Concrete subclasses should provide a method which calls this
      */


      _createClass(_class22, [{
        key: '_condition',
        value: function _condition(condition) {
          var _this28 = this;

          condition = this._sanitizeExpression(condition);

          var finalCondition = "";
          var finalValues = [];

          // if it's an Expression instance then convert to text and values
          if (condition instanceof cls.Expression) {
            var t = condition.toParam();
            finalCondition = t.text;
            finalValues = t.values;
          } else {
            for (var _len8 = arguments.length, values = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
              values[_key8 - 1] = arguments[_key8];
            }

            for (var idx in condition) {
              var c = condition.charAt(idx);

              if (this.options.parameterCharacter === c && 0 < values.length) {
                var nextValue = values.shift();
                // # where b in (?, ? ?)
                if (_isArray(nextValue)) {
                  (function () {
                    var inValues = [];
                    _forOf(nextValue, function (item) {
                      inValues.push(_this28._sanitizeValue(item));
                    });
                    finalValues = finalValues.concat(inValues);
                    var paramChars = inValues.map(function () {
                      return _this28.options.parameterCharacter;
                    });
                    finalCondition += '(' + paramChars.join(', ') + ')';
                  })();
                } else {
                  finalCondition += this.options.parameterCharacter;
                  finalValues.push(this._sanitizeValue(nextValue));
                }
              } else {
                finalCondition += c;
              }
            }
          }

          if (finalCondition.length) {
            this.conditions.push({
              text: finalCondition,
              values: finalValues
            });
          }
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          var _this29 = this;

          if (0 >= this.conditions.length) {
            return "";
          }

          var condStr = "";

          _forOf(this.conditions, function (cond) {
            if (condStr.length) {
              condStr += ") AND (";
            }

            if (0 < cond.values.length) {
              (function () {
                // replace placeholders with actual parameter values
                var pIndex = 0;
                _forOf(cond.text, function (c) {
                  if (_this29.options.parameterCharacter === c) {
                    condStr += _this29._formatValue(cond.values[pIndex++]);
                  } else {
                    condStr += c;
                  }
                });
              })();
            } else {
              condStr += cond.text;
            }
          });

          return this.conditionVerb + ' (' + condStr + ')';
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          var _this30 = this;

          var ret = {
            text: "",
            values: []
          };

          if (0 >= this.conditions.length) {
            return ret;
          }

          var condStr = "";

          _forOf(this.conditions, function (cond) {
            if (condStr.length) {
              condStr += ") AND (";
            }

            var str = cond.text.split(_this30.options.parameterCharacter);
            var i = 0;
            _forOf(cond.values, function (v) {
              if (undefined !== str[i]) {
                condStr += str[i];
              }

              var p = _this30._formatValueAsParam(v);
              if (!!p && !!p.text) {
                condStr += '(' + p.text + ')';
                _forOf(p.values, function (qv) {
                  ret.values.push(qv);
                });
              } else {
                condStr += _this30.options.parameterCharacter;
                ret.values.push(p);
              }
              i = i + 1;
            });

            if (undefined !== str[i]) {
              condStr += str[i];
            }
          });

          ret.text = this.conditionVerb + ' (' + condStr + ')';
          return ret;
        }
      }]);

      return _class22;
    }(cls.Block);

    // WHERE
    cls.WhereBlock = function (_cls$AbstractConditio) {
      _inherits(_class23, _cls$AbstractConditio);

      function _class23(options) {
        _classCallCheck(this, _class23);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class23).call(this, 'WHERE', options));
      }

      _createClass(_class23, [{
        key: 'where',
        value: function where(condition) {
          for (var _len9 = arguments.length, values = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
            values[_key9 - 1] = arguments[_key9];
          }

          this._condition.apply(this, [condition].concat(values));
        }
      }]);

      return _class23;
    }(cls.AbstractConditionBlock);

    // HAVING
    cls.HavingBlock = function (_cls$AbstractConditio2) {
      _inherits(_class24, _cls$AbstractConditio2);

      function _class24(options) {
        _classCallCheck(this, _class24);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class24).call(this, 'HAVING', options));
      }

      _createClass(_class24, [{
        key: 'having',
        value: function having(condition) {
          for (var _len10 = arguments.length, values = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
            values[_key10 - 1] = arguments[_key10];
          }

          this._condition.apply(this, [condition].concat(values));
        }
      }]);

      return _class24;
    }(cls.AbstractConditionBlock);

    // ORDER BY
    cls.OrderByBlock = function (_cls$Block12) {
      _inherits(_class25, _cls$Block12);

      function _class25(options) {
        _classCallCheck(this, _class25);

        var _this33 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class25).call(this, options));

        _this33.orders = [];
        _this33._values = [];
        return _this33;
      }

      /**
      # Add an ORDER BY transformation for the given field in the given order.
      #
      # To specify descending order pass false for the 'asc' parameter.
      */


      _createClass(_class25, [{
        key: 'order',
        value: function order(field, asc) {
          field = this._sanitizeField(field);

          if (asc === undefined) {
            asc = true;
          }

          if (asc !== null) {
            asc = !!asc;
          }

          for (var _len11 = arguments.length, values = Array(_len11 > 2 ? _len11 - 2 : 0), _key11 = 2; _key11 < _len11; _key11++) {
            values[_key11 - 2] = arguments[_key11];
          }

          this._values = values;

          this.orders.push({
            field: field,
            dir: asc
          });
        }
      }, {
        key: '_buildStr',
        value: function _buildStr() {
          var _this34 = this;

          var toParam = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

          if (0 < this.orders.length) {
            var _ret6 = function () {
              var pIndex = 0;
              var orders = "";
              _forOf(_this34.orders, function (o) {
                if (orders.length) {
                  orders += ", ";
                }

                var fstr = "";

                if (!toParam) {
                  _forOf(o.field, function (c) {
                    if (_this34.options.parameterCharacter === c) {
                      fstr += _this34._formatValue(_this34._values[pIndex++]);
                    } else {
                      fstr += c;
                    }
                  });
                } else {
                  fstr = o.field;
                }

                orders += fstr;

                if (o.dir !== null) {
                  orders += ' ' + (o.dir ? 'ASC' : 'DESC');
                }
              });

              return {
                v: 'ORDER BY ' + orders
              };
            }();

            if ((typeof _ret6 === 'undefined' ? 'undefined' : _typeof(_ret6)) === "object") return _ret6.v;
          } else {
            return "";
          }
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          return this._buildStr();
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          var _this35 = this;

          return {
            text: this._buildStr(true),
            values: this._values.map(function (v) {
              return _this35._formatValueAsParam(v);
            })
          };
        }
      }]);

      return _class25;
    }(cls.Block);

    // LIMIT
    cls.LimitBlock = function (_cls$Block13) {
      _inherits(_class26, _cls$Block13);

      function _class26(options) {
        _classCallCheck(this, _class26);

        var _this36 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class26).call(this, options));

        _this36.limits = null;
        return _this36;
      }

      /**
      # Set the LIMIT transformation.
      #
      # Call this will override the previously set limit for this query. Also note that Passing 0 for 'max' will remove
      # the limit.
      */


      _createClass(_class26, [{
        key: 'limit',
        value: function limit(max) {
          max = this._sanitizeLimitOffset(max);
          this.limits = max;
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          return this.limits || this.limits == 0 ? 'LIMIT ' + this.limits : "";
        }
      }]);

      return _class26;
    }(cls.Block);

    // JOIN
    cls.JoinBlock = function (_cls$Block14) {
      _inherits(_class27, _cls$Block14);

      function _class27(options) {
        _classCallCheck(this, _class27);

        var _this37 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class27).call(this, options));

        _this37.joins = [];
        return _this37;
      }

      /**
      # Add a JOIN with the given table.
      #
      # 'table' is the name of the table to join with.
      #
      # 'alias' is an optional alias for the table name.
      #
      # 'condition' is an optional condition (containing an SQL expression) for the JOIN. If this is an instance of
      # an expression builder then it gets evaluated straight away.
      #
      # 'type' must be either one of INNER, OUTER, LEFT or RIGHT. Default is 'INNER'.
      #
      */


      _createClass(_class27, [{
        key: 'join',
        value: function join(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var condition = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
          var type = arguments.length <= 3 || arguments[3] === undefined ? 'INNER' : arguments[3];

          table = this._sanitizeTable(table, true);
          alias = alias ? this._sanitizeTableAlias(alias) : alias;
          condition = condition ? this._sanitizeExpression(condition) : condition;

          this.joins.push({
            type: type,
            table: table,
            alias: alias,
            condition: condition
          });
        }
      }, {
        key: 'left_join',
        value: function left_join(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var condition = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          this.join(table, alias, condition, 'LEFT');
        }
      }, {
        key: 'right_join',
        value: function right_join(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var condition = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          this.join(table, alias, condition, 'RIGHT');
        }
      }, {
        key: 'outer_join',
        value: function outer_join(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var condition = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          this.join(table, alias, condition, 'OUTER');
        }
      }, {
        key: 'left_outer_join',
        value: function left_outer_join(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var condition = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          this.join(table, alias, condition, 'LEFT OUTER');
        }
      }, {
        key: 'full_join',
        value: function full_join(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var condition = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          this.join(table, alias, condition, 'FULL');
        }
      }, {
        key: 'cross_join',
        value: function cross_join(table) {
          var alias = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
          var condition = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          this.join(table, alias, condition, 'CROSS');
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          var joins = "";

          _forOf(this.joins || [], function (j) {
            if (joins.length) {
              joins += " ";
            }

            joins += j.type + ' JOIN ';
            if ("string" === typeof j.table) {
              joins += j.table;
            } else {
              joins += '(' + j.table + ')';
            }
            if (j.alias) {
              joins += ' ' + j.alias;
            }
            if (j.condition) {
              joins += ' ON (' + j.condition + ')';
            }
          });

          return joins;
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          var _this38 = this;

          var ret = {
            text: "",
            values: []
          };

          var params = [];
          var joinStr = "";

          if (0 >= this.joins.length) {
            return ret;
          }

          // retrieve the parameterised queries
          _forOf(this.joins, function (blk) {
            var p = void 0;
            if ("string" === typeof blk.table) {
              p = { "text": '' + blk.table, "values": [] };
            } else if (blk.table instanceof cls.QueryBuilder) {
              // building a nested query
              blk.table.updateOptions({ "nestedBuilder": true });
              p = blk.table.toParam();
            } else {
              // building a nested query
              blk.updateOptions({ "nestedBuilder": true });
              p = blk.buildParam(queryBuilder);
            }

            if (blk.condition instanceof cls.Expression) {
              var cp = blk.condition.toParam();
              p.condition = cp.text;
              p.values = p.values.concat(cp.values);
            } else {
              p.condition = blk.condition;
            }

            p.join = blk;
            params.push(p);
          });

          // join the queries and their parameters
          // this is the last building block processed so always add UNION if there are any UNION blocks
          _forOf(params, function (p) {
            if (joinStr.length) {
              joinStr += " ";
            }

            joinStr += p.join.type + ' JOIN ';

            if ("string" === typeof p.join.table) {
              joinStr += p.text;
            } else {
              joinStr += '(' + p.text + ')';
            }
            if (p.join.alias) {
              joinStr += ' ' + p.join.alias;
            }
            if (p.condition) {
              joinStr += ' ON (' + p.condition + ')';
            }

            _forOf(p.values, function (v) {
              ret.values.push(_this38._formatCustomValue(v));
            });
          });

          ret.text += joinStr;

          return ret;
        }
      }]);

      return _class27;
    }(cls.Block);

    // UNION
    cls.UnionBlock = function (_cls$Block15) {
      _inherits(_class28, _cls$Block15);

      function _class28(options) {
        _classCallCheck(this, _class28);

        var _this39 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class28).call(this, options));

        _this39.unions = [];
        return _this39;
      }

      /**
      # Add a UNION with the given table/query.
      #
      # 'table' is the name of the table or query to union with.
      #
      #
      # 'type' must be either one of UNION or UNION ALL.... Default is 'UNION'.
      #
      */


      _createClass(_class28, [{
        key: 'union',
        value: function union(table) {
          var type = arguments.length <= 1 || arguments[1] === undefined ? 'UNION' : arguments[1];

          table = this._sanitizeTable(table, true);

          this.unions.push({
            type: type,
            table: table
          });
        }

        // Add a UNION ALL with the given table/query.

      }, {
        key: 'union_all',
        value: function union_all(table) {
          this.union(table, 'UNION ALL');
        }
      }, {
        key: 'buildStr',
        value: function buildStr(queryBuilder) {
          var unionStr = "";

          _forOf(this.unions || [], function (j) {
            if (unionStr.length) {
              unionStr += " ";
            }
            unionStr += j.type + ' ';
            if ("string" === typeof j.table) {
              unionStr += j.table;
            } else {
              unionStr += '(' + j.table + ')';
            }
          });

          return unionStr;
        }
      }, {
        key: 'buildParam',
        value: function buildParam(queryBuilder) {
          var _this40 = this;

          var ret = {
            text: "",
            values: []
          };

          var params = [];
          var unionStr = "";

          if (0 >= this.unions.length) {
            return ret;
          }

          // retrieve the parameterised queries
          _forOf(this.unions || [], function (blk) {
            var p = void 0;
            if ("string" === typeof blk.table) {
              p = { "text": blk.table, "values": [] };
            } else if (blk.table instanceof cls.QueryBuilder) {
              // building a nested query
              blk.table.updateOptions({ "nestedBuilder": true });
              p = blk.table.toParam();
            } else {
              // building a nested query
              blk.updateOptions({ "nestedBuilder": true });
              p = blk.buildParam(queryBuilder);
            }
            p.type = blk.type;
            params.push(p);
          });

          // join the queries and their parameters
          // this is the last building block processed so always add UNION if there are any UNION blocks
          _forOf(params, function (p) {
            if (unionStr.length) {
              unionStr += " ";
            }
            unionStr += p.type + ' (' + p.text + ')';
            _forOf(p.values, function (v) {
              ret.values.push(_this40._formatCustomValue(v));
            });
          });

          ret.text += unionStr;

          return ret;
        }
      }]);

      return _class28;
    }(cls.Block);

    /*
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    # Query builders
    # ---------------------------------------------------------------------------------------------------------
    # ---------------------------------------------------------------------------------------------------------
    */

    /**
    # Query builder base class
    #
    # Note that the query builder does not check the final query string for correctness.
    #
    # All the build methods in this object return the object instance for chained method calling purposes.
    */
    cls.QueryBuilder = function (_cls$BaseBuilder5) {
      _inherits(_class29, _cls$BaseBuilder5);

      /**
      # Constructor
      #
      # blocks - array of cls.BaseBuilderBlock instances to build the query with.
      */

      function _class29(options, blocks) {
        _classCallCheck(this, _class29);

        var _this41 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class29).call(this, options));

        _this41.blocks = blocks || [];

        // Copy exposed methods into myself
        _forOf(_this41.blocks, function (block) {
          var exposedMethods = block.exposedMethods();

          for (var methodName in exposedMethods) {
            var methodBody = exposedMethods[methodName];

            if (undefined !== _this41[methodName]) {
              throw new Error('Builder already has a builder method called: ' + methodName);
            }

            (function (block, name, body) {
              _this41[name] = function () {
                for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                  args[_key12] = arguments[_key12];
                }

                body.call.apply(body, [block].concat(args));

                return _this41;
              };
            })(block, methodName, methodBody);
          }
        });
        return _this41;
      }

      /**
      # Register a custom value handler for this query builder and all its contained blocks.
      #
      # Note: This will override any globally registered handler for this value type.
      */


      _createClass(_class29, [{
        key: 'registerValueHandler',
        value: function registerValueHandler(type, handler) {
          _forOf(this.blocks, function (block) {
            block.registerValueHandler(type, handler);
          });

          _get(Object.getPrototypeOf(_class29.prototype), 'registerValueHandler', this).call(this, type, handler);

          return this;
        }

        /**
        # Update query builder options
        #
        # This will update the options for all blocks too. Use this method with caution as it allows you to change the
        # behaviour of your query builder mid-build.
        */

      }, {
        key: 'updateOptions',
        value: function updateOptions(options) {
          this.options = _extend({}, this.options, options);

          _forOf(this.blocks, function (block) {
            block.options = _extend({}, block.options, options);
          });
        }

        // Get the final fully constructed query string.

      }, {
        key: 'toString',
        value: function toString() {
          var _this42 = this;

          var blockStr = this.blocks.map(function (blk) {
            return blk.buildStr(_this42);
          });

          return blockStr.filter(function (v) {
            return 0 < v.length;
          }).join(this.options.separator);
        }

        // Get the final fully constructed query param obj.

      }, {
        key: 'toParam',
        value: function toParam() {
          var _this43 = this,
              _ref;

          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var old = this.options;
          if (!!options) {
            this.options = _extend({}, this.options, options);
          }
          var result = { text: '', values: [] };
          var blocks = this.blocks.map(function (v) {
            return v.buildParam(_this43);
          });
          var blockTexts = blocks.map(function (v) {
            return v.text;
          });
          var blockValues = blocks.map(function (v) {
            return v.values;
          });
          result.text = blockTexts.filter(function (v) {
            return 0 < v.length;
          }).join(this.options.separator);

          result.values = (_ref = []).concat.apply(_ref, _toConsumableArray(blockValues));

          if (!this.options.nestedBuilder) {
            if (this.options.numberedParameters) {
              (function () {
                var i = undefined !== _this43.options.numberedParametersStartAt ? _this43.options.numberedParametersStartAt : 1;
                var regex = new RegExp("\\" + _this43.options.parameterCharacter, 'g');
                result.text = result.text.replace(regex, function () {
                  return '' + _this43.options.numberedParametersPrefix + i++;
                });
              })();
            }
          }
          this.options = old;
          return result;
        }

        // Deep clone

      }, {
        key: 'clone',
        value: function clone() {
          var blockClones = this.blocks.map(function (v) {
            return v.clone();
          });

          return new this.constructor(this.options, blockClones);
        }

        // Get a specific block

      }, {
        key: 'getBlock',
        value: function getBlock(blockType) {
          var filtered = this.blocks.filter(function (b) {
            return b instanceof blockType;
          });

          return filtered[0];
        }
      }]);

      return _class29;
    }(cls.BaseBuilder);

    // SELECT query builder.
    cls.Select = function (_cls$QueryBuilder) {
      _inherits(_class30, _cls$QueryBuilder);

      function _class30(options) {
        var blocks = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, _class30);

        blocks = blocks || [new cls.StringBlock(options, 'SELECT'), new cls.FunctionBlock(options), new cls.DistinctBlock(options), new cls.GetFieldBlock(options), new cls.FromTableBlock(_extend({}, options, { allowNested: true })), new cls.JoinBlock(_extend({}, options, { allowNested: true })), new cls.WhereBlock(options), new cls.GroupByBlock(options), new cls.HavingBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options), new cls.OffsetBlock(options), new cls.UnionBlock(_extend({}, options, { allowNested: true }))];

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class30).call(this, options, blocks));
      }

      return _class30;
    }(cls.QueryBuilder);

    // UPDATE query builder.
    cls.Update = function (_cls$QueryBuilder2) {
      _inherits(_class31, _cls$QueryBuilder2);

      function _class31(options) {
        var blocks = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, _class31);

        blocks = blocks || [new cls.StringBlock(options, 'UPDATE'), new cls.UpdateTableBlock(options), new cls.SetFieldBlock(options), new cls.WhereBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options)];

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class31).call(this, options, blocks));
      }

      return _class31;
    }(cls.QueryBuilder);

    // DELETE query builder.
    cls.Delete = function (_cls$QueryBuilder3) {
      _inherits(_class32, _cls$QueryBuilder3);

      function _class32(options) {
        var blocks = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, _class32);

        blocks = blocks || [new cls.StringBlock(options, 'DELETE'), new cls.FromTableBlock(_extend({}, options, { singleTable: true })), new cls.JoinBlock(options), new cls.WhereBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options)];

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class32).call(this, options, blocks));
      }

      return _class32;
    }(cls.QueryBuilder);

    // An INSERT query builder.
    cls.Insert = function (_cls$QueryBuilder4) {
      _inherits(_class33, _cls$QueryBuilder4);

      function _class33(options) {
        var blocks = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, _class33);

        blocks = blocks || [new cls.StringBlock(options, 'INSERT'), new cls.IntoTableBlock(options), new cls.InsertFieldValueBlock(options), new cls.InsertFieldsFromQueryBlock(options)];

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class33).call(this, options, blocks));
      }

      return _class33;
    }(cls.QueryBuilder);

    var _squel = {
      VERSION: '4.4.1',
      flavour: flavour,
      expr: function expr(options) {
        return new cls.Expression(options);
      },
      case: function _case(name, options) {
        return new cls.Case(name, options);
      },
      select: function select(options, blocks) {
        return new cls.Select(options, blocks);
      },
      update: function update(options, blocks) {
        return new cls.Update(options, blocks);
      },
      insert: function insert(options, blocks) {
        return new cls.Insert(options, blocks);
      },
      delete: function _delete(options, blocks) {
        return new cls.Delete(options, blocks);
      },
      registerValueHandler: cls.registerValueHandler,
      fval: cls.fval
    };

    // aliases
    _squel.remove = _squel.delete;

    // classes
    _squel.cls = cls;

    return _squel;
  }

  /**
  # ---------------------------------------------------------------------------------------------------------
  # ---------------------------------------------------------------------------------------------------------
  # Exported instance (and for use by flavour definitions further down).
  # ---------------------------------------------------------------------------------------------------------
  # ---------------------------------------------------------------------------------------------------------
  */

  var squel = _buildSquel();

  /**
  # ---------------------------------------------------------------------------------------------------------
  # ---------------------------------------------------------------------------------------------------------
  # Squel SQL flavours
  # ---------------------------------------------------------------------------------------------------------
  # ---------------------------------------------------------------------------------------------------------
  */

  // Available flavours
  squel.flavours = {};

  // Setup Squel for a particular SQL flavour
  squel.useFlavour = function () {
    var flavour = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    if (!flavour) {
      return squel;
    }

    if (squel.flavours[flavour] instanceof Function) {
      var s = _buildSquel(flavour);

      squel.flavours[flavour].call(null, s);

      // add in flavour methods
      s.flavours = squel.flavours;
      s.useFlavour = squel.useFlavour;

      return s;
    } else {
      throw new Error('Flavour not available: ' + flavour);
    }
  };

  return squel;
});