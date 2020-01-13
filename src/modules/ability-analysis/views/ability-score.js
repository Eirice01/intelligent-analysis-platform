import React, { Component } from 'react'
import { HGroup,VGroup } from 'v-block.lite/layout'
import AbilityTitle from './ability-title'
import ScoreEcharts from "./score-echarts"
class AbilityScore extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <VGroup className="score-container"  width="100%" >
                <AbilityTitle title="各单位作战能力总分值" />
                <HGroup>
                    <div id="abilityScore" className="all-ability" style={{width:'100%'}}>
                        <ScoreEcharts  domId={"abilityScore"} scoreEchartsData={this.props.scoreEchartsData} scoreClick={this.props.onClick}/>
                    </div>
                </HGroup>
            </VGroup>
        )
    }
}
export default AbilityScore