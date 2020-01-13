import React, { Component } from 'react'
import { Table, Button, Input,Tooltip } from 'antd'
import { VGroup, HGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'

import TableCreate from './table-create'
import BussinessConnect from './business-connection'

const { Search } = Input;
const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

const ToolBar = ({showAddTableModal, searchDatasource, resetSearchCondition}) => (
  <HGroup height="60px" width="100%" horizontalAlign="space-between" verticalAlign="center" className="searchToolBar">
    <Button icon="plus-circle" type="primary" onClick={showAddTableModal}>新增</Button>
    <HGroup>
      <Search placeholder="请输入表名" onSearch={value => searchDatasource(value)} className="searchBox" />
      <Button onClick={resetSearchCondition} type="default" style={{marginLeft: '10px'}}>重置</Button>
    </HGroup>
  </HGroup>
)

@observer
class TableManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      record: '',
      name: '',
      datasource: [],
      y: '380px',
      pagination: { current: 1, pageSize: 10, total:0, showSizeChanger: true, showTotal: (total) => `共${total}条` }
    };

    this.tableManageColumns = [
      { title: '表名', dataIndex: 'tableComments', key: 'tableComments'},
      { title: '所属业务', key: 'typeValue',
        render: (text, record) => {
          let f = props.store.businessTypes.filter(v => v.value === record['typeValue']);
          return (f.length ? f[0]['name'] : '')
        }
      },
      { title: '表描述', dataIndex: 'tableDesc', key: 'tableDesc'},
      {
        title: '操作', key: 'action', width: 300, fixed: 'right',
        render: (text, record) => (
          <HGroup verticalAlign="center" gap="5px">
            <Button type="primary" onClick={ () => this.modifiedTable(record) } size="small">编辑</Button>
            {
              userInfo && userInfo.auth !== 0 ? null :
              <Tooltip placement="topLeft" title="将所建表与所属业务相关联">
                <Button type="primary" onClick={ () => this.showBusinessConnectModal(record) } style={{marginLeft: '10px'}}size="small">业务关联</Button>
              </Tooltip>
            }
          </HGroup>
        )
      }
    ];
  }

  showAddTableModal = () => {
    const { store } = this.props;
    store.setEditableInfos({});
    store.setEditedColumns([]);
    store.addTableModalChange(true);
  }

  modifiedTable = (record) => {
    const { store } = this.props;
    store.fetchTableInfos(record.id).then(res => {
      const { customTableVo, customColumnVos } = res;
      // 格式化 表格显示内容
      customColumnVos.forEach((v, idx) => {
        v.columnType = store.columnTypes.find(d => d.value === v.columnType)['name'];
        v.isSearch = v.isSearch === 1 ? '是' : '否';
        v.isShow = v.isShow === 1 ? '是' : '否';
        v.dontDelete = 1;
        v.isUpd = 0;
        v.key = idx;
      });

      store.setEditableInfos(customTableVo);
      store.setEditedColumns(customColumnVos);
      store.addTableModalChange(true);
    })
  }

  showBusinessConnectModal = (record) => {
    const { store } = this.props;
    this.setState({ record: {...toJS(record)} }, () => store.businessConnectModalChange(true))
  }
  getDataSource = () => {
    const { store } = this.props;
    let params = {
      page: this.state.pagination.current,
      size: this.state.pagination.pageSize,
      name: this.state.name
    }
    store.getTableManageDataSource(params).then(res => {
      let pageObject = { total: res.totalElements }
      this.setState({ pagination: {...this.state.pagination, ...pageObject}, datasource: res.content })
    })
  }

  componentDidMount() {
    const { store } = this.props;
    store.getBusinessConnect().then(res => this.getDataSource())
    let bodyH = document.body.clientHeight;
    this.setState({ y: bodyH - 380 })
  }

  pageChange = (object) => {
    this.setState({ pagination: {
      ...this.state.pagination,
      current: object.current,
      pageSize: object.pageSize
    }}, () => this.getDataSource())
  }

  searchDatasource = (value) => {
    this.setState({name: value}, () => this.getDataSource())
  }

  resetSearchCondition = () => {
    this.setState({ pagination: {
      ...this.state.pagination,
      page: 1,
      size: 10
    }, name: ''}, () => this.getDataSource())
  }

  render() {
    const { name, datasource, record, pagination, y } = this.state;
    return (
      <VGroup width="100%" style={{color:'#fff'}} >
        <ToolBar searchName={ name } showAddTableModal={ this.showAddTableModal } searchDatasource={ this.searchDatasource } resetSearchCondition={this.resetSearchCondition} />
        <Table scroll={{ y }} dataSource={ datasource } columns={ this.tableManageColumns } onChange={ this.pageChange } rowKey={ row => row.id } pagination={ pagination } />
        <BussinessConnect record={ record } store={ this.props.store }/>
        <TableCreate getDataSource={ this.getDataSource } store={ this.props.store } />
      </VGroup>
    )
  }
}

export default TableManage;
