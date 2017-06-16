import Inferno from 'inferno';
import Component from 'inferno-component';
import { isFunction } from 'inferno-shared'
import { noop, toggleClass } from '../service/common'

import '../less/swipe-menu.less'

let showNode = null;
export default class SwipeMenu extends Component {
    constructor(props) {
        super(props);
        let self = this;
        self.translate = self.translate.bind(self);
        self.touchStart = self.touchStart.bind(self);
        self.tap = self.tap.bind(self);
        self.swipe = self.swipe.bind(self);
        //实时滑动
        /*self.drag = self.drag.bind(self);
        self.touchEnd = self.touchEnd.bind(self);
        self.flickLeft = self.flickLeft.bind(self);*/
    }

    componentDidMount() {
        let props = this.props,
            domNode = this._vNode.dom;
        if ((props.btnList || []).length) {
            this.swipeWidth = -domNode.children[1].offsetWidth;
        }
    }

    touchStart() {
        this.vLocked = showNode;
        showNode && this.translate(showNode, 0, !0, !1)
    }

    tap() {
        let tapCall = this.props.onTap;
        this.vLocked || isFunction(tapCall) && tapCall();
    }

    translate(node, deltaX, isAdd, isSet) {
        //toggleClass(node, 'transition', isAdd);
        //node.style.transform = 'translate(' + deltaX + 'px,0) translateZ(0)';
        toggleClass(node, 'active', deltaX < 0);
        showNode = isSet ? node : null;
    }

    //非实时滑动
    swipe(event) {
        let detail = event.detail,
            deltaX = detail.deltaX,
            speed = detail.flickX / detail.flickTime,
            swipeWidth = this.swipeWidth;
        this.deltaX = (deltaX > swipeWidth / 2 || speed < -0.2) ? swipeWidth : 0;
        this.vLocked || this.translate(event.target, this.deltaX, true, this.deltaX < 0);
    }

    //实时滑动
    /*drag(event) {
        let targetNode = event.target,
            detail = event.detail,
            deltaX = detail.deltaX,
            isAdd = !!showNode;
        this.deltaX = deltaX = isAdd ? 0 : deltaX < this.swipeWidth
            ? this.swipeWidth : deltaX < 0 ? deltaX : 0;
        this.translate(showNode || targetNode, deltaX, deltaX == 0 || isAdd, false);
    }

    //实时滑动
    touchEnd(event) {
        this.deltaX = this.deltaX < this.swipeWidth / 2 ? this.swipeWidth : 0;
        this.translate(showNode || event.target, this.deltaX, true, this.deltaX < 0);
    }

    //实时滑动
    flickLeft(event) {
        let detail = event.detail,
            speed = detail.flickX / detail.flickTime;
        this.deltaX = speed < -0.2 ? this.swipeWidth : 0;
        this.translate(event.target, this.deltaX, true, this.deltaX < 0);
    }*/

    render(props, state) {
        let className = ['swipe-menu'],
            btnList = props.btnList || [];
        btnList.length || className.pop();
        props.className && className.push(props.className);
        return (
            btnList.length ? <li className={className.join(' ')}>
                <div className="front" onTap={this.tap}
                     onTouchStart={this.touchStart}
                     onSwipeLeft={this.swipe}>{props.children}</div>
                <div className="action">
                    {
                        btnList.map(item => {
                            let className = ['item'];
                            item.className && className.push(item.className);
                            return <span
                                onTap={item.tapClick || noop}
                                className={className.join(' ')}
                                dangerouslySetInnerHTML={{__html: item.html}}/>
                        })
                    }
                </div>
            </li> : props.children ? <li className={className.join(' ')}>{props.children}</li> : ''
        )
    }
}