/**
 * Created by h5 on 2017/5/26.
 */
import Inferno from 'inferno'
import Component from 'inferno-component'

import Page from '../../plugin/common/component/page'

import Collapse, { CollapseItem } from '../../plugin/common/component/collapse'

export default class collapsePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {
                title: {value: 'collapse page'}
            }
        }
    }

    render() {
        const {state} = this;
        return (
            <Page option={state.option}>
                <h3>常规</h3>
                <Collapse active="0,1">
                    <CollapseItem title="一致性 Consistency" icon="icon-check">
                        与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；<br/>
                        在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
                    </CollapseItem>
                    <CollapseItem title="反馈 Feedback">
                        控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；<br/>
                        页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
                    </CollapseItem>
                    <CollapseItem title="效率 Efficiency">
                        简化流程：设计简洁直观的操作流程；<br/>
                        清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；<br/>
                        帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                    </CollapseItem>
                    <CollapseItem title="可控 Controllability">
                        用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；<br/>
                        结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
                    </CollapseItem>
                </Collapse>
                <h3>手风琴模式(效果待处理..)</h3>
                <Collapse accordion="true" active="0">
                    <CollapseItem title="一致性 Consistency">
                        与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；<br/>
                        在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
                    </CollapseItem>
                    <CollapseItem title="反馈 Feedback">
                        控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；<br/>
                        页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
                    </CollapseItem>
                    <CollapseItem title="效率 Efficiency">
                        简化流程：设计简洁直观的操作流程；<br/>
                        清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；<br/>
                        帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                    </CollapseItem>
                    <CollapseItem title="可控 Controllability">
                        用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；<br/>
                        结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
                    </CollapseItem>
                </Collapse>
            </Page>
        )
    }
}