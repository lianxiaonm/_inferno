/**
 * Created by h5 on 2017/5/25.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'
import { equals } from '../service/common'

import '../less/progress.less'


export default class Progress extends Component {
    constructor(props) {
        super(props);
        let self = this;
        self.progress = self.progress.bind(self);
        self.state = {percent: 0, time: 0};
        setTimeout(() => self.progress(props), 100);
    }

    progress(props) {
        let distance = Math.abs(props.percent - this.state.percent),
            time = Math.floor(distance / 0.04);
        if (distance == 0) return;
        this.setState({percent: props.percent.toFixed(1), time: time});
        props.percent == 100 && props.delete && setTimeout(() => this.setState({delete: true}), time + 300);
    }

    //线性进度条
    lineStyle(percent, time, color) {
        return [
            'width:' + (percent || 0) + '%',
            'transition-duration:' + time,
            'background-color:' + (color || '#20A0FF')
        ].join(';')
    }

    //圆形进度条
    relativeStrokeWidth() {return 5.8}

    trackPath() {
        const radius = parseInt(50 - this.relativeStrokeWidth() / 2, 10);
        return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
    }

    perimeter() {
        const radius = 50 - this.relativeStrokeWidth() / 2;
        return 2 * Math.PI * radius;
    }

    circlePathStyle(percent, time) {
        const perimeter = this.perimeter();
        return [
            'stroke-dasharray:' + perimeter + 'px,' + perimeter + 'px',
            'stroke-dashoffset:' + (1 - percent / 100) * perimeter + 'px',
            'transition:stroke-dashoffset ' + time + ' ease 0s, stroke ' + time + ' ease'
        ].join(';')
    }


    componentWillReceiveProps(nextProps) {
        equals(this.props, nextProps) || this.progress(nextProps);
    }

    render() {
        let {props, state} = this,
            className = props.type == 'circle' ? ['progress-circle'] : ['progress-bar'],
            timer = (state.time || 0) + 'ms';              //时间
        props.className && className.push(props.className);
        return state.delete ? '' : props.type == 'circle' ? (
            <div className={className.join(' ')}>
                <svg viewBox="0 0 100 100">
                    <path d={this.trackPath()} stroke="#e5e9f2"
                          strokeWidth={this.relativeStrokeWidth()} fill="none"/>
                    <path d={this.trackPath()} strokeLinecap="round"
                          stroke={props.color || '#20A0FF'}
                          strokeWidth={this.relativeStrokeWidth()}
                          fill="none" style={this.circlePathStyle(state.percent, timer)}/>
                </svg>
                <span className="circle-text">{(state.percent || 0) + '%'}</span>
            </div>

        ) : (
            <div className={className.join(' ')}>
                <div className="bar-outer">
                    <div className="bar-inner" style={this.lineStyle(state.percent, timer, props.color)}/>
                </div>
            </div>

        )
    }
}