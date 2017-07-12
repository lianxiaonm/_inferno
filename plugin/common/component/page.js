import Inferno from 'inferno';

import Scroll from './scroll'
import Header from './header'

export default function Page(props) {
    return (
        <div className={props.className}>
            <Header option={props.option}/>
            <Scroll pullDown={props.pullDown}
                    pullUp={props.pullUp}>
                {props.children}
            </Scroll>
        </div>
    )
}

export function staticPage(props) {
    return (
        <div className={props.className}>
            <Header option={props.option}/>
            <Scroll pullDown={props.pullDown}
                    pullUp={props.pullUp}>
                {props.children}
            </Scroll>
        </div>
    )
}

