'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceState = exports.pushState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isRouteEqual = function isRouteEqual(prevState, nextState) {
  if (prevState === nextState) return true;
  if (prevState.pathname !== nextState.pathname) return false;
  if (prevState.search !== nextState.search) return false;

  var a = prevState.state;
  var b = nextState.state;

  for (var k in a) {
    if (a.hasOwnProperty(k) && (!b.hasOwnProperty(k) || a[k] !== b[k])) {
      return false;
    }
  }
  for (var k in b) {
    if (b.hasOwnProperty(k) && !a.hasOwnProperty(k)) {
      return false;
    }
  }
  return true;
};

var pushState = exports.pushState = {
  id: 'router/history/pushedState',
  dispatch: function dispatch(x) {
    return x;
  }
};

var replaceState = exports.replaceState = {
  id: 'router/history/replacedState',
  dispatch: function dispatch(x) {
    return x;
  }
};

var updatedHistory = {
  id: 'router/history/updatedHistory',
  dispatch: function dispatch(x) {
    return x;
  }
};

var makeHistoryStore = function makeHistoryStore(history) {
  return {
    displayName: 'AltHistoryStore',

    state: {},

    lifecycle: {
      bootstrap: function bootstrap(currentState) {
        var state = currentState.state;
        var pathname = currentState.pathname;
        var query = currentState.query;

        history.replaceState(state, pathname, query);
      }
    },

    bindListeners: {
      push: pushState.id,
      replace: replaceState.id,
      update: updatedHistory.id
    },

    push: function push(data) {
      var state = data.state;
      var pathname = data.pathname;
      var query = data.query;

      history.pushState(state, pathname, query);
      this.setState(data);
    },
    replace: function replace(data) {
      var state = data.state;
      var pathname = data.pathname;
      var query = data.query;

      history.replaceState(state, pathname, query);
      this.setState(data);
    },
    update: function update(data) {
      this.setState(data);
      this.preventDefault();
    }
  };
};

var dispatchable = function dispatchable(flux, action) {
  return function (state, pathname, query) {
    return flux.dispatch(action, { state: state, pathname: pathname, query: query });
  };
};

var AltRouter = function (_React$Component) {
  _inherits(AltRouter, _React$Component);

  function AltRouter(props, context) {
    _classCallCheck(this, AltRouter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AltRouter).call(this, props, context));

    var flux = props.flux || context.flux;

    _this.history = props.history;
    _this.routes = typeof props.routes === 'function' ? props.routes(flux) : props.routes;

    var store = flux.createStore(makeHistoryStore(_this.history));

    flux.router = {
      pushState: dispatchable(flux, pushState),
      replaceState: dispatchable(flux, replaceState),
      store: store
    };

    var prevState = {};

    _this.historyListener = _this.history.listen(function (routerState) {
      if (!isRouteEqual(prevState, routerState)) {
        setTimeout(function () {
          return flux.dispatch(updatedHistory, routerState);
        });
        prevState = routerState;
      }
    });
    return _this;
  }

  _createClass(AltRouter, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.historyListener();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactRouter.Router, { history: this.history, routes: this.routes });
    }
  }]);

  return AltRouter;
}(_react2.default.Component);

AltRouter.contextTypes = {
  flux: _react2.default.PropTypes.object
};
exports.default = AltRouter;