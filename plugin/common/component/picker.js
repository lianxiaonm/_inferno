import Inferno from 'inferno';
import Component from 'inferno-component';

import { equals } from '../service/common'

import '../less/picker.less'

class Picker extends Component {
    componentDidMount() {
        let props = this.props,
            domNode = this._vNode.dom,
            picker = this.picker = new window.$Picker(domNode);
        picker.toggleEvent('change', ()=> {
            let props = this.props,
                idx = props.pIdx = picker.getIdx();
            props.change && props.change(idx, props.pList[idx], props.type);
        });
        picker.setIdx(props.pIdx || 0);
    }

    componentWillReceiveProps(nextProp) {
        this._render = !equals(nextProp, this.props);
        this.props.pIdx != nextProp.pIdx && (this.pIdx = nextProp.pIdx);
        //console.log(nextProp.type + '---------componentWillReceiveProps--------------');
    }

    shouldComponentUpdate(props) {
        //console.log(props.type + '---------shouldComponentUpdate--------------');
        return this._render;
    }

    componentDidUpdate(props) {
        //console.log(this.props.type + '---------componentDidUpdate--------------');
        this.picker.reLayout(this.pIdx), this.pIdx = null;
    }

    componentWillUnmount() {
        this.picker.destroy();
    }

    render(prop, state) {
        let pList = prop.pList || [];
        return (
            <div className="picker">
                <div className="picker-inner">
                    <div className="picker-rule"/>
                    <ul className="picker-list">
                        {
                            pList.map(item=><li>{item.txt == null ? item : item.txt}</li>)
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
export default Picker;

