import React, { Component } from 'react'
import {VGroup } from 'v-block.lite/layout'
import {Modal,Tabs} from 'antd'
import '../index.less'
import { observer } from 'mobx-react';
import CombatModal from './combat-status-modal'
import CombatPerson from './combat-person-state'
import MaterialsStore from '../materials.store'

const {TabPane} = Tabs
@observer
class CombatStateModalInfo extends Component{
  constructor(props){
    super(props)
    this.state={
      modalhide:false,
      titleInfo:"总机构状态维护",
      keys:"1"

    }
  }

  OnCancel=()=>{
    MaterialsStore.changeCombatModal(false)
    MaterialsStore.reastInfo()
    MaterialsStore.initRestTable()
    this.combat.clearForm()
    this.setState({keys:"1"})
  }
  getCombatSelect=(key)=>{
    MaterialsStore.fetchSelect(key)
  }

  changeTabs=(key)=>{
   if(key==2){
     this.setState({keys:"2"})
     this.getCombatSelect("2-2")
     MaterialsStore.changeCombatStatus("1")
   }else {
     this.setState({keys:"1"})
   }
  }
  render(){
    return(
      <div>
        <Modal
          title='战备状态维护'
          visible={MaterialsStore.combatIsShow}
          onCancel={this.OnCancel}
          footer={null}
          width={1300}
          style={{top:100}}
        >
          <VGroup id="state-list">
            <Tabs activeKey={this.state.keys} onChange={this.changeTabs} >
              <TabPane key="1" tab="人员状态">
                <CombatPerson />
              </TabPane>
              <TabPane key="2" tab="装备状态" >
                <CombatModal  parKey={MaterialsStore.partKey} wrappedComponentRef={(form)=>this.combat=form}/>
              </TabPane>
            </Tabs>
          </VGroup>
        </Modal>
      </div>)
  }
}
export default CombatStateModalInfo
