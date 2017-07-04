/**
 * Created by h5 on 2017/7/4.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import '../less/rate.less'

export default class Rate extends Component {

    constructor(props) {
        super(props);
        this.state = this.initState(props);
        this.select = this.select.bind(this);
    }

    initState(props) {
        return {
            value: props.value || 0
        }
    }

    select(event) {
        let props = this.props,
            target = event.target;
        if (!props.disbaled)
            switch (target.tagName) {
                case 'I':
                    let idx = target.getAttribute('rate-id');
                    props.select && props.select(idx);
                    return this.setState({value: idx})
            }
    }

    render() {
        let {props} = this,
            max = props.max || 5,
            value = this.state.value,
            className = ['rate-body'];
        props.className && className.push(props.className);
        props.disbaled && className.push('disabled');
        return (
            <div className={className.join(' ')} onTap={this.select}>
                {
                    new Array(~~max + 1).join('.').split('')
                        .map((item, idx) => {
                            let dif = value - idx,
                                clz = dif >= 1 ? 'on' : dif > 0 ? 'half' : '';
                            return <i className={clz} rate-id={~~idx + 1}/>;
                        })
                }
                <em>{value}</em>
            </div>
        )
    }
}