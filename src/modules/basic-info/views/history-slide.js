import React, { Component } from 'react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'

import { dashboardTitle } from '@modules/home'
import SlidesContainer from '@components/slides'
const isBigScreen = window.screen.width > 1920 ? true : false;

const options = {
  slidesPerView: isBigScreen ? 6 : 4,
  spaceBetween: 30,
  slidesPerGroup: isBigScreen ? 6 : 4,
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
class HistorySlides extends Component {
  render() {
    const { store, title } = this.props;
    const { historyPic } = store.military;
    return (
      <VGroup className="history-info-container" width="100%" height="260px">
        { dashboardTitle(title) }
        <HGroup className="history-info-content" horizontalAlign="flex-start" verticalAlign="center" width="100%" height="100%">
        {
          historyPic && historyPic.length ?
          <SlidesContainer options={ options }>
            {
              historyPic.map(item => (
              <VGroup className="history-slide" verticalAlign="center" horizontalAlign="center" key={item.desc} width="350px" height="220px">
                <HGroup className="history-slide-image-title" horizontalAlign="center" style={{color: '#1890ff'}}>{item.desc}</HGroup>
                <HGroup className="history-slide-image" verticalAlign="center" horizontalAlign="center" width="100%">
                  <img src={item.pic} height="100%" alt="图片"/>
                </HGroup>
              </VGroup>))
            }
          </SlidesContainer> : null
        }
        </HGroup>
      </VGroup>
    )
  }
}
export default HistorySlides;

