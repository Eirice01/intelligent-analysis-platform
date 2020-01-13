import './index.less'

import { Route } from 'react-router-dom'
import React, { Component } from 'react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'

import dashboardStore from './home.store'
import Map_Box from '@components/map'
import Summary_Card from './views/summary-card'
import Person_Card from './views/person-card'
import Pie_Group_Card from './views/pie-group-card'
import Training_Card from './views//training-card'
import Radar_Card from './views/radar-card'

export const dashboardTitle = (title,width="100%") => {
  return (
    <HGroup className="dashboardTitle" verticalAlign="center" horizontalAlign="flex-start" width={width}>
      <h3>{ title }</h3>
    </HGroup>
  )
}

@observer
class DashboardInfo extends Component {
  state = { defaultTroopSetting: null, stations: { "type":"FeatureCollection", "features": [] }, title: '', activeMark: '', coordinates: [] }
  mapClickFuc = (_e, e) => console.log('e', e)

  markerClickFuc = (target) => {
    const { properties } = target;
    dashboardStore.setMarkerInfo(properties)
  }
  // properties里面 id是部队id(树的key)，name是部队名称，troopsnum 是部队编号
  initHomeRequest = (data, coordinates) => {
    const { name, troopsnum, id} = data;
    dashboardStore.fetchTroopsinfo({bdid: id});
    dashboardStore.fetchRyxxByMaxJz({id, count: 2});
    dashboardStore.fetchEquipStatus({id});
    dashboardStore.fetchTrainInfo(troopsnum);
    dashboardStore.fetchCapabilityAnalysis(troopsnum);
    if(coordinates) {
      this.setState({ title: `${name}信息`, activeMark: name, coordinates })
    }else {
      this.setState({ title: `${name}信息`, activeMark: name })
    }
  }

  componentDidMount() {
    dashboardStore.fetchTroopsinfoForMap().then(res => this.setState({ stations: res}))
    dashboardStore.fetchInitTroop().then(data => {
      const initInfo = data[0];
      const id = initInfo['bmid8in']; // 部队ID
      const troopsnum = initInfo['bmbh9pg']; // 部队编号
      const name = initInfo['bmmcim6'];
      const coordinates = initInfo['coordinates'] || window.__private_URL.mapCenter;
      this.initHomeRequest({id, troopsnum, name}, coordinates)
    })
    this.homeReaction = reaction(() => [dashboardStore.markerInfo], (arr, reaction) => this.initHomeRequest(arr[0]))
  }
  componentWillUnmount(){
    this.homeReaction();
  }
  render() {
    const { stations, title, activeMark, coordinates } = this.state;
    return (
      <>
        <HGroup verticalAlign="stretch" horizontalAlign="center" height="100%" width="100%" flex>
          <Map_Box stations={stations} activeMark={activeMark} coordinates={coordinates} mapClickFuc={ this.mapClickFuc } markerClickFuc={this.markerClickFuc} flex/>
        </HGroup>
        <VGroup className="dashboard-left" horizontalAlign="center" width="20%">
          <HGroup verticalAlign="stretch" horizontalAlign="flex-start" width="100%" padding="0 0 10px 0" flex>
            <Summary_Card title={title} store={ dashboardStore } />
          </HGroup>
          <HGroup verticalAlign="stretch" horizontalAlign="flex-start" width="100%" height="240px">
            <Person_Card title="人员信息" store={ dashboardStore } />
          </HGroup>
        </VGroup>
        <VGroup className="dashboard-right" horizontalAlign="center" width="20%">
          <HGroup verticalAlign="stretch" horizontalAlign="flex-start" width="100%" height="60%" padding="0 0 10px 0">
            <Pie_Group_Card title="战备状态" store={ dashboardStore } />
          </HGroup>
          <HGroup verticalAlign="stretch" horizontalAlign="flex-start" width="100%" height="20%" padding="0 0 10px 0">
            <Training_Card title="训练信息" store={ dashboardStore } />
          </HGroup>
          <HGroup verticalAlign="stretch" horizontalAlign="flex-start" width="100%" height="40%" >
            <Radar_Card title="能力分析" store={ dashboardStore } />
          </HGroup>
        </VGroup>
      </>
    )
  }
}

export default DashboardInfo;
export const HomeRoute = <Route path="/" component={DashboardInfo} exact />;
