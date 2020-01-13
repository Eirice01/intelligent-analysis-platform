import React,{ Component} from 'react'
import {HGroup} from 'v-block.lite/layout'
import {Cascader} from 'antd'
class TimeCascader extends Component{
   constructor(props){
       super(props)
   }
    render(){
        return(
            <HGroup>
                <Cascader displayRender={this.props.displayRender} options={this.props.options} onChange={this.props.cascaderChange} changeOnSelect />
            </HGroup>
        )
    }
}
export default TimeCascader