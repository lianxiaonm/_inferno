/**
 * Created by h5 on 2017/5/26.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'
import { isFunction } from 'inferno-shared';

import Input from './input'
import { stop, equals, upChange, isPromiseLike } from '../service/common'
import { model } from '../service/ionic-lite'
import $q from '../service/$q'

import '../less/search.less'
//

export default class Search extends Component {

    constructor(props) {
        super(props);
        let self = this;
        self.initState = self.initState.bind(self);
        self.change = self.change.bind(self);
        self.search = self.search.bind(self);
        self.state = self.initState(props);
    }

    initState(props) {
        return {
            value: props.value,
            list: [],
            defaults: {
                history: props.history,
                hot: props.hot
            }
        }
    }

    change(value) {
        var query = this.props.query,
            result = isFunction(query) ? query(value) : '';
        this.setState({value: value});  //修改输入框内容
        (isPromiseLike(result) ? result : $q.when(result))
            .then(res => {
                this.setState({list: res.list})
            })
    }

    search() {
        var search = this.props.search;
        isFunction(search) && search(this.state.value);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.initState(nextProps))
    }

    render() {
        let {props, state} = this,
            className = ['search-body'];
        props.className && className.push(props.className);
        return (
            <div className={className.join(' ')}>
                <SearchInput
                    placeholder={props.placeholder}
                    value={state.value}
                    change={this.change}
                    search={this.search}
                    model={props.model}
                    close={props.close}/>
                <SearchResult
                    list={state.list}
                    defaults={state.defaults}
                    search={props.search}/>
            </div>
        )
    }
}

export class SearchInput extends Component {

    constructor(props) {
        super(props);
        this.validate = this.validate.bind(this);
    }

    shouldComponentUpdate(nextProp) {
        return !equals(nextProp, this.props);
    }

    validate(value) {
        value == this.props.value || upChange.call(this, value, 100);
    }

    render() {
        let {props} = this,
            className = ['search-input'];
        props.className && className.push(props.className);
        return (
            <div className={className.join(' ')}>
                {
                    props.model ? <i className="icon-font icon-close" onTap={props.close || stop}/> : ''
                }
                <Input type="search"
                       placeholder={props.placeholder}
                       value={props.value}
                       name="search"
                       validate={this.validate}>
                    <span className="r_btn"
                          onTap={props.search || stop}>搜索</span>
                </Input>
            </div>
        )
    }
}


export class SearchResult extends Component {

    shouldComponentUpdate(nextProp) {
        return !equals(nextProp, this.props);
    }

    search(value) {
        var search = this.props.search;
        isFunction(search) && search(value);
    }

    render(props, state) {
        let className = ['item-view', 'search-result'];
        props.className && className.push(props.className);
        return (
            <ul className={className.join(' ')}>
                {
                    props.list.map(item => {
                        return (
                            <li className="item-list" onTap={this.search.bind(this, item)}>
                                {item.text}
                                {
                                    (item.others || []).map(other =>
                                        <span onTap={this.search.bind(this, other)}>{other.text}</span>
                                    )
                                }
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

export function modelSearch(opts) {
    model(
        <Search className={opts.className}
                query={opts.query}
                placeholder={opts.placeholder}
                search={opts.search}
                model={true}
                close={e => model.hide(stop, e)}/>
    )
}