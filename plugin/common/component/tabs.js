/**
 * Created by h5 on 2017/5/26.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import Scroll from "./scroll";
import { makeMap } from 'inferno-shared'

import '../less/tabs.less'

//
export default class Tabs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: makeMap(props.active || '', {}, true)
        }
    }

    tapClick(index) {
        this.setState({
            active: makeMap(index + '', {}, true)
        });
    }

    render(props, state) {
        let className = ['tab-view'],
            scrollType = props.scrollType,
            options = {},
            children = props.children || [];
        props.className && className.push(props.className);
        //弹性滚动
        if (scrollType) {
            /^x$/i.test(scrollType) && (options = {scrollY: false, scrollX: true});
            className.push('inline-' + (/^x$/i.test(scrollType) ? 'x' : 'y'));
        }
        return children.length ? (
            <div className={className.join(' ')}>
                {
                    !scrollType ? (
                        <ul className="tab-nav">
                            {
                                children.map((item, idx) => {
                                    return <li onTap={this.tapClick.bind(this, idx)}
                                               className={state.active[idx] ? 'on' : ''}>{item.props.label}</li>;
                                })
                            }
                        </ul>
                    ) : (
                        <Scroll options={options} className="tab-nav-v1">
                            {
                                children.map((item, idx) => {
                                    return <span onTap={this.tapClick.bind(this, idx)}
                                                 className={state.active[idx] ? 'on' : ''}>{item.props.label}</span>;
                                })
                            }
                        </Scroll>
                    )
                }
                <div className="tab-body">
                    {
                        children.map((item, idx) => {
                            return Inferno.cloneVNode(item, {
                                isActive: state.active[idx]
                            })
                        })
                    }
                </div>
            </div>
        ) : ''
    }
}

export function TabPanel(props) {
    let className = ['tab-panel'];
    props.isActive && className.push('on');
    return (
        <div className={className.join(' ')}>{props.children}</div>
    )
}
