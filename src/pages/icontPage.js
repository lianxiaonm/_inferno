/**
 * Created by h5 on 2017/5/25.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import Page from '../../plugin/common/component/page'

import '../style/less/index.less'

export default class IconPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {
                title: {value: 'icon page'}
            },
            iconList: [
                {keyCode: '64e', name: '', className: 'icon-loading'},
                {keyCode: '609', name: '', className: 'icon-loading1'},
                {keyCode: '7ca;', name: '', className: 'icon-ask'},
                {keyCode: '7c9', name: '', className: 'icon-ask-fill'},
                {keyCode: '78d', name: '', className: 'icon-emoji-fill'},
                {keyCode: '768', name: '', className: 'icon-move'},
                {keyCode: '767', name: '', className: 'icon-add'},
                {keyCode: '763', name: '', className: 'icon-radio-box-fill'},
                //
                {keyCode: '759', name: '', className: 'icon-post'},
                {keyCode: '731', name: '', className: 'icon-mark'},
                {keyCode: '730', name: '', className: 'icon-mark-fill'},
                {keyCode: '727', name: '', className: 'icon-camera-add-fill'},
                {keyCode: '724', name: '', className: 'icon-camera-add'},
                {keyCode: '71c', name: '', className: 'icon-male'},
                {keyCode: '71a', name: '', className: 'icon-female'},
                {keyCode: '70b', name: '', className: 'icon-qiang'},
                //
                {keyCode: '70a', name: '', className: 'icon-notice'},
                {keyCode: '709', name: '', className: 'icon-notice-fill'},
                {keyCode: '708', name: '', className: 'icon-countdown'},
                {keyCode: '707', name: '', className: 'icon-countdown-fill'},
                {keyCode: '6fb', name: '', className: 'icon-barcode'},
                {keyCode: '6f3', name: '', className: 'icon-share'},
                {keyCode: '6f2', name: '', className: 'icon-wifi'},
                {keyCode: '6ee', name: '', className: 'icon-vip-card'},
                //
                {keyCode: '6ed', name: '', className: 'icon-recharge'},
                {keyCode: '6ec', name: '', className: 'icon-recharge-fill'},
                {keyCode: '6e5', name: '', className: 'icon-info'},
                {keyCode: '6e4', name: '', className: 'icon-info-fill'},
                {keyCode: '6e3', name: '', className: 'icon-appreciate-fill'},
                {keyCode: '6de', name: '', className: 'icon-fold'},
                {keyCode: '6d9', name: '', className: 'icon-round-add'},
                {keyCode: '6d8', name: '', className: 'icon-round-add-fill'},
                //
                {keyCode: '6d7', name: '', className: 'icon-round'},
                {keyCode: '6d6', name: '', className: 'icon-square-check'},
                {keyCode: '6d5', name: '', className: 'icon-square'},
                {keyCode: '6d4', name: '', className: 'icon-square-check-fill'},
                {keyCode: '6d3', name: '', className: 'icon-present'},
                {keyCode: '6bd', name: '', className: 'icon-address-book'},
                {keyCode: '6b4', name: '', className: 'icon-delete'},
                {keyCode: '6b2', name: '', className: 'icon-remind'},
                //
                {keyCode: '6b0', name: '', className: 'icon-qr-code'},
                {keyCode: '6a6', name: '', className: 'icon-delete-fill'},
                {keyCode: '6a5', name: '', className: 'icon-more-android'},
                {keyCode: '6a4', name: '', className: 'icon-refresh'},
                {keyCode: '6a3', name: '', className: 'icon-right'},
                {keyCode: '69e', name: '', className: 'icon-top'},
                {keyCode: '69c', name: '', className: 'icon-filter'},
                {keyCode: '69b', name: '', className: 'icon-pic'},
                //
                {keyCode: '691', name: '', className: 'icon-question'},
                {keyCode: '690', name: '', className: 'icon-question-fill'},
                {keyCode: '689', name: '', className: 'icon-scan'},
                {keyCode: '684', name: '', className: 'icon-more'},
                {keyCode: '682', name: '', className: 'icon-list'},
                {keyCode: '67c', name: '', className: 'icon-cascades'},
                {keyCode: '679', name: '', className: 'icon-back'},
                {keyCode: '669', name: '', className: 'icon-like'},
                //
                {keyCode: '668', name: '', className: 'icon-like-fill'},
                {keyCode: '667', name: '', className: 'icon-comment'},
                {keyCode: '666', name: '', className: 'icon-comment-fill'},
                {keyCode: '665', name: '', className: 'icon-camera'},
                {keyCode: '664', name: '', className: 'icon-camera-fill'},
                {keyCode: '663', name: '', className: 'icon-warn'},
                {keyCode: '662', name: '', className: 'icon-warn-fill'},
                {keyCode: '661', name: '', className: 'icon-unfold'},
                //
                {keyCode: '65f', name: '', className: 'icon-time'},
                {keyCode: '65e', name: '', className: 'icon-time-fill'},
                {keyCode: '65c', name: '', className: 'icon-search'},
                {keyCode: '659', name: '', className: 'icon-round-close'},
                {keyCode: '658', name: '', className: 'icon-round-close-fill'},
                {keyCode: '657', name: '', className: 'icon-round-check'},
                {keyCode: '656', name: '', className: 'icon-round-check-fill'},
                {keyCode: '652', name: '', className: 'icon-phone'},
                //
                {keyCode: '651', name: '', className: 'icon-location'},
                {keyCode: '650', name: '', className: 'icon-location-fill'},
                {keyCode: '64c', name: '', className: 'icon-favor'},
                {keyCode: '64b', name: '', className: 'icon-favor-fill'},
                {keyCode: '64a', name: '', className: 'icon-emoji'},
                {keyCode: '649', name: '', className: 'icon-edit'},
                {keyCode: '646', name: '', className: 'icon-close'},
                {keyCode: '645', name: '', className: 'icon-check'},
                //
                {keyCode: '644', name: '', className: 'icon-appreciate'}
            ]
        }
    }

    render(props, state) {
        return (
            <Page option={state.option}>
                <ul className="m-row font-page">
                    {
                        state.iconList.map(item => {
                            let className = ['icon-font'].concat(item.className),
                                describe = '&#xe' + item.keyCode;
                            return (
                                <li className="col-4">
                                    <i className={className.join(' ')}/>
                                    <p>{item.className}</p>
                                    编码:{describe}
                                </li>
                            )
                        })
                    }
                </ul>
            </Page>
        )
    }
}