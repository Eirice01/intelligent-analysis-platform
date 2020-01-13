import './index.less'
import { Route } from 'react-router-dom'
import React, { Component } from 'react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'

import TreeCard from '@modules/tree'
import BasicInfoStore from './basic-info.store'
import MilitarySummary from './views/summary-card'
import HistorySlides from './views/history-slide'
import Person_Equipment from './views/person-equipment'

@observer
class BasicInfo extends Component {
  state = { selectedKeys: [], personInfoTitle:'', equipmentInfoTitle:'' }

  onSelect = (selectedKeys, nodeInfo) => {
    const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
    this.setState({ selectedKeys }, () => BasicInfoStore.setTreeNodeInfo(node))
  }

  componentDidMount() {
    reaction(() => [BasicInfoStore.treeNodeInfo], arr => {
      let bdid = arr[0]['key'];
      BasicInfoStore.fetchRyAndZbCountById({bdid}).then(res => {
        let personInfoTitle = `${res[0]['name']}(${res[0]['value']})`, equipmentInfoTitle = `${res[1]['name']}(${res[1]['value']})`;
        this.setState({personInfoTitle, equipmentInfoTitle});
      })
      BasicInfoStore.getMilitaryDetail({bdid})
      this.personEquipment && this.personEquipment.resetSearchContent()
    })
  }

  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }
  render() {
    const { selectedKeys, personInfoTitle, equipmentInfoTitle } = this.state;
    return (
      <>
        <HGroup className="sidebar" height="100%" width="380px">
          <TreeCard selectedKeys={selectedKeys} onSelect={this.onSelect}/>
        </HGroup>
        <VGroup verticalAlign="flex-start" horizontalAlign="flex-start" padding="5px 15px" flex>
          <MilitarySummary store={BasicInfoStore} />
          <HistorySlides title="历史沿革" store={BasicInfoStore} />
          <Person_Equipment ref={ (personEquipment) => {this.personEquipment = personEquipment} } title="人员与装备信息" personInfoTitle={personInfoTitle} equipmentInfoTitle={equipmentInfoTitle} store={BasicInfoStore} flex/>
        </VGroup>
      </>
    )
  }
}

export default BasicInfo;

export const BasicInfoRoute = <Route path="/basic-info" component={BasicInfo} exact />;



