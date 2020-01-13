import React, { Component } from 'react'
import { HGroup } from 'v-block.lite/layout'
import { Route } from 'react-router-dom'

class ProgramDerive extends Component{
  render(){
    return(
      <HGroup horizontalAlign="center" verticalAlign="center" style={{fontSize:"16px"}}>
          正在建设中......
      </HGroup>
    )
  }
}
export default ProgramDerive
export const ProgramDeriveRoute = <Route path="/programDerive" component={ProgramDerive} exact />;