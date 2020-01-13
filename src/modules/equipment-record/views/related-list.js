import '../index.less'
import React, { Component } from 'react'
import { HGroup } from 'v-block.lite/layout'
import { Button, Table, message, Popconfirm } from 'antd'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'

import BreadItemNav from '@components/breadItemNav'
import RelatedForm from './related-modal'

const success = (content) => message.success(content);

function ToolBar({ data, clickItemInfo }) {
  return (
    data.map((item,index) => <Button key={index} icon="plus-circle" type="primary" onClick={ () => clickItemInfo(item) } style={{margin:"0px 5px"}}>{item}</Button>)
  )
}

@observer
class RelatedList extends Component{
  constructor(props) {
    super(props)

    this.state = {
      pagination: { current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (total) => `共${total}条` },
      sourceData: [],
      loading: false,
      tools: ["添加"],
      breadcrumb: [{key:"info",title:"信息录入"}, { key:'/equipment', title:'装备关联管理'}]
    };

    this.columns = [
      { title: '部队名称', dataIndex: 'buduibianhao'},
      { title: '装备名称', dataIndex: 'zhuangbei_id'},
      { title: '装备类型(大类)', dataIndex: 'zhuangbeidalei'},
      { title: '装备类型(小类)', dataIndex: 'zhuangbeixiaolei'},
      { title: '装备数量', dataIndex: 'num'},
      { title: '单位', dataIndex: 'danwei'},
      {
        title: '操作', key: 'action', width: 300, fixed: 'right',
        render: (text, record) => (
          <HGroup verticalAlign="center" gap="5px">
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
      default: return;
    }
  }
  handlePageChange = (pagination) => {
    this.setState({ pagination: {...this.state.pagination, current: pagination.current}});
  }
  handleAddRecord = () => {
    const { store } = this.props;
    store.setEquipmentRelatedInfo({});
    store.equipmentRelatedModalChange(true)
  }
  fetchDataSource = () => {
    const { store } = this.props;
    let params = {
      page: this.state.pagination.current,
      size: this.state.pagination.pageSize,
      bumen_id: store.treeNodeInfo.key || ''
    }
    store.fetchRelatedList(params).then(res => {
      const {content, total } = res;
      this.setState({ sourceData: content, pagination: {...this.state.pagination, total} })
    })
  }

  editRow = ({id}) => {
    const { store } = this.props;
    store.fetchArmyById({id}).then(res => {
      res.idEdit = true;
      const { zhuangbeidalei, zhuangbeixiaolei} = res;
      const bdid = store.treeNodeInfo.key;
      store.getDictions(res.zhuangbeidalei)
      store.fetchEquipList({zhuangbeidalei, zhuangbeixiaolei, bdid })
      store.setEquipmentRelatedInfo(res);
      store.equipmentRelatedModalChange(true)
    })
  }

  deleteRow = (record) => {
    const { store } = this.props;
    store.set_delete_byArmy({id: record.id}).then(res => {
      success("删除成功")
      this.fetchDataSource();
    })
  }
  componentDidMount() {
    const { store } = this.props;
    this.relatedReaction = reaction(() => [store.treeNodeInfo.troopsnum], (arr) => this.fetchDataSource())
    store.getDictions('2-2');
  }

  componentWillUnmount(){
    this.relatedReaction();
  }

  render(){
    const { sourceData, pagination, loading, tools, breadcrumb } = this.state;
    return(
      <>
        <BreadItemNav breadData={breadcrumb}/>
        <HGroup className="content-right-tools" padding="20px 0 20px 0">
          <ToolBar data={tools} clickItemInfo={this.clickItemInfo} />
        </HGroup>
        <HGroup className="content-right-table" width="100%">
          <Table
            columns={ this.columns }
            dataSource={ sourceData }
            pagination={ pagination }
            loading={ loading }
            onChange={ this.handlePageChange }
            rowKey={ row => row.id }
            style={{ width:"100%" }}
          />
        </HGroup>
        <RelatedForm fetchDataSource={this.fetchDataSource} store={ this.props.store } />
      </>
    )
  }

}

export default RelatedList;

