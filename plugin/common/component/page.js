import Inferno from 'inferno';

import Scroll from './scroll'
import YqbHeader from './yqbHeader'

export default function Page(props) {
    return (
        <div className={props.className}>
            <YqbHeader option={props.option}/>
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
            <YqbHeader option={props.option}/>
            <Scroll pullDown={props.pullDown}
                    pullUp={props.pullUp}>
                {props.children}
            </Scroll>
        </div>
    )
}

