import './index.less'
import React,{ Component } from 'react'
import {Link, withRouter} from 'react-router-dom';
import {Menu, Icon} from 'antd';
import { HGroup } from 'v-block.lite/layout'

import HeaderUser from './user'
import SystemIcon from '@images/logo.png'

import { menus, settingMenu} from './menu-conf'

@withRouter
class CustomMenu extends Component {
  state = { current: '/', user: { name: JSON.parse(sessionStorage.getItem("userInfo")).userName} };
  handleClick = (e) => {
    this.setState({current: e.key})
  }
  renderSubMenu = ({key, icon, title, subs}) => {
      return (
          <Menu.SubMenu
            key={key}
            className="menu-title"
            title={<span>{icon && <Icon type={icon}/>}<span>{title}</span></span>}>
              {
                  subs && subs.map(item => {
                      return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
                  })
              }
          </Menu.SubMenu>
      )
  }
  renderMenuItem = ({key, icon, title}) => {
      return (
          <Menu.Item key={key} className="menu-title">
              <Link to={key}>
                  {icon && <Icon type={icon} style={{ fontSize: '16px', color: '#08c' }}/>}
                  <span>{title}</span>
              </Link>
          </Menu.Item>
      )
  }

  headerLogout = (params) => {
    sessionStorage.setItem('userInfo', false);
    this.props.isUserLogin(params)
  }

  render() {
    return (
      <HGroup className="header-container" verticalAlign="center" width="100%" horizontalAlign="flex-start" height="90px" padding="0 0 10px 0">
        <HGroup className="title" padding="0 0 0 40px" width="417px">
          <img src={ SystemIcon } style={{width:"60px",height:"50px"}}/>陆军特种部队大数据智能分析平台
        </HGroup>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.props.location.pathname]}
          mode="horizontal"
          style={{background: 'transparent', lineHeight: '94px', borderBottom: 'none'}}
        >
          {
            menus.map(item => {
                return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
            })
          }
        </Menu>
        <HeaderUser settingMenu={ settingMenu } user={ this.state.user } onChange = {this.headerLogout} />
      </HGroup>
      )
  }
}
export default CustomMenu
