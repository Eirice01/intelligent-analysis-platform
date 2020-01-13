import React, { Component } from 'react'
import {HGroup,VGroup } from 'v-block.lite/layout'
import { Route } from 'react-router-dom'
import './index.less'
import { observer } from 'mobx-react';
import PersonState from './views/personnel-state'
import DeviceSatae from './views/device-state'
import Materials from './views/materials'
import TreeCard from '@modules/tree'
import CombatTool from './views/combat-tools'
import MaterTableModal from './views/mater-modal-table'
import combatStore from './combat.store'

@observer
class CombatReadinessModal extends Component{
    constructor(props){
      super(props)
      this.state={
        combatSetData:{},
        selectedKeys: [],
        tables1:[],
        columns1:[],
        loading:false,
        pagination: {
          total:"",
          pageSize:10,
          current:1,
        },
      }
    }


   async getCombatTool(id){
      await combatStore.fetchTollData(id)
   }
  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }
  onSelect =async (selectedKeys, nodeInfo) => {
    if(this.props.history.location.query){
      let ids=this.props.history.location.query.Tid;
      let name=this.props.history.location.query.tName
      combatStore.getCombatKey(ids)
      this.setState({selectedKeys:[ids]})
      await  combatStore.getTreeTitle(name)
      await this.getCombatTool(ids)
      await combatStore.fetchCombatList(ids)
      let data={
        current:1,
        pageSize:10,
        id:ids
      }
      await this.getTable(data)
    } else {
      const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
      combatStore.getCombatKey(node.key)
      this.setState({ selectedKeys})
      await  combatStore.getTreeTitle(node.title)
      await this.getCombatTool(node.key)
      await combatStore.fetchCombatList(node.key)
      let data={
        current:1,
        pageSize:10,
        id:node.key
      }
      await this.getTable(data)
    }
  }
   //选中的类型id
   selectNodeId=async(id1,id2)=>{
      let data={
        id:combatStore.combatKeys,
        bgkey:id1,
        smkey:id2
      }
   await combatStore.fetchCombatStatusListMore(data)
   }

   async getTable(datas){
     await  combatStore.fetchMaterialsTableData(datas)
     let data = combatStore.materialsTableData;
     await this.setState({column1:data.columns})
     await this.setState({pagination:{total:data.total,pageSize:data.pageSize}})
     await this.setState({ tables1: data.sourceData, loading: false });
   }


    render(){
     const {person,ammunition}=combatStore.combatlist;
     const { equipment } = combatStore.combatNew;
      const { selectedKeys } = this.state;
      return(
        <HGroup style={{width:"100%"}} className="combat-content">
          <VGroup className="combat-left">

           <TreeCard selectedKeys={selectedKeys}  onSelect={this.onSelect}/>
          </VGroup>
          <VGroup className="combat-right">
            <HGroup style={{padding:"20px 0px",margin:"15px 0px 20px 0px"}} id="comabt-info-title-list">
               <li className="cls-combat-list">
                 <span className="combat-info-icon"></span>
                 <span className="combat-infos">
                {combatStore.combatTreeTitle+'战备状态'}
                </span>
               </li>
            </HGroup>
            <div className="combat-echarts-content">
               <PersonState  personinfo={person}/>
              <HGroup className="cls-title">
                <span className="cls-row-title">装备状态</span>
              </HGroup>
              <HGroup className="cls-title-tools">
                {combatStore.tolls.length!==0?<CombatTool selectNodeId={this.selectNodeId}></CombatTool>:""}
               </HGroup>
               <DeviceSatae  equipment={equipment}/>
               <Materials ammunition={ammunition}/>
               <MaterTableModal  column1={this.state.column1} pagination={this.state.pagination} tables1={this.state.tables1} loading={this.state.loading}/>
            </div>
          </VGroup>
        </HGroup>
      )
    }
}
export default CombatReadinessModal

export const CombatRoute = <Route path="/combat"  component={CombatReadinessModal} exact />
