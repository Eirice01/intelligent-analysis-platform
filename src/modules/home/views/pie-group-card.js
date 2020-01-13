import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { Button } from 'antd'

import { dashboardTitle } from '@modules/home'
import SingleConversionRateChart from '@components/chart/singleConversionRate'
import BasicPicRate from '@components/chart/pie-rate'

@withRouter
@observer
class DashboardCombatReadiness extends Component {
  goCombatList = () => {
    const { military } = this.props.store;
    const {bdid,title} = military;
    this.props.history.push({ pathname: "/combat", query: {Tid: bdid, tName: title || ''}})
  }
  render() {
    const { store, title } = this.props;
    return (
      <VGroup className="combat-dashboard-info" horizontalAlign="flex-start" height="100%" verticalAlign="space-between" flex>
        { dashboardTitle(title) }
        <PersonFiveRate store={store} />
        <DeviceFiveRate store={store} />
        <HGroup horizontalAlign="flex-end" width="100%" padding="20px 10px 0 0">
          <Button type="primary" size="small" ghost onClick={this.goCombatList}>查看详情</Button>
        </HGroup>
      </VGroup>
    )
  }
}

const radius = [17, 22];

@observer
class PersonFiveRate extends Component {
  render() {
    const { rateDatas, reignRate, competentRate} = this.props.store;
    return (
      <HGroup className="personFiveRate" horizontalAlign="flex-start" width="100%" height="50%" padding="5px 0 5px 10px">
        <VGroup width="60%" height="100%" flex>
          <HGroup className="title" padding="0 0 10px 0">人员状态</HGroup>
          <HGroup padding="0 0 5px 0" horizontalAlign="space-around" flex>
            {
              rateDatas.map(item => <SingleConversionRateChart key={item.name} showTitle="true" height="100%" width="28%" data={item} />)
            }
          </HGroup>
        </VGroup>
        <VGroup className="competent-Rate" style={{position: 'relative'}} verticalAlign="flex-start" width="20%" height="91%">
          {
            reignRate.map((item,idx) => <BasicPicRate key={idx}
            height={(idx === 1 ? "70%" : "60%" )} radius={radius}
            showTitle={ (idx === 1 ? "true" : "false") } width="100%" data={item} showToolTip={ true } toolTipName={ item.label } />)
          }
        </VGroup>
        <VGroup className="competent-Rate" style={{position: 'relative'}} verticalAlign="flex-start" width="20%" height="91%" padding="0 0 0 10px">
          {
            competentRate.map((item,idx) => <BasicPicRate key={idx}
            height={(idx === 1 ? "70%" : "60%" )} radius={radius}
            showTitle={ (idx === 1 ? "true" : "false") } width="100%" data={item} showToolTip={ true } toolTipName={ item.label } />)
          }
        </VGroup>
      </HGroup>
    )
  }
}

@observer
class DeviceFiveRate extends Component {
  render() {
    const { equipRateDatas, supportingRate, equipmentDesc, complianceRareData } = this.props.store;

    return (
      <HGroup className="deviceFiveRate" horizontalAlign="flex-start" width="100%" height="50%" padding="5px 0 5px 10px">
        <VGroup width="60%" height="100%" flex>
          <HGroup className="title" padding="0 0 10px 0">装备状态 {equipmentDesc ? `(${equipmentDesc})` : null}</HGroup>
          <HGroup width="100%" horizontalAlign="space-around" flex>
            {
              equipRateDatas.map(item => <SingleConversionRateChart key={item.name} showTitle="true" height="100%" width="28%" data={item} />)
            }
          </HGroup>
        </VGroup>
        <VGroup className="competent-Rate" style={{position: 'relative'}} verticalAlign="flex-start" width="20%" height="95%">
          {
            supportingRate.map((item,idx) => <BasicPicRate key={idx}
            height={(idx === 1 ? "75%" : "60%" )} radius={radius}
            showTitle={ (idx === 1 ? "true" : "false") } width="100%" data={item} showToolTip={ true } toolTipName={ item.label } />)
          }
        </VGroup>
        <VGroup className="competent-Rate" style={{position: 'relative'}} verticalAlign="flex-start" width="20%" height="95%" padding="0 0 0 10px">
          {
            complianceRareData.map((item,idx) => <BasicPicRate key={idx}
            height={(idx === 1 ? "70%" : "60%" )} radius={radius}
            showTitle={ (idx === 1 ? "true" : "false") } width="100%" data={item} showToolTip={ true } toolTipName={ item.label } />)
          }
        </VGroup>
      </HGroup>
    )
  }
}
export default DashboardCombatReadiness;

