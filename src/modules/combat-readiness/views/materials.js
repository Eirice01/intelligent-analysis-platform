import React, { Component } from 'react'
import {HGroup} from 'v-block.lite/layout'
import '../index.less'
import combatStore from "../combat.store";
import { observer } from 'mobx-react';
@observer
class SingleMaterial extends Component{
     constructor(props){
       super(props)
       this.state={
         cardInfo:props.info,
       }
     }
  jupList=()=>{
    combatStore.changeModals(true)
  }
  render(){
    return(
      <div className="masingle" onClick={this.jupList}>
        <span className="masingle-numer">{this.props.info.value}</span>
        <span className="masingle-title">{this.props.info.title}</span>
      </div>
    )

  }
}
@observer
 class Materials extends Component{
  constructor(props){
    super(props)
    this.state={

    }
  }
  renderCell=(data)=>{
    const {title,list}=data;
    const cells = [];
    for(let i = 0; i  < list.length; i++) {
      const item = list[i];
      cells.push(<SingleMaterial info={item} index={i} key={i}/>)
    }
    return (
      <div style={{height:"100%", padding:"5px 0px 0px 20px"}}   className="row-find-card">
        <HGroup className="cls-title">
          <span className="cls-row-title">{title}</span>
        </HGroup>
        <HGroup style={{width:"100%",height:"calc(100% - 40px)",marginTop:"5px"}}>
          { cells }
        </HGroup>
      </div>
    )

  }

  render(){
    const {ammunition}=combatStore.combatlist;
    return(
      <HGroup style={{height:"22%",margin:"10px 0px",width:"100%"}}>
        {ammunition&&this.renderCell(ammunition)}
      </HGroup>)
  }
}
export default Materials
