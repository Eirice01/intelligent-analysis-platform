import React, { Component } from 'react'
import {HGroup,VGroup } from 'v-block.lite/layout'
import combatStore from '../combat.store'
import { observer } from 'mobx-react';
@observer
class CombatTool extends Component{
    constructor(props){
      super(props)
      this.state={
        toolData:[],
        setIdx:0,
        listData:[],
        setLidx:0,
        setids:""
      }
    }

   componentDidMount(){
      this.setState({toolData:combatStore.tolls},()=>{});
      this.setState({listData:combatStore.tolls[0].child},()=>{});
      let id=combatStore.tolls[0].child[0].key;
      let key1=combatStore.tolls[0].key;
      this.props.selectNodeId(key1,id);

   }
    selectPt=(key,child,select,index)=>{
      this.setState({setIdx:index});
      this.setState({listData:combatStore.tolls[index].child});
      let key1=combatStore.tolls[index].key;
      let id=combatStore.tolls[index].child[0].key;
      this.setState({setLidx:0});
      this.props.selectNodeId(key1,id);
    }
    selectList=(key,parentId,select,index)=>{
      this.setState({setLidx:index});
      this.props.selectNodeId(parentId,key);
    }

   render(){
     const tool=this.state.toolData;
     const toolpt=tool.map((item,index)=>{
       return(
         <div key={index} onClick={()=>{this.selectPt(item.key,item.child,item.select,index)}} className={index==this.state.setIdx?"toolselect":"toolunselect"}>{item.title}</div>
       )
     })
     const list=this.state.listData;
     const listInfo=list.map((itm,idx)=>{
       return(
         <div key={idx} onClick={()=>{this.selectList(itm.key,itm.parentId,itm.select,idx)}} className={idx==this.state.setLidx?"cls-info-td":"cls-info-td-un"}>{itm.title}</div>
       )
     })
    return(
      <VGroup id="combat-tool-info">
        <HGroup className="tool-pat">{toolpt}</HGroup>
        <HGroup className="tool-info-list">
          {list.length!==0&&listInfo}
        </HGroup>
      </VGroup>
    )
   }

}
export default CombatTool
