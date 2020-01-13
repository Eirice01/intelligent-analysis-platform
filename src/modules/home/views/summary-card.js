import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { Button, Tag } from 'antd'

import { dashboardTitle } from '@modules/home'
import SlidesContainer from '@components/slides'

@withRouter
@observer
class DashboardMilitary extends Component {
  goTroopList = () => {
    const { military } = this.props.store;
    const {bdid} = military;
    this.props.history.push({ pathname: "/entryInfo/troops/information", query: {Tid: bdid, from: '/'}})
  }
  render() {
    let { store, title } = this.props;
    return (
      <VGroup className="military-info" verticalAlign="space-between" horizontalAlign="flex-start" flex>
        { dashboardTitle(title) }
        <Introduce store={store} />
        <HistoryInfo store={store} />
        <VGroup verticalAlign="space-around" horizontalAlign="flex-start" width="100%" flex>
          <MissionTask store={store} />
          <ForceFeatures store={store} />
          <GeolocationInfo store={store} />
          <HGroup horizontalAlign="flex-end" width="100%" padding="0 10px 0 0">
            <Button type="primary" size="small" ghost onClick={this.goTroopList}>查看详情</Button>
          </HGroup>
        </VGroup>
      </VGroup>
    )
  }
}

@observer
class Introduce extends Component{
  render() {
    let { store } = this.props;
    const { title, pic, desc } = store.military;
    return (
      <VGroup className="military-introduce" verticalAlign="flex-start" horizontalAlign="flex-start" width="100%">
        <HGroup className="title" padding="0 0 10px 0">{title}介绍</HGroup>
        <HGroup className="content" horizontalAlign="flex-start" width="100%">
          <img src={pic} width="100%" height="100%" alt="图片"/>
          <div className="describe" width="100%" style={{flex: 1}}>{desc}</div>
        </HGroup>
      </VGroup>
    )
  }
}

const options = {
  slidesPerView: 3,
  spaceBetween: 30,
  slidesPerGroup: 3,
  loop: true,
  loopFillGroupWithBlank: true,
  shouldSwiperUpdate: true,
  rebuildOnUpdate: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
}
@observer
class HistoryInfo extends Component{
  render() {
    const { historyPic } = this.props.store.military;
    return (
      <VGroup className="history-info" verticalAlign="flex-start" horizontalAlign="flex-start" width="100%">
        <HGroup className="title" padding="0 0 10px 0">历史沿革</HGroup>
        <HGroup className="content" horizontalAlign="flex-start" verticalAlign="center" width="100%" flex>
        {
          historyPic && historyPic.length ?
          <SlidesContainer options={ options }>
           {
            historyPic.map(image => (
              <HGroup key={image.pic} className="slide" verticalAlign="center" horizontalAlign="center" height='105px' width='120px'>
                <img height="100%" src={image.pic} />
              </HGroup>
              ))
           }
          </SlidesContainer> : null
        }
        </HGroup>
      </VGroup>
    )
  }
}

@observer
class MissionTask extends Component{
  render() {
    const { store } = this.props;
    const military = store.military;
    return (
      <VGroup className="mission-task" verticalAlign="flex-start" horizontalAlign="flex-start" width="100%">
        <HGroup className="title" padding="0 0 10px 0">使命任务</HGroup>
        <div className="content" style={{flex: 1}} width="100%">{military.missionTask}</div>
      </VGroup>
    )
  }
}

const tagStyle = { background: 'rgb(4, 152, 127)', borderStyle: 'dashed', borderColor: 'rgb(4, 152, 127)', color: 'rgb(255, 255, 255)'};
@observer
class ForceFeatures extends Component{
  renderTag = (tags) => tags && tags.map(name => <Tag key={name} style={tagStyle}>{name}</Tag>)
  render() {
    const { store } = this.props;
    const military = store.military;
    console.log('troopFeature', military.troopFeature)
    return (
      <VGroup className="force-features" verticalAlign="flex-start" horizontalAlign="flex-start" width="100%">
        <HGroup className="title" padding="0 0 10px 0">部队特色</HGroup>
        <HGroup className="content" horizontalAlign="flex-start" width="100%">
        { this.renderTag(military.troopFeature) }
        </HGroup>
      </VGroup>
    )
  }
}

@observer
class GeolocationInfo extends Component{
  render() {
    const { store } = this.props;
    const military = store.military;
    return (
      <VGroup className="geolocation-info" verticalAlign="flex-start" horizontalAlign="flex-start" width="100%">
        <HGroup className="title" padding="0 0 10px 0">地理位置</HGroup>
        <HGroup className="content" horizontalAlign="flex-start" width="100%">
          {military.geolocationInfo}
        </HGroup>
    </VGroup>
    )
  }
}

export default DashboardMilitary;
