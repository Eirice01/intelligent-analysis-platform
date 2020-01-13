import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { HGroup,VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { Button, Icon } from 'antd'

import { dashboardTitle } from '@modules/home'

@withRouter
@observer
class DashboardTraining extends Component {
  trainingDetail = () => {
    const { military, trainingInfo } = this.props.store;
    const { id } = trainingInfo;
    const {bdid, bdbh} = military;
    this.props.history.push({
      pathname:"/entryInfo/trainingInfo/trainDetail",
      state:{ treeKey:bdid, editable:false, bdbh, id}
    })
  }
  render() {
    const { title, store } = this.props;
    const { info } = store.trainingInfo;
    return (
      <VGroup className="train-info" horizontalAlign="flex-start" verticalAlign="flex-start" width="100%">
        { dashboardTitle(title) }
        <VGroup verticalAlign="space-between" width="100%">
          {
            info && info.map(item => <TrainingDetail key={item.field} data={item}/>)
          }
        </VGroup>
        <HGroup horizontalAlign="flex-end" width="100%" padding="5px 10px 0 0">
          <Button type="primary" size="small" ghost onClick={this.trainingDetail}>查看详情</Button>
        </HGroup>
      </VGroup>
    )
  }
}

@observer
class TrainingDetail extends Component {
  render() {
    let {field, desc } = this.props.data;
    let icon = field === "训练科目" ? "appstore" : field === "训练时间" ? "calendar" : "radar-chart";
    return (
      <>
        <HGroup className="trainingDetail" horizontalAlign="flex-start" width="100%" padding="4px 10px 0 20px">
          <Icon type={ icon } style={{ fontSize: '16px', color: '#08c', verticalAlign: 'text-bottom',lineHeight: '25px' }}/>
          <span>{ field }：</span>
          <span>{ desc }</span>
        </HGroup>
      </>
    )
  }
}
export default DashboardTraining;

