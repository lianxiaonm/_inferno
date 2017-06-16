import Inferno from 'inferno';
import DatePicker from '../component/datePicker'
import LinkagePicker from '../component/linkagePicker'
import { model } from './ionic-lite';

let select = {};
function pkChange(_select) {
    select = _select;
}
function popPkTap(isSure, call) {
    isSure ? model.hide(call, select) : model.hide()
}
const $popPicker = {
    show: function (options, type, call) {
        model(
            <div className="pop-picker">
                <div className="pop-picker-header">
                        <span className="btn btn-default"
                              onTap={popPkTap.bind(null,false)}>取消</span>
                        <span className="btn btn-positive"
                              onTap={popPkTap.bind(null,true,call)}>确定</span>
                </div>
                {
                    type == 'date' ? <DatePicker options={options} change={pkChange}/>
                        : <LinkagePicker pkList={options} change={pkChange}/>
                }
            </div>, ''
        );
    },
    date: function (options, call) {
        this.show(options, 'date', call);
    }
};
export default $popPicker;