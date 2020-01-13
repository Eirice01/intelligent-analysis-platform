import React, { Component } from 'react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { Button, Icon } from 'antd'
import { withRouter } from 'react-router-dom'

@withRouter
@observer
class MilitarySummary extends Component {
  trainingDetail = () => {
    const { military } = this.props.store;
    const {bdid} = military;
    this.props.history.push({ pathname: "/entryInfo/troops/information", query: {Tid: bdid, from:'/basic-info'}})
  }
  render() {
    const { store } = this.props;
    const { pic, title, desc, geolocationInfo, troopFeature } = store.military;
    const iconStyle = { fontSize: '16px', color: '#08c', verticalAlign: 'text-bottom',lineHeight: '25px',paddingRight: '10px' };
    return (
      <VGroup className="military-summary-info" verticalAlign="flex-start" horizontalAlign="flex-start" width="100%" height="170px">
        <HGroup horizontalAlign="flex-end" width="100%" padding="0 10px 0 0">
          <Button type="primary" size="small" ghost onClick={this.trainingDetail}>查看详情</Button>
        </HGroup>
        <HGroup className="content" horizontalAlign="flex-start" width="100%" padding="5px 0 0 0" flex>
          <HGroup className="imgBox">
            <img with="100%" height="100%" src={pic} alt="部队照片"/>
          </HGroup>
          <VGroup className="describe" verticalAlign="space-around" padding="0 0 0 20px" flex>
            <HGroup>
              <h3>{title}</h3>
              <HGroup verticalAlign="flex-start" horizontalAlign="flex-start" padding="0 20px">
              {
                // troopFeature && troopFeature.map(tag => <Tag key={tag} style={{ background: 'transparent', borderStyle: 'dashed', color: '#1890ff' }}>{tag}</Tag>)
                troopFeature && troopFeature.map(tag => <span key={tag} style={{color: '#1890ff',paddingRight: '5px', lineHeight: '26px'}}>{tag}</span>)
              }
              </HGroup>
            </HGroup>
            <p className="describe-content">{desc}</p>
            <HGroup className="position"><Icon type="bank" style={ iconStyle }/> { geolocationInfo }</HGroup>
          </VGroup>
        </HGroup>
      </VGroup>
    )
  }
}
export default MilitarySummary;

