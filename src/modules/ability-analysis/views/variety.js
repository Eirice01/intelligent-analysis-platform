import React, { Component } from 'react'
import { HGroup,VGroup } from 'v-block.lite/layout'
import AbilityTitle from './ability-title'
import VarietyEcharts from "./variety-echarts"

class Variety extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <VGroup className="variety-container"  width="60%" height="100%">
                <AbilityTitle  title={this.props.title+'作战能力变化情况'} />
                <HGroup height="100%">
                    <div id="varietyScore" style={{width:'100%',height:"100%"}}>
                        <VarietyEcharts  domId={"varietyScore"} varietyEchartsData={this.props.varietyEchartsData}/>
                    </div>
                </HGroup>
            </VGroup>
        )
    }
}
export default Variety