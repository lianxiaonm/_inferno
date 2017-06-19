/**
 * Created by h5 on 2017/5/26.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import { makeMap } from 'inferno-shared'

import { stop } from '../service/common'
//

import '../less/collapse.less'

//
export default class Collapse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: makeMap(props.active || '', {}, true)
        }
    }

    tapClick(index) {
        let active = this.state.active,
            accordion = !!this.props.accordion;
        this.setState({
            active: makeMap(index + '', accordion ? {} : active, !active[index])
        });
    }

    render() {
        let {props, state} = this,
            className = ['collapse', 'item-view'];
        props.className && className.push(props.className);
        return (
            <ul className={className.join(' ')}>
                {
                    props.children.map((item, idx) => {
                        return Inferno.cloneVNode(item, {
                            isActive: state.active[idx],
                            tapClick: this.tapClick.bind(this, idx)
                        })
                    })
                }
            </ul>
        )
    }
}

export function CollapseItem(props) {
    let className = ['item-list'],
        iconClass = ['icon-font'];
    props.isActive && className.push('on');
    iconClass.push(props.icon || 'icon-right');
    return (
        <li className={className.join(' ')}>
            <div className="collapse-item-bar" onTap={props.tapClick || stop}>
                <i className={iconClass.join(' ')}/>
                {props.title || '默认标题'}
            </div>
            <div className="collapse-item-wrap">{props.children}</div>
        </li>
    )
}
