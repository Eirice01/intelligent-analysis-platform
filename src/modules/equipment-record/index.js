import './index.less'
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import {HGroup,VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { Card } from 'antd'

import TreeCard from '@modules/tree'
import EquipmentRecordStore from './equipment.store'
import RelatedList from './views/related-list'
import RecordList from './views/record-list'
import BreadItemNav from '@components/breadItemNav'

const breadcrumb = [{key:"info",title:"信息录入"}, { key:'/equipment/record', title:'装备信息录入'}];
@observer
class EquipmentRecord extends Component{
  render() {
    return(
    <VGroup className="table-manage-contaienr" horizontalAlign='flex-start' height="100%" width="100%" padding="30px 80px">
      <BreadItemNav breadData={breadcrumb}/>
      <Card style={{width:'100%',marginTop: '10px'}} >
        <RecordList store={ EquipmentRecordStore } />
      </Card>
    </VGroup>
    )
  }
}

@observer
class EquipmentMaintain extends Component {
  state = { selectedKeys: [] }

  onSelect = (selectedKeys, nodeInfo) => {
    const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
    this.setState({ selectedKeys }, () => EquipmentRecordStore.setTreeNodeInfo(node))
  }

  render() {
    const { selectedKeys } = this.state;
    return(
      <HGroup className="equipment-record-container" width="100%" height="100%">
        <HGroup className="content-left" width="380px">
          <TreeCard selectedKeys={selectedKeys} onSelect={this.onSelect} />
        </HGroup>
        <VGroup className="content-right" flex>
          <RelatedList store={ EquipmentRecordStore } />
        </VGroup>
     </HGroup>
    )
  }
}

function EquipmentRoute() {
  return (
    <>
      <Switch>
        <Route path="/equipment" component={EquipmentMaintain} exact/>
        <Route path="/equipment/record" component={EquipmentRecord} exact/>
        <Redirect to='/equipment' />
      </Switch>
    </>
  )
}

export const EquipmentRecordRoute = <Route path="/equipment" component={EquipmentRoute}/>

