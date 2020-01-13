import React, { Component } from 'react'
import { Switch } from 'react-router-dom'
import { HGroup } from 'v-block.lite/layout'

const LeftContent = () => (
  <HGroup className="sidebar" height="100%" width="400px"> </HGroup>
)

const RightContent = ({ routes }) => {
  return (
    <HGroup className="content" padding="5px 15px" flex>
    <Switch>
      { routes }
    </Switch>
  </HGroup>
  )
}

class Menu_Content_Frameset extends Component {

  render() {
    const  { routes } = this.props;
    return (
      <HGroup height="100%" width="100%" className="frameset-container" horizontalAlign="flex-start" padding="5px 15px" flex>
        <LeftContent />
        <RightContent routes={ routes } />
      </HGroup>
    )
  }
}

export default Menu_Content_Frameset
