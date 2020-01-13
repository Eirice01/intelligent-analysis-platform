import React, { Component } from 'react'
import { HGroup } from 'v-block.lite/layout'

class AbilityTitle extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const {title} = this.props;
        return(
            <HGroup className="title-container">
               <span className="title-left"></span><span style={{color:'#01e8cd'}}>{title}</span>
            </HGroup>
        )
    }
}
export default AbilityTitle