import React, {Component} from 'react'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'

class SlidesContainer extends Component {

  render() {
    const options = this.props.options;
    return (
      <Swiper { ...options }>
        { this.props.children }
      </Swiper>
    )
  }
}
export default SlidesContainer;
