import React, { Component } from 'react'
import { HGroup,VGroup } from 'v-block.lite/layout'
import AbilityTitle from './ability-title'
import RatioEcharts from "./ratio-echarts"
class Ratio extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <VGroup className="ratio-container"  width="40%" height="100%">
                <AbilityTitle  title={this.props.title+'作战能力占比变化'}/>
                <HGroup height="100%">
                    <div id="ratioScore"  style={{width:'100%',height:"100%"}}>
                        <RatioEcharts  domId={"ratioScore"} ratioEchartsData={this.props.ratioEchartsData}/>
                    </div>
                </HGroup>
            </VGroup>
        )
    }
}
export default Ratio