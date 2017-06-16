import Inferno from 'inferno';
import Component from 'inferno-component';

import { equals } from '../service/common'

let topPocketDown = '下拉可以刷新',
    topPocketOver = '释放立即刷新',
    topPocketRefresh = '正在刷新...',
    bottomPocketUp = '上拉加载更多',
    bottomPocketOver = '松开加载更多',
    bottomPocketRefresh = '正在加载..';

function initPullTop(domNode) {
    this.topPocket = domNode.querySelector('.scroll-body > .top-pocket');
    this.topHeight = this.topPocket.offsetHeight;
}
function initPullBottom(domNode) {
    this.bottomPocket = domNode.querySelector('.scroll-body > .bottom-pocket');
    this.bottomHeight = this.bottomPocket.offsetHeight;
}

class Scroll extends Component {
    constructor(props) {
        super(props);
        let self = this;
        self.initEvent = self.initEvent.bind(self);
        self.drag = self.drag.bind(self);
        self.dragend = self.dragend.bind(self);
        self.stopPull = self.stopPull.bind(self);
    }

    componentDidMount() {
        let props = this.props,
            pullDown = props.pullDown,
            pullUp = props.pullUp,
            domNode = this._vNode.dom;
        this._scroll = new window.IScroll(domNode, props.options || {});
        pullDown && initPullTop.call(this, domNode);
        pullUp && initPullBottom.call(this, domNode);
        (pullDown || pullUp) && this.initEvent();
    }

    shouldComponentUpdate(props) {
        return !equals(props, this.props);
    }

    componentWillUnmount() {
        this._scroll && this._scroll.destroy();
    }

    initEvent(detach) {
        let scroll = this._scroll, _detach = !!detach;
        scroll.toggleEvent('drag', this.drag, _detach);
        scroll.toggleEvent('touchend', this.dragend, _detach);
    }

    drag(that) {
        if (that.y > 0 && this.topPocket) {
            this.topPocket.innerHTML = that.y > this.topHeight ?
                topPocketOver : topPocketDown;
        } else if (that.y < that.maxY && this.bottomPocket) {
            this.bottomPocket.innerHTML = that.y < that.maxY - this.bottomHeight ?
                bottomPocketOver : bottomPocketUp;
        }
    }

    dragend(that) {
        let props = this.props,
            pullDown = props.pullDown,
            pullUp = props.pullUp;
        if (pullDown && that.y > this.topHeight) {
            this.topPocket.innerHTML = topPocketRefresh;
            this._scroll.scrollTo(0, this.topHeight, 300);
            that.hold = true, pullDown(that);
        } else if (pullUp && that.y < that.maxY - this.bottomHeight) {
            this.bottomPocket.innerHTML = bottomPocketRefresh;
            this._scroll.scrollTo(0, that.maxY - this.bottomHeight, 300);
            that.hold = true, pullUp(that);
        }
    }

    stopPull(type) {
    }

    render(props) {
        let className = ['scroll-wrapper'];
        props.className && className.push(props.className);
        return (
            <div className={className.join(' ')}>
                <div className="scroll-body">
                    {
                        props.pullDown ? <div className="top-pocket">下拉刷新</div> : ''
                    }
                    {props.children}
                    {
                        props.pullUp ? <div className="bottom-pocket">上拉加载更多</div> : ''
                    }
                </div>
            </div>
        )
    }
}
export default Scroll;