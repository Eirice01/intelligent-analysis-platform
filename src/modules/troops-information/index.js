import React, { Component } from 'react'
import {HGroup,VGroup } from 'v-block.lite/layout'
import { Redirect, Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react';
import TroopStore from './troops.store'
import {Button,Table,Input,message,Modal} from 'antd'
import TreeCard from '@modules/tree'
import BreadCrumbNav from '@components/breadItemNav'
import  TroopsAdd from './troops-add.js'
import  TroopsInformationModal from './troops-showinformation.js'
import './index.less'
const data = [
  {title:"信息录入",key:'s'},
  {title:"部队信息维护",key:'s1'},
]
@observer
class TroopsInformation extends Component{
   constructor(props){
     super(props)
     this.state={
       troopsId:'001',
       troopTableData:[],
       isDelete:false,
       deleteInfo:"",
       deleteId:"",
       mc0mx:"",
       bdbh1vf:"",
       pagination: {
         total:"",
         pageSize:8,
         current:1,
       },
       loading: false,
       columns:[],
       tree:[],
       selectedKeys: []
     }

   }

   //分页
  handleTableChange = (pagination) => {
     let current = pagination.current;
    this.setState({
      pagination:{
        current:current,
        pageSize:8
      }
    });
    let data={
      current:current,
      pageSize:8,
      id:TroopStore.TroopsKey,
      params:{
        mc0mx:"",
        bdbh1vf:""
      }
    }
    this.getCombatData(data)
  };
  componentDidMount() {
    this.tree && this.tree.restTreeData();
    let data={
     current:this.state.pagination.current,
     pageSize:this.state.pagination.pageSize,
      id:TroopStore.TroopsKey,
      params:{
        mc0mx:"",
        bdbh1vf:""
      }
    }
    this.getCombatData(data)
  }
  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }
  detailRow=(row)=>{
    TroopStore.changeDisabled(true)
    TroopStore.changeFlag("2")
    this.props.history.push({pathname:'/entryInfo/troops/information',query:{Tid:row.id,from:"troop"}})
  }

  editRow=(row)=>{
    TroopStore.changeDisabled(false)
    TroopStore.changeFlag("3")
    TroopStore.getTroopsId(row.id)
    this.props.history.push({pathname:'/entryInfo/troops/addtroops',query:{Tid:row.id,}})
  }

  deleteRow=(row)=>{
    this.setState({deleteId:row.id})
    this.setState({isDelete:true})

  }

  changeDelete=(e)=>{
    this.setState({deleteInfo:e.target.value})
  }
  OnCancel=()=>{
    this.setState({deleteInfo:""})
    this.setState({isDelete:false})
  }

  deleteOk=()=>{
    if(this.state.deleteInfo=="delete"||this.state.deleteInfo=="DELETE"){
      let id=this.state.deleteId;
      this.setState({deleteInfo:""})
      TroopStore.fetchDeleteTroops(id).then(res=>{console.log(res)})
      this.tree && this.tree.restTreeData();
      let data={
        current:1,
        pageSize:this.state.pagination.pageSize,
        id:TroopStore.TroopsKey,
        params:{
          mc0mx:"",
          bdbh1vf:""
        }
      }
      this.getCombatData(data)
      this.setState({isDelete:false})
      message.success("删除成功")

    }

  }

  getSerchInfo=()=>{
    let data={}
    if(this.state.mc0mx!==""&&this.state.bdbh1vf!==""){
      data={
        current:1,
        pageSize:this.state.pagination.pageSize,
        id:TroopStore.TroopsKey,
        params:{
          mc0mx:this.state.mc0mx,
          bdbh1vf:this.state.bdbh1vf
        }
    }

   }else {
      data={
        current:1,
        pageSize:this.state.pagination.pageSize,
        id:TroopStore.TroopsKey,
        params:{
          mc0mx:this.state.mc0mx,
          bdbh1vf:this.state.bdbh1vf
        }
      }
    }
    this.getCombatData(data)
  }

  async getCombatData(datas){
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
           <Button
             className="table-row-btn delete-btn"
             onClick={()=>{this.deleteRow(record)}}
             size="small"
           >
             删除
           </Button>
      </HGroup>
      )
    };

    await this.setState({ troopTableData: [], loading: true });
    await  TroopStore.fetchTroopTableData(datas)
    let data = TroopStore.troopTableData;
        data.columns.push(actionColumn);
    let tabledata=data.sourceData
    this.setState({columns:data.columns})
    this.setState({pagination:{total:data.total,pageSize:data.pageSize}})
    await this.setState({ troopTableData: tabledata, loading: false });
  }
  //跳转新增部队信息界面
  jumpNewTroopsInformation=(props)=>{
    TroopStore.TroopsBackZat={
      troopZat:"",
      troopName:""
    }
    TroopStore.initInfo()
    TroopStore.changeDisabled(false)
    if(TroopStore.TroopsKey!==""){
      TroopStore.changeFlag("1")
      TroopStore.changeMeun(false)
      TroopStore.EditorHtml()
      props.history.push({pathname:'/entryInfo/troops/addtroops'})
    }else {
      message.error("请先选择一个部门")
    }

  }

  onSelect=(key, nodeInfo, rootNode)=>{
    const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
    let selectedKeys = rootNode ? rootNode.key : node.key;
    this.setState({ selectedKeys: [selectedKeys] })
    TroopStore.getTroopsKey(selectedKeys)
    TroopStore.fetchGetMoreKey(selectedKeys)
    let data={
      current:1,
      pageSize:8,
      id: selectedKeys,
      params:{
        mc0mx:"",
        bdbh1vf:""
      }
    }
    this.getCombatData(data)
  }

  exportTroops=()=>{
   this.downloadTemplete()
  }

  //导出
  downloadTemplete=()=> {
    let a = document.createElement('a');
    a.setAttribute("download",'');
    a.href=`api/enemy/troopsinfo/troopsinfoExport`;
    a.click();
  }

  getTroopSearchMc=(e)=>{
    this.setState({ mc0mx:e.target.value})
  }

  getTroopSearchBh=(e)=>{
    this.setState({bdbh1vf:e.target.value})
  }

  claerInfo=()=>{
    this.setState({ mc0mx:""})
    this.setState({bdbh1vf:""})
    let data={
      current:1,
      pageSize:this.state.pagination.pageSize,
      id:TroopStore.TroopsKey,
      params:{
        mc0mx:"",
        bdbh1vf:"",
      }
    }
    this.getCombatData(data)
  }
   render(){
    const { selectedKeys } = this.state;
     return(
       <HGroup className="troops-content">
         <VGroup className="troops-left">
           <TreeCard selectedKeys={selectedKeys} ref={(tree)=>{this.tree=tree}} onSelect={this.onSelect}/>
         </VGroup>
         <VGroup className="troops-right">
           <HGroup className="cls-location"><BreadCrumbNav breadData={data}/></HGroup>
           <HGroup className="active-list">
             <span style={{marginRight:"20px"}}><Button type="primary" icon="plus-circle"onClick={() =>{this.jumpNewTroopsInformation(this.props)}}>新增</Button></span>
             <span><Button type="primary"onClick={this.exportTroops}  >导出</Button></span>
           </HGroup>
           <HGroup className="active-list-search">
             <span style={{marginRight:"18px"}}>部队名称：<Input value={this.state.mc0mx} placeholder="请输入部队名称" onChange={this.getTroopSearchMc}/></span>
             <span>部队编号：<Input  placeholder="请输入部队编号"  value={this.state.bdbh1vf}onChange={this.getTroopSearchBh}/></span>
             <div style={{marginLeft:"20px"}}>
               <Button style={{marginRight:"15px"}} type="primary" onClick={this.getSerchInfo}>查询</Button>
               <Button onClick={this.claerInfo}>重置</Button>
             </div>
           </HGroup>
           <HGroup className="troops-table-tontent">
             <Table
               columns={this.state.columns}
               dataSource={this.state.troopTableData}
               pagination={{
                 ...this.state.pagination,
                 showTotal: total => `共 ${total} 条`
               }}
               loading={this.state.loading}
               onChange={this.handleTableChange}
               style={{width:"100%"}}
             />
           </HGroup>
         </VGroup>
         <Modal
           visible={this.state.isDelete}
           onCancel={this.OnCancel}
           onOk={this.deleteOk}
         >
           <div className="deleteInfo">
              该部队关联到以下模块
             <p className="d-info">1：部队信息展示</p>
             <p  className="d-info">2：基本信息</p>
             <p  className="d-info">3：训练状态</p>
             <p  className="d-info">4：能力分析</p>
             <p  className="d-info">5：战备状态</p>
             <p >请确认是否要彻底删除该部队信息</p>
             <p >确认请输入“DELETE”后点击确认：<Input style={{width:"150px"}}  value={this.state.deleteInfo}onChange={this.changeDelete}/></p>
             <p>取消请点击取消按钮</p>
           </div>

         </Modal>
       </HGroup>)
   }
}

function troopsRoute() {
  return (
    <>
      <Switch>
        <Route path='/entryInfo/troops' component={TroopsInformation} exact/>
        <Route path='/entryInfo/troops/addtroops' component={TroopsAdd}/>
        <Route path='/entryInfo/troops/information' component={TroopsInformationModal}/>
        <Redirect to='/entryInfo/troops' />
      </Switch>
    </>
  )
}

export const TroopsRoute = <Route path="/entryInfo/troops" component={troopsRoute}/>
