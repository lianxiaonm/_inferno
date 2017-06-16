/**
 * Created by h5 on 2017/5/25.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import Page from '../../plugin/common/component/page'
import Progress from '../../plugin/common/component/progress'


let random = Math.random;
export default class ProgressPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {
                title: {value: 'progress page'}
            },
            progressList: [
                {type: '', className: 'mini', percent: random() * 100},
                {type: '', className: 'mini', percent: random() * 100, color: '#13CE66'},
                {type: '', className: 'mini', percent: random() * 100, color: '#FF4949'},
                {type: '', className: '', percent: random() * 100},
                {type: '', className: 'success', percent: random() * 100, color: '#13CE66'},
                {type: '', className: 'danger', percent: random() * 100, color: '#FF4949'},
                {type: '', className: 'large', percent: random() * 100},
                {type: '', className: 'large success', percent: random() * 100, color: '#13CE66'},
                {type: '', className: 'large danger', percent: random() * 100, color: '#FF4949'},
                {type: 'circle', className: 'large', percent: random() * 100},
                {type: 'circle', className: 'large', percent: random() * 100, color: '#13CE66'},
                {type: 'circle', className: '', percent: random() * 100},
                {type: 'circle', className: '', percent: random() * 100, color: '#13CE66'},
                {type: 'circle', className: '', percent: random() * 100, color: '#FF4949'}
            ]
        }
    }

    componentDidMount() {
        this._timer = setInterval(() => {
            let progressList = this.state.progressList.map(item => {
                let percent = item.percent,
                    flag = percent == 100 ? false : percent == 0 ? true : Math.random() < 0.5,
                    random = Math.floor(Math.random() * Math.random() * 100);
                percent += flag ? random : -random;
                item.percent = percent > 100 ? 100 : percent < 0 ? 0 : percent;
                return item;
            });
            this.setState({progressList: progressList});
        }, 3000)
    }

    componentWillUnmount() {
        clearInterval(this._timer);
    }

    render(props, state) {
        return (
            <Page option={state.option}>
                {
                    state.progressList.map(item => <Progress
                        type={item.type} className={item.className}
                        percent={item.percent} delete={item.delete} color={item.color}/>)
                }
            </Page>
        )
    }
}