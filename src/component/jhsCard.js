import Inferno from 'inferno'

import './less/jhsCard.less'

export default function JHSCard(props) {
    let item = props.data,
        baseInfo = item.baseinfo || {},
        name = item.name || {},
        price = item.price || {},
        remind = item.remind || {};
    return (
        <li className="item-list">
            <div className="pic">
                <img src={baseInfo.picUrlNew + '_270x450Q90.jpg_.webp'}/>
            </div>
            <p className="name">{name.title}</p>
            <del className="del-price">{price.origPrice}</del>
            <div className="safe-info">
                <em className="price">{price.actPrice}</em>
                <small className="count">{(remind.soldCount || 0) + '件已售'}</small>
            </div>
        </li>
    )
}