'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _blur = require('./utils/blur');

var _blur2 = _interopRequireDefault(_blur);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Image = function (_Component) {
    _inherits(Image, _Component);

    function Image() {
        _classCallCheck(this, Image);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Image).apply(this, arguments));
    }

    _createClass(Image, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.initComponent();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.allListeners();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.src !== this.props.src || nextProps.srcSet !== this.props.srcSet) {
                this.initComponent(nextProps);
            }
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {

            for (var key in nextState) {
                if (nextState.hasOwnProperty(key) && nextState[key] !== this.state[key]) {
                    return true;
                }
            }

            for (var _key in nextProps) {
                if (nextProps.hasOwnProperty(_key) && nextProps[_key] !== this.props[_key]) {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {}
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            // components src was changed
            if (this.state.status === 'waiting' && prevState.status !== this.state.status) {
                if (this._scrollListener === null) {
                    this.allListeners();
                }
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.removeListeners();
        }
    }, {
        key: 'initComponent',
        value: function initComponent(porps) {

            if (typeof porps === 'undefined') {
                porps = this.props;
            }

            var ratio = porps.ratio > 0 ? porps.ratio : 0;
            if (ratio == 0 && porps.width && porps.height && parseInt(porps.width) > 0 && parseInt(porps.height) > 0) {
                ratio = parseInt(porps.width) / parseInt(porps.height);
            }

            this.setState({
                status: 'waiting', // done, loading, animation,
                ratio: ratio,
                ratioAuto: false // if ratio was calculated automatically
            });

            if (this._doneTimer) {
                clearTimeout(this._doneTimer);
            }
        }
    }, {
        key: 'allListeners',
        value: function allListeners() {
            this._scrollListener = this.scrollListener.bind(this);
            window.addEventListener('scroll', this._scrollListener, false);
            window.addEventListener('wheel', this._scrollListener, false);
            this._scrollListener();
        }
    }, {
        key: 'removeListeners',
        value: function removeListeners() {
            if (typeof this._scrollListener === 'function') {
                window.removeEventListener('scroll', this._scrollListener, false);
                window.removeEventListener('wheel', this._scrollListener, false);
                this._scrollListener = null;
            }
        }
    }, {
        key: 'scrollListener',
        value: function scrollListener() {
            var _this2 = this;

            if (!this.scrollWait) {
                this.scrollWait = true;

                this.checkVisibility();

                setTimeout(function () {
                    _this2.scrollWait = false;
                }, this.props.debounce);
            }
        }
    }, {
        key: 'getWindowHeight',
        value: function getWindowHeight() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        }
    }, {
        key: 'getScrollTop',
        value: function getScrollTop() {
            var isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';
            return typeof window.pageXOffset !== 'undefined' ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        }
    }, {
        key: 'getNode',
        value: function getNode() {
            if (!this._node) {
                this._node = _reactDom2.default.findDOMNode(this);
            }
            return this._node;
        }
    }, {
        key: 'isVisible',
        value: function isVisible() {

            var scrollTop = this.getScrollTop();

            var rect = this.getNode().getBoundingClientRect();

            var elementTop = rect.top + scrollTop;
            var elementBottom = elementTop + rect.height;

            var documentBottom = scrollTop + this.getWindowHeight();

            return elementTop <= documentBottom && elementBottom >= scrollTop;
        }
    }, {
        key: 'checkVisibility',
        value: function checkVisibility() {
            if (this.state.status === 'waiting' && this.isVisible()) {
                this.setState({
                    status: 'loading'
                });
                this.removeListeners();
            }
        }
    }, {
        key: 'renderFillBox',
        value: function renderFillBox() {
            var padding = this.state.ratio > 0 ? 1 / this.state.ratio * 100 : 50;
            var style = (0, _objectAssign2.default)({}, styles.block, { paddingBottom: padding + '%' });
            return _react2.default.createElement('span', { style: style });
        }
    }, {
        key: 'onPlaceHolderLoad',
        value: function onPlaceHolderLoad() {

            if (this.state.ratio == 0) {
                var thumbnail = this.getNode().getElementsByTagName('img')[0];
                // get ratio from placeholder
                this.setState({
                    ratio: thumbnail.naturalWidth / thumbnail.naturalHeight,
                    ratioAuto: true
                });
            }

            if (this.props.blur > 0) {
                var canvas = this.getNode().getElementsByTagName('canvas')[0];
                var _thumbnail = this.getNode().getElementsByTagName('img')[0];
                if (canvas && _thumbnail) {
                    canvas.width = 60;
                    canvas.height = 30;
                    canvas.getContext('2d').drawImage(_thumbnail, 0, 0, canvas.width, canvas.height);
                    (0, _blur2.default)(canvas, this.props.blur);
                }
            }
        }
    }, {
        key: 'onImageLoad',
        value: function onImageLoad() {
            var _this3 = this;

            var newState = {
                status: 'animation'
            };

            if (this.state.ratio == 0 || this.state.ratioAuto) {
                var images = this.getNode().getElementsByTagName('img');
                var image = images[images.length - 1];
                // get ratio from image
                this.setState({
                    ratio: image.naturalWidth / image.naturalHeight,
                    ratioAuto: true
                });
            }

            this.setState(newState);

            this._doneTimer = setTimeout(function () {
                _this3.setState({
                    status: 'done'
                });
            }, this.props.animationSpeed + 100); // + 100ms in case lags
        }
    }, {
        key: 'onImageError',
        value: function onImageError() {
            this.setState({
                status: 'error'
            });
        }
    }, {
        key: 'renderPlaceholder',
        value: function renderPlaceholder() {
            var _this4 = this;

            var placeholder = this.props.placeholder;

            if (this.state.status === 'done' || typeof placeholder === 'undefined' || this.state.status === 'error' && typeof this.props.fallback === 'string') {
                return null;
            }

            var style = (0, _objectAssign2.default)({}, styles.full, { zIndex: 1 });

            if (typeof placeholder === 'string') {
                var _ret = function () {

                    var allowedAttributes = ['alt', 'crossOrigin'];
                    var attributes = {};
                    allowedAttributes.forEach(function (attribute) {
                        if (typeof _this4.props[attribute] !== 'undefined') {
                            attributes[attribute] = _this4.props[attribute];
                        }
                    });

                    attributes.onLoad = function () {
                        _this4.onPlaceHolderLoad();
                    };

                    attributes.src = placeholder;

                    if (_this4.props.blur > 0) {
                        attributes.style = {
                            display: 'none'
                        };
                        return {
                            v: [_react2.default.createElement('img', _extends({ key: 1 }, attributes)), _react2.default.createElement('canvas', { key: 2, style: style })]
                        };
                    } else {
                        attributes.style = style;
                        return {
                            v: _react2.default.createElement('img', attributes)
                        };
                    }
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } else {
                return _react2.default.createElement(
                    'span',
                    { style: style },
                    'placeholder'
                );
            }
        }
    }, {
        key: 'renderImage',
        value: function renderImage() {
            var _this5 = this;

            if (this.state.status === 'waiting') {
                return null;
            }

            if (this.state.status === 'error') {
                if (typeof this.props.fallback === 'string') {
                    var _style = (0, _objectAssign2.default)({}, styles.full, { zIndex: 2 });
                    return _react2.default.createElement('img', { src: this.props.fallback, style: _style });
                } else {
                    return null;
                }
            }

            var transition = {
                transition: 'visibility 0s linear 0s, opacity ' + this.props.animationSpeed / 1000 + 's 0s'
            };

            var style = (0, _objectAssign2.default)({}, styles.full, transition, { zIndex: 2 });
            if (this.state.status === 'done' || this.state.status === 'animation') {
                style = (0, _objectAssign2.default)(style, styles.visible);
            } else {
                style = (0, _objectAssign2.default)(style, styles.hidden);
            }

            var allowedAttributes = ['src', 'srcSet', 'sizes', 'alt', 'crossOrigin'];
            var attributes = {};
            allowedAttributes.forEach(function (attribute) {
                if (typeof _this5.props[attribute] !== 'undefined') {
                    attributes[attribute] = _this5.props[attribute];
                }
            });

            attributes.onLoad = function () {
                _this5.onImageLoad();
            };

            attributes.onError = function (h) {
                _this5.onImageError();
            };

            attributes.style = style;

            return _react2.default.createElement('img', attributes);
        }
    }, {
        key: 'getWrapperProps',
        value: function getWrapperProps() {
            var props = {};

            props.style = (0, _objectAssign2.default)({}, styles.block);

            if (this.props.inline) {
                props.style = (0, _objectAssign2.default)(props.style, styles.inline);
            }

            if (this.props.maxWidth) {
                if (typeof this.props.maxWidth === 'number' || /^\d+$/.test(this.props.maxWidth)) {
                    props.style.maxWidth = this.props.maxWidth + 'px';
                } else {
                    props.style.maxWidth = this.props.maxWidth;
                }
            }

            if (this.props.className) {
                props.className = this.props.className;
            }

            if (this.props.id) {
                props.id = this.props.id;
            }

            return props;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'span',
                this.getWrapperProps(),
                this.renderFillBox(),
                this.renderPlaceholder(),
                this.renderImage()
            );
        }
    }]);

    return Image;
}(_react.Component);

Image.propTypes = {
    src: _react.PropTypes.string.isRequired,
    srcSet: _react.PropTypes.string,
    sizes: _react.PropTypes.string,
    maxWidth: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    ratio: _react.PropTypes.number,
    alt: _react.PropTypes.string,
    crossOrigin: _react.PropTypes.string,
    placeholder: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.node]),
    'blur': _react2.default.PropTypes.number,
    className: _react.PropTypes.string,
    id: _react.PropTypes.string,
    debounce: _react.PropTypes.number,
    animationSpeed: _react.PropTypes.number,
    inline: _react2.default.PropTypes.bool,
    fallback: _react.PropTypes.string
};

Image.defaultProps = {
    alt: '',
    debounce: 200,
    animationSpeed: 400,
    inline: false,
    'blur': 3
};

var styles = {
    block: {
        display: 'block',
        padding: 0,
        position: 'relative'
    },
    full: {
        position: 'absolute',
        display: 'block',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0
    },
    hidden: {
        visibility: 'hidden',
        opacity: 0
    },
    visible: {
        visibility: 'visible',
        opacity: 1
    },
    inline: {
        display: 'inline-block',
        width: '100%'
    }
};

exports.default = Image;