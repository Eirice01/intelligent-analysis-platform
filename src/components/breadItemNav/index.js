import './index.less'
import React, { Component } from 'react'
import {Breadcrumb} from 'antd';

class BreadCrumbNav extends Component{
  render(){
    const {breadData} = this.props;
    return (
    <Breadcrumb separator=">">
      {
        breadData.map(item => <Breadcrumb.Item key={item.key}>{item.title}</Breadcrumb.Item>)
      }        
    </Breadcrumb>
    )
  }
}
export default BreadCrumbNav
