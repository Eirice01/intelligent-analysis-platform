import '../index.less'
import React, { Component } from 'react'
import { HGroup } from 'v-block.lite/layout'
import { Button, Table, message, Popconfirm } from 'antd'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
// const downloadTemplate = () => {
//   let a = document.createElement('a');
//   a.href =  `api/equipment/downModelExcel`;
//   a.download = '';
//   a.click();
// }

// const rowSelection = {
//   fixed: true,
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   getCheckboxProps: record => ({ name: record.name }),
// };

import AddEquipmentRecord from './record-modal'

const success = (content) => message.success(content);

function ToolBar({ data, clickItemInfo }) {
  return (
    data.map((item,index) => <Button key={index} type="primary" icon="plus-circle" onClick={ () => clickItemInfo(item) } style={{margin:"0px 5px"}}>{item}</Button>)
  )
}

@observer
class RecordList extends Component{
  constructor(props) {
    super(props)

    this.state = {
      pagination: { current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (total) => `共${total}条` },
      sourceData: [],
      columns: [],
      loading: false,
      tools: ["添加"]
    };

    this.actionColumn = [
      {
        title: '操作', key: 'action', width: 300, fixed: 'right',
        render: (text, record) => (
          <HGroup verticalAlign="center" gap="5px">
            <Button type="primary" onClick={ () => this.detailRow(record) } size="small">查看</Button>
            <Button type="primary" onClick={ () => this.editRow(record) } size="small">编辑</Button>
            <Popconfirm title="是否删除？" cancelText="取消" okText="确定" onConfirm={() => this.deleteRow(record)}>
              <Button type="danger" size="small"  style={{marginRight: '10px'}} >删除</Button>
            </Popconfirm>
          </HGroup>
        )
      }
    ];
  }
  clickItemInfo = (item) => {
    switch(item) {
      case '添加': return this.handleAddRecord();
      // case '批量删除': return console.log('123');
      // case '模板下载': return downloadTemplate();
      // case '批量导入': return console.log('123');
      default: return;
    }
  }
  handlePageChange = (pagination) => {
    this.setState({ pagination: {...this.state.pagination, current: pagination.current}});
  }
  handleAddRecord = () => {
    const { store } = this.props;
    store.setEquipRecordForm({zbzplqf:[], zyzbdl6: [], tyzbpi5: []});
    store.equipmentRecordModalChange(true)
  }
  fetchDataSource = () => {
    const { store } = this.props;
    const { key } = store.treeNodeInfo;
    let params = {
      page: this.state.pagination.current,
      size: this.state.pagination.pageSize,
      bumen_id: key || ''
    }
    store.fetchEquipmentList(params).then(res => {
      const { columns, sourceData, total } = res;
      this.setState({
        columns: [...columns, ...this.actionColumn],
        sourceData,
        pagination: {...this.state.pagination, total}
      })
    })
  }
  detailRow = (record) => {
    const { store } = this.props;
    store.fetchEquipmentById({id: record.id}).then(res => {
      res.mark = 2;
      store.setEquipRecordForm(res);
      store.equipmentRecordModalChange(true)
    })
  }
  editRow = (record) => {
    const { store } = this.props;
    store.fetchEquipmentById({id: record.id}).then(res => {
      res.mark = 1;
      store.getDictions(res.zblxdlm60);
      store.setEquipRecordForm(res);
      store.equipmentRecordModalChange(true)
    })
  }
  deleteRow = (record) => {
    const { store } = this.props;
    store.deleteEquipment({id: record.id}).then(res => {
      success("删除成功")
      this.fetchDataSource();
    })
  }
  componentDidMount() {
    const { store } = this.props;
    this.fetchDataSource()

    store.getDictions('2-2');
    store.getDictions('131-6');
    store.fetchCustomEquipColumns();
    store.fetchTongyongColumn();
    store.fetchZhuanyeColumn();
    this.recordReaction = reaction(() => [store.treeNodeInfo.troopsnum], (arr) => this.fetchDataSource())
  }

  componentWillUnmount(){
    this.recordReaction();
  }

  render(){
    const { columns, sourceData, pagination, loading, tools } = this.state;
    return(
      <>
        <HGroup className="content-right-tools" padding="20px 0 20px 0">
          <ToolBar data={tools} clickItemInfo={this.clickItemInfo} />
        </HGroup>
        <HGroup className="content-right-table" width="100%">
          <Table
            columns={ columns }
            dataSource={ sourceData }
            pagination={ pagination }
            loading={ loading }
            onChange={ this.handlePageChange }
            rowKey={ row => row.id }
            style={{width:"100%"}}
          />
        </HGroup>
        <AddEquipmentRecord fetchDataSource={this.fetchDataSource} store={ this.props.store } />
      </>
    )
  }

}

export default RecordList;

