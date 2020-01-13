import './index.less'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { Card } from 'antd'

import ManagementStore from './manage.store'
import BreadItemNav from '@components/breadItemNav'
import TableManage from './views/table'

const breadcrumb = [{key:'system', title:"系统设置"},{key:"table-manage",title:"表管理"}];
@observer
class TableManagementInfo extends Component {
  componentDidMount() {
    ManagementStore.getDictions('2-1')
    ManagementStore.getDictions('8-1')
    // ManagementStore.getBusinessConnect()
    ManagementStore.fetchDictionTrees()
  }

  render() {
    return (
      <VGroup className="table-manage-contaienr" horizontalAlign='flex-start' height="100%" width="100%" padding="30px 80px">
        <BreadItemNav breadData={breadcrumb}/>
        <Card style={{width:'100%', marginTop: '10px'}}>
          <TableManage store={ManagementStore} />
        </Card>
      </VGroup>
    )
  }
}

export default TableManagementInfo;

export const TableManagementInfoRoute = <Route path="/table-manage" component={TableManagementInfo} exact />;



