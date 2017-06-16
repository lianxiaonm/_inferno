import Inferno from 'inferno';
import Component from 'inferno-component';
import { isArray } from 'inferno-shared'

import Picker from './picker'

import { equals, upChange } from '../service/common'

function indexOf(collec, val) {
    for (var i = 0, ii = collec.length; i < ii; i++) {
        if (collec[i].val == val.val && collec[i].txt == val.txt) return i;
    }
    return -1;
}

function createVal(collec, type) {
    return {
        idx: 0, list: collec.map(function (n) {
            return {txt: n.txt, val: n.val}
        }), type: type
    }
}

function createLinkPicker(list, pickerMap, select) {
    let children = list[0].children, len = pickerMap.length,
        pickerVal = createVal(list, len);
    select[len] = pickerVal.list[0], pickerMap.push(pickerVal);
    return isArray(children) ? createLinkPicker(children, pickerMap, select) : pickerMap;
}

class LinkagePicker extends Component {
    constructor(props) {
        super(props);
        this.pkChange = this.pkChange.bind(this);
        this.initState = this.initState.bind(this);
        this.state = this.initState(props);
    }

    initState(props) {
        return {pMap: createLinkPicker(props.pkList, [], this.select = {})}
    }

    pkChange(idx, obj, type) {
        this.select[type] = obj;
        let select = this.select || {},
            search = this.props.pkList;
        this.state.pMap.forEach((pk, i) => {
            if (pk.type == type) pk.idx = idx;
            if (pk.type == type + 1) {
                search = createVal(search, pk.type).list;//内容变更
                this._render = !equals(search, pk.list);
                this._render && (pk.list = search);
            } else {
                var index = indexOf(search, select[i] || 0);
                search = (search[index] || {}).children || [];
            }
        });
        this.setState({}), upChange.call(this, select);
    }

    componentWillReceiveProps(nextProps) {
        this._render = !equals(nextProps, this.props);
        this._render && this.setState(this.initState(nextProps));
    }

    shouldComponentUpdate() {
        return this._render
    }

    componentWillUpdate() {
        this._render = false, upChange.call(this, this.select);
    }

    render(prop, state) {
        let dataMap = state.pMap;
        return (
            <div className="picker-body">
                {
                    dataMap.map(item => <Picker
                        pList={item.list} pIdx={item.idx}
                        type={item.type} change={this.pkChange}/>)
                }
            </div>
        )
    }
}
export default LinkagePicker;

