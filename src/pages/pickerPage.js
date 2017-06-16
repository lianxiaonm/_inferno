//公共模块
import Inferno from 'inferno';
import Component from 'inferno-component';

import Page from '../../plugin/common/component/page'
import Picker from '../../plugin/common/component/picker'
import DatePicker from '../../plugin/common/component/datePicker'
import LinkagePicker from '../../plugin/common/component/linkagePicker'

import { forEach } from '../../plugin/common/service/common'
import $popPicker from '../../plugin/common/service/popPicker'
import { $popUp } from '../../plugin/common/service/ionic-lite'

import '../style/less/index.less'
/*
 * 组件定义, 通过继承Component实现
 * */
class pickerPage extends Component {
    constructor(props) {
        super(props);
        this.pkChange = this.pkChange.bind(this);
        this.datePkChange = this.datePkChange.bind(this);
        this.areaPkChange = this.areaPkChange.bind(this);
        this.area3PkChange = this.area3PkChange.bind(this);
        this.datePopPicker = this.datePopPicker.bind(this);
        this.state = {
            option: {title: {value: 'picker选择器'}},
            pList: ['张三', '李四', '王五', '赵六', '眯眯', '三少爷', '无心法师', '谢逊', '张无忌'],
            idx: 2,
            dateBtn: [
                {text: '默认的日期选择器', tap: this.datePopPicker.bind(this, '')},
                {text: 'date的日期选择器', tap: this.datePopPicker.bind(this, 'date')},
                {text: 'month的日期选择器', tap: this.datePopPicker.bind(this, 'month')},
                {text: 'hour的日期选择器', tap: this.datePopPicker.bind(this, 'hour')},
                {text: '省市联动', tap: this.linkagePopPicker.bind(this, cityData)},
                {text: '省市区联动', tap: this.linkagePopPicker.bind(this, cityData3)},
                {
                    text: '简单的单选', tap: this.linkagePopPicker.bind(this, [
                    {txt: '陈宇', val: 'cy'},
                    {txt: '杜培培', val: 'dpp'},
                    {txt: '齐玥', val: 'qy'},
                    {txt: '徐明嵩', val: 'xms'},
                    {txt: '包立超', val: 'blc'},
                    {txt: '林宇宏', val: 'lyh'},
                    {txt: '彭硕', val: 'ps'},
                    {txt: '张帆', val: 'zf'},
                    {txt: '倪敏', val: 'nm'},
                    {txt: '祝军', val: 'zj'},
                    {txt: '颜俊', val: 'yj'},
                    {txt: '马刊迎', val: 'mky'},
                    {txt: '黄丽丹', val: 'hld'}
                ])
                }
            ]
        }
    }

    componentDidMount() {
    }

    datePopPicker(type) {
        $popPicker.date({type: type}, select=> {
            $popUp.alert({
                title: '您选择的',
                content: getSelect(select, '-', 'txt')
            })
        })
    }

    linkagePopPicker(city) {
        $popPicker.show(city, null, select=> {
            $popUp.alert({
                title: '您选择的',
                content: getSelect(select, '-', 'txt')
            })
        })
    }

    pkChange(idx, obj, type) {
        this.setState({idx: idx, val: obj});
    }

    datePkChange(select) {
        this.setState({
            datePk: select
        })
    }

    areaPkChange(select) {
        this.setState({
            areaPk: select
        })
    }

    area3PkChange(select) {
        this.setState({
            area3Pk: select
        })
    }

    render(prop, state) {
        let options = {type: 'date'}, options2 = {type: ''};
        return (
            <Page option={state.option}>
                {
                    state.dateBtn.map(item=><button onTap={item.tap}>{item.text}</button>)
                }
                <h2>普通的picker:{state.val}</h2>
                <Picker pList={state.pList} change={this.pkChange}
                        pIdx={state.idx} type="1"/>

                <h2>日期picker:{getSelect(state.datePk, '-')}</h2>
                <DatePicker options={options} change={this.datePkChange}/>

                <h2>省市Picker:{getSelect(state.areaPk, '/', 'txt')}</h2>
                <LinkagePicker pkList={cityData} change={this.areaPkChange}/>

                <h2>省市区Picker:{getSelect(state.area3Pk, '/', 'txt')}</h2>
                <LinkagePicker pkList={cityData3} change={this.area3PkChange}/>
            </Page>
        )
    }
}

function getSelect(select, prefix, key) {
    let html = [];
    forEach(select, function (val) {
        val && html.push(val[key || 'val']);
    });
    return html.join(prefix);
}

export default pickerPage
