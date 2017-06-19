/**
 * Created by h5 on 2017/5/26.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import Page from '../../plugin/common/component/page'
import Search, { SearchResult, modelSearch } from '../../plugin/common/component/search'

import infernoService from '../service/infernoService'


export default class searchPage extends Component {
    constructor(props) {
        super(props);
        this.query = this.query.bind(this);
        this.search = this.search.bind(this);
        this.modelClick0 = this.modelClick.bind(this, {
            query: this.query,
            placeholder: '卡布奇诺',
            search: this.search
        });
        this.modelClick1 = this.modelClick.bind(this, {
            className: 'sch-tMall',
            query: this.query,
            placeholder: 'tMall',
            search: this.search
        })
        this.state = {
            option: {
                title: {value: 'search page'}
            },
            list: [],
            defaults: {
                history: [],
                hot: []
            }
        }
    }

    modelClick(options) {
        modelSearch(options);
    }

    query(value) {
        return infernoService.search(value).then(res => {
            return {
                list: res.data.result.map(item => {
                    return {url: '', text: item[0]}
                })
            }
        })
    }

    search(value) {
        console.log(value);
    }

    render() {
        const {state} = this;
        return (
            <Page option={state.option}>
                <button onTap={this.modelClick0}>默认model搜索</button>
                <button onTap={this.modelClick1}>tMall风格model搜索</button>
                <Search query={this.query} placeholder="咖啡" search={this.search}/>
            </Page>
        )
    }
}