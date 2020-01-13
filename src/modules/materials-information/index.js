import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import {HGroup,VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react';
import {Button,Table,message} from 'antd'
import CombatInfo from './views/combat-state'
import MaterialsModal from './views/materials-state'
import TreeCard from '@modules/tree'
import {deleteMater} from './materials.service'
import MaterialsStore from './materials.store'
import BreadCrumbNav from '@components/breadItemNav'
import './index.less'
function  TableTools(props) {
  const tools=[
    {
      "title":"物资信息维护",
      "icon":"",
      "type":"primary"
    },
    {
      "title":"战备状态维护",
      "icon":"",
      "type":"primary"
    },
    {
      "title":"批量删除",
      "icon":"delete",
      "type":"danger"
    },
  ]
    return(<>
        { tools.map((item,index) => (
          <Button key={index} type={item.type} icon={item.icon}onClick={() => clickItemInfo(item.title,props)} style={{margin:"0px 5px"}}>{item.title}</Button>
        ))
        }
      </>
    )
}
function clickItemInfo(item,props) {
    props.clickComabt(item)
}
const data = [
  {title:"信息录入",key:'sk'},
  {title:"物资信息维护",key:'so'},
]
@observer
class MaterialsEntryModal extends Component{
   constructor(props){
     super(props)
     this.state={
       current:1,
       total:30,
       pageSize:20,
       materialsData:[],
       pagination: {
         total:"",
         pageSize:10,
         current:1,
       },
       loading: false,
       column:[],
       rowSelection:{},
       materialsTree:[],
       selectedKeys:[],
       checkedDeleteId:""
     }
   }

  componentDidMount() {

  }
  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }
   //展示战备状态
  clickComabt=async(item)=>{
     switch (item){
       case "战备状态维护":
         if(MaterialsStore.partKey!==""){
           MaterialsStore.fetchCombatPersonInfo(MaterialsStore.partKey).then(res=>{
             MaterialsStore.changeCombatModal(true)
           })
           let lis={
             current:1,
             pageSize:3,
             id:MaterialsStore.partKey
           }
           MaterialsStore.fetchCombatStatusTable(lis)
         }else {
           message.error("请先选择一要新增的部门")
         }
         break;
       case "物资信息维护":
         if(MaterialsStore.partKey!==""){
           MaterialsStore.changeVisible(true)
           MaterialsStore.changeMaterTypes("1")
           MaterialsStore.materBackInfo={}
         }else {
           message.error("请先选择一要新增的部门")
         }
         this.getMaterSelect("0-7")
         break;
       case "批量删除":
        if(this.state.checkedDeleteId.length>0){
         let ida=this.state.checkedDeleteId;
         let idc=ida.join(",")
          const ms=await deleteMater(idc)
          if(ms.statusCode==200){
            message.success("删除成功")
          }
          let datas={
            current:1,
            pageSize:10,
            id:MaterialsStore.partKey
          }
          this.getMaterialsData(datas)
        }
     }
  }
  getMaterSelect=(key)=>{
    MaterialsStore.fetchMaterSelect(key)
  }
  //分页
  handleTableChanges = (pagination) => {
    let current = pagination.current;
    console.log(pagination)
    this.setState({
      pagination:{
        current:current,
        pageSize:10
      }
    });
    let datas={
      current:current,
      pageSize:10,
      id:MaterialsStore.partKey
    }
    this.getMaterialsData(datas)
  };

  selectChange=(selectedRowKeys,selectdRows)=>{
    let ids = selectdRows.map(item => item.id);
    this.setState({checkedDeleteId:ids});
  }
  detailRow=(row)=>{
    MaterialsStore.changeBtn(true)
    MaterialsStore.changeMaterTypes("3")
    MaterialsStore.fetchMaterialsInfos(row.id)
    MaterialsStore.getMaterTanleId(row.id)
    MaterialsStore.changeVisible(true)
    this.getMaterSelect("0-7")
  }
  //编辑
  editRow=async(row)=>{
    MaterialsStore.changeBtn(false)
   await MaterialsStore.fetchMaterialsInfos(row.id)
    MaterialsStore.getMaterTanleId(row.id)
    MaterialsStore.changeVisible(true)
    MaterialsStore.changeMaterTypes("2")
    this.getMaterSelect("0-7")
    this.getMaterSelect(MaterialsStore.materBackInfo.wzlxji1)
  }
  deleteRow=async(row)=>{
   const ms= await deleteMater(row.id)
    if(ms.statusCode==200){
     message.success("删除成功")
    }
    let datas={
      current:1,
      pageSize:10,
      id:MaterialsStore.partKey
    }
    this.getMaterialsData(datas)
  }
  treeSelect=(selectedKeys, nodeInfo)=>{
    const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
    this.setState({ selectedKeys})
    MaterialsStore.getPartKey(node.key)
    MaterialsStore.fetchGetMoreKey(node.key)
    let data={
      current:1,
      pageSize:10,
      id:node.key

    }
    this.getMaterialsData(data)

  }

  //保存更新
  upTable=()=>{
    let datas={
      current:1,
      pageSize:10,
      id:MaterialsStore.partKey
    }
    this.getMaterialsData(datas)
  }

  async getMaterialsData(id){
    const actionColumn = {
      title: "操作",
      dataIndex: "operation",
      render: (text,record) => (
        <HGroup horizontalAlign="center" verticalAlign="center" gap="5px">
          <div
            className="table-row-btn detail-btn"
            onClick={()=>{this.detailRow(record)}}
            size="small"
          >
            查看
          </div>
          <div
            className="table-row-btn edit-btn"
            onClick={()=>{this.editRow(record)}}
            size="small"
          >
            编辑
          </div>
          <div
            className="table-row-btn delete-btn"
            onClick={()=>{this.deleteRow(record)}}
            size="small"
          >
            删除
          </div>
        </HGroup>
      )
      }

    await  MaterialsStore.fetchMaterialsTableData(id)
    let data = MaterialsStore.materialsTableData;
     data.columns.push(actionColumn);
    this.setState({column:data.columns})
    this.setState({pagination:{total:data.total,pageSize:data.pageSize}})
    await this.setState({ materialsData: data.sourceData, loading: false });
  }
   render(){
    const rowSelection={
      onChange:this.selectChange
    }
    const {selectedKeys }=this.state
     return(<div className="materials-main">
       <VGroup className="materials-left">
         <TreeCard selectedKeys={selectedKeys} onSelect={this.treeSelect}/>
       </VGroup>
       <VGroup  className="materials-right">
         <HGroup className="cls-location"><BreadCrumbNav breadData={data}/></HGroup>
         <HGroup className="materials-tools">
          <TableTools clickComabt={this.clickComabt}/>
         </HGroup>
         <HGroup className="materials-table-main">
           <Table
             rowSelection={rowSelection}
             columns={this.state.column}
             dataSource={this.state.materialsData}
             pagination={{
               ...this.state.pagination,
               showTotal: total => `共 ${total} 条`
             }}
             loading={this.state.loading}
             onChange={this.handleTableChanges}
             style={{width:"100%"}}
           />
         </HGroup>
         <CombatInfo></CombatInfo>
         <MaterialsModal ref={(materials)=>{this.materials=materials}} upTable={this.upTable} ></MaterialsModal>
       </VGroup>
     </div>)
   }

}
export default MaterialsEntryModal
export const MaterialsRoute = <Route path="/materials" component={MaterialsEntryModal}/>
