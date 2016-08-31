import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ReactDom from 'react-dom';
import objectAssign from 'object-assign';

import blur from './utils/blur';

class UniversalImage extends Component {

    componentWillMount() {
       this.initComponent();
    }

    componentDidMount() {
        this.allListeners();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.src !== this.props.src || nextProps.srcSet !== this.props.srcSet) {
            this.initComponent(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate(prevProps, prevState) {
        // components src was changed
        if (this.state.status === 'waiting' && prevState.status !== this.state.status) {
            if (this._scrollListener === null) {
                this.allListeners();
            }
        }
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    initComponent(porps) {

        if (typeof porps === 'undefined') {
            porps = this.props;
        }

        let ratio = porps.ratio > 0 ? porps.ratio : 0;
        if (ratio == 0 && porps.width && porps.height && parseInt(porps.width) > 0 && parseInt(porps.height) > 0) {
            ratio = parseInt(porps.width) / parseInt(porps.height);
        }

        this.setState({
            status: porps.lazy ? 'waiting': 'loading', // done, loading, animation,
            ratio: ratio,
            ratioAuto: false, // if ratio was calculated automatically
            ignoreTransition: false
        });

        if (this._doneTimer) {
            clearTimeout(this._doneTimer);
        }

        this._createdAt = (new Date()).getTime();
    }

    allListeners() {
        if (this.props.lazy) {
            this._scrollListener = this.scrollListener.bind(this);
            window.addEventListener('scroll', this._scrollListener, false);
            window.addEventListener('wheel', this._scrollListener, false);
            this._scrollListener();
        }
    }

    removeListeners() {
        if (typeof this._scrollListener === 'function') {
            window.removeEventListener('scroll', this._scrollListener, false);
            window.removeEventListener('wheel', this._scrollListener, false);
            this._scrollListener = null;
        }
    }

    scrollListener() {
        if (!this.scrollWait) {
            this.scrollWait = true;

            this.checkVisibility();

            setTimeout(() => {
                this.scrollWait = false;
            }, this.props.debounce);
        }
    }

    getWindowHeight() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    getScrollTop() {
        const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
        return typeof window.pageXOffset !== 'undefined' ? window.pageYOffset :
            isCSS1Compat ?
                document.documentElement.scrollTop :
                document.body.scrollTop;
    }

    getNode() {
        if (!this._node) {
            this._node = ReactDom.findDOMNode(this);
        }
        return this._node;
    }

    isVisible() {

        const scrollTop = this.getScrollTop();

        const rect = this.getNode().getBoundingClientRect();

        const elementTop = rect.top + scrollTop;
        const elementBottom = elementTop + rect.height;

        const documentBottom = scrollTop + this.getWindowHeight();

        return (elementTop <= documentBottom) && (elementBottom  >= scrollTop);
    }

    checkVisibility() {
        if (this.state.status === 'waiting' && this.isVisible()) {
            this.setState({
                status: 'loading'
            });
            this.removeListeners();
        }
    }

    renderFillBox() {
        const padding = this.state.ratio > 0 ? (1 / this.state.ratio) * 100 : 50;
        const style = objectAssign({}, styles.block, { paddingBottom:  padding + '%' });
        return (<span style={style}></span>);
    }

    onPlaceHolderLoad() {
        const thumbnail = this.getNode().getElementsByTagName('img')[0];

        if (!(thumbnail.naturalHeight > 0)) {
            return;
        }

        if (this.props.blur > 0) {
            const canvas = this.getNode().getElementsByTagName('canvas')[0];
            if (canvas && thumbnail) {
                canvas.width = 60;
                canvas.height = Math.max(10, Math.round(60 / (thumbnail.naturalWidth / thumbnail.naturalHeight)));

                if (typeof window !== 'undefined') {
                    const cacheKey = this.props.placeholder.length > 60 ? this.props.src : this.props.placeholder;

                    if (typeof window.universalImageCache === 'undefined') {
                        window.universalImageCache = {};
                    }

                    if (typeof window.universalImageCache[cacheKey] === 'undefined') {
                        canvas.getContext('2d').drawImage(thumbnail, 0, 0, canvas.width, canvas.height);
                        blur(canvas, this.props.blur);
                        window.universalImageCache[cacheKey] = canvas.toDataURL('image/jpeg');
                    }
                    else {
                        // get blured image from cache
                        this._blureCache = new Image();
                        this._blureCache.onload = () => {
                            if (this._blureCache) {
                                canvas.getContext('2d').drawImage(this._blureCache, 0, 0, canvas.width, canvas.height);
                            }
                        };
                        this._blureCache.src = window.universalImageCache[cacheKey];
                    }

                }
                else {
                    canvas.getContext('2d').drawImage(thumbnail, 0, 0, canvas.width, canvas.height);
                    blur(canvas, this.props.blur);
                }
            }
        }

        if (this.state.ratio == 0) {
            // get ratio from placeholder
            this.setState({
                ratio: thumbnail.naturalWidth / thumbnail.naturalHeight,
                ratioAuto: true
            });
        }
    }

    onImageLoad() {

        let newState = {};

        if (this.state.ratio == 0 || this.state.ratioAuto) {
            let images = this.getNode().getElementsByTagName('img');
            let image = images[images.length - 1];
            // get ratio from image
            newState.ratio = image.naturalWidth / image.naturalHeight;
            newState.ratioAuto = true;
        }

        if (this.props.animationSpeed === 0 || (this.props.skipAnimation > 0 && (new Date()).getTime() < (this._createdAt + this.props.skipAnimation))) {
            newState.status = 'done';
            newState.ignoreTransition = true;
        }
        else {
            newState.status = 'animation';

            this._doneTimer = setTimeout(() => {
                this.setState({
                    status: 'done'
                });
            }, this.props.animationSpeed + 100); // + 100ms in case of lags
        }

        this.setState(newState);
    }

    onImageError() {
        this.setState({
            status: 'error'
        });
    }

    renderPlaceholder() {

        const placeholder = this.props.placeholder;

        if (this.state.status === 'done' || typeof placeholder === 'undefined' || (this.state.status === 'error' && typeof this.props.fallback === 'string')) {
            return null;
        }

        const style = objectAssign({}, styles.full, styles.otimize, {zIndex: 1});

        if (typeof placeholder === 'string') {


            const allowedAttributes = ['alt', 'crossOrigin'];
            let attributes = {};
            allowedAttributes.forEach((attribute) => {
                if (typeof this.props[attribute] !== 'undefined') {
                    attributes[attribute] = this.props[attribute];
                }
            });

            attributes.onLoad = () => {
                this.onPlaceHolderLoad();
            };

            attributes.src = placeholder;

            if (this.props.blur > 0) {
                attributes.style = {display: 'none'};
                return [
                    <img key={1} {...attributes} />,
                    <canvas key={2} style={style} />
                ];
            }
            else {
                attributes.style = style;
                return (<img {...attributes} />);
            }
        }
        else {
            return (<span style={style}>placeholder</span>);
        }
    }

    renderImage() {
        if (this.state.status === 'waiting') {
            return null;
        }

        if (this.state.status === 'error') {
            if (typeof this.props.fallback === 'string') {
                let backgroundStyle = {
                    backgroundImage: 'url(' + this.props.fallback + ')',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center'
                };
                let style = objectAssign({}, styles.full, {zIndex: 2}, backgroundStyle);
                return (<span className="img-fallback" style={style}></span>)
            }
            else {
                return null;
            }
        }

        const transition = this.state.ignoreTransition ? {} : {transition: 'visibility 0s linear 0s, opacity ' + (this.props.animationSpeed / 1000) + 's 0s'};

        let style = objectAssign({}, styles.full, styles.otimize, transition, {zIndex: 2});
        if (this.state.status === 'done' || this.state.status === 'animation') {
            style = objectAssign(style, styles.visible);
        }
        else {
            style = objectAssign(style, styles.hidden);
        }

        const allowedAttributes = ['src', 'srcSet', 'sizes', 'alt', 'crossOrigin'];
        let attributes = {};
        allowedAttributes.forEach((attribute) => {
            if (typeof this.props[attribute] !== 'undefined') {
                attributes[attribute] = this.props[attribute];
            }
        });

        attributes.onLoad = () => {
            this.onImageLoad();
        };

        attributes.onError = (h) => {
            this.onImageError();
        };

        attributes.style = style;

        return (<img {...attributes} />)
    }

    getWrapperProps() {
        let props = {};

        props.style = objectAssign({}, styles.block);

        if (this.props.inline) {
            props.style = objectAssign(props.style, styles.inline);
        }

        if (this.props.maxWidth) {
            if (typeof this.props.maxWidth === 'number' || /^\d+$/.test(this.props.maxWidth)) {
                props.style.maxWidth = this.props.maxWidth + 'px';
            }
            else {
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

    render() {
        return (
            <span {...this.getWrapperProps()}>
            {this.renderFillBox()}
            {this.renderPlaceholder()}
            {this.renderImage()}
            </span>
        );
    }
}

UniversalImage.propTypes = {
    src: PropTypes.string.isRequired,
    srcSet: PropTypes.string,
    sizes: PropTypes.string,
    maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    ratio: PropTypes.number,
    alt: PropTypes.string,
    crossOrigin: PropTypes.string,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    'blur': React.PropTypes.number,
    className: PropTypes.string,
    id: PropTypes.string,
    debounce: PropTypes.number,
    animationSpeed: PropTypes.number,
    inline: React.PropTypes.bool,
    fallback: PropTypes.string,
    lazy: PropTypes.bool,
    skipAnimation: PropTypes.number
};

UniversalImage.defaultProps = {
    alt: '',
    debounce: 200,
    animationSpeed: 400,
    inline: false,
    'blur': 3,
    lazy: true,
    skipAnimation: 0
};

const styles = {
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
    },
    otimize: {
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)'
    }
};


export default UniversalImage;