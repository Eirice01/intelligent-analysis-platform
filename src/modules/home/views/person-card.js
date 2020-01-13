import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'

import { dashboardTitle } from '@modules/home'
import {Button} from 'antd';

@withRouter
@observer
class DashboardPersonnel extends Component {
  goPersonList = () => {
    const { military } = this.props.store;
    const {bdid} = military;
    this.props.history.push({ pathname: "/entryInfo/personInfo", state: { treeKey:bdid} })
  }
  render() {
    const { title, store } = this.props;
    return (
      <VGroup className="person-info" horizontalAlign="flex-start" verticalAlign="flex-start" flex>
        { dashboardTitle(title) }
        <PersonItem store={store} />
        <HGroup horizontalAlign="flex-end" width="100%" padding="0 10px 0 0">
          <Button type="primary" size="small" ghost onClick={this.goPersonList}>查看详情</Button>
        </HGroup>
      </VGroup>
    )
  }
}

@observer
class PersonItem extends Component {
  renderPerson = ({ name, rank, sex, birth, rwsjrok, pic },idx) => {
    const paddingLeft = {  paddingLeft: '10px' };
    return (
      <HGroup key={idx} className="content" horizontalAlign="flex-start" width="100%" padding="5px 0 0 10px">
        <HGroup className="imgBox">
          <img with="100%" height="100%" src={pic}/>
        </HGroup>
        <VGroup className="describe" verticalAlign="center" padding="0 0 0 20px">
          <HGroup><b>{name}</b><b style={paddingLeft}>{rank}</b></HGroup>
          <HGroup>{sex}<span style={paddingLeft}>{birth}</span></HGroup>
          <HGroup>入伍时间<span style={paddingLeft}>{rwsjrok}</span></HGroup>
        </VGroup>
      </HGroup>
    )
  }
  render() {
    let { personel } = this.props.store;
    return (
      <VGroup className="personItem-info" verticalAlign="flex-start" horizontalAlign="flex-start" width="100%" height="100%">
        {
          personel.map(((item,idx) => item ? this.renderPerson(item,idx) : null ))
        }
      </VGroup>
    )
  }
}
export default DashboardPersonnel;

