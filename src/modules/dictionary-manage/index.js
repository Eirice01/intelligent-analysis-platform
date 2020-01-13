import './index.less'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { HGroup,VGroup } from 'v-block.lite/layout'
import {Button,Input,Table,Modal,Switch,message,Tag,Card} from 'antd';
import AbilityTree from './tree'
import BreadCrumbNav from '@components/breadItemNav'
import { observer } from 'mobx-react'
import Store from './dictionary-manage.store'
import WrappedAddForm from './add-form'
const {Search} = Input; 
const data = [
  {title:"系统设置",key:'system'},
  {title:"字典管理",key:'dictionary'}
]
// function BreadItem({data,onChange}){
//   return(
//     <Breadcrumb>
//       {
//         data.map(item => <Breadcrumb.Item value={item.id} key={item.key} onClick={() => onChange(item)}><a>{item.title}</a></Breadcrumb.Item> )
//       }
//     </Breadcrumb>
//   )
// }
@observer class DictionaryManage extends Component{
    constructor(props){
        super(props)
        this.state={
            y:0,
            id:"",
            loading:false,
            selectedArr:['all'],//左侧树选择的数据
            pagination:{
                saveDicName:"",
                saveValue:"",
                pid:"",
                queryString:"",
                id:"",
                current:1,
                page:1,
                size:10,
                pageSize:10,
                total:0,
                showSizeChanger:true,
                showTotal:((total) => {return `共${total}条`})
            },
            treeData:[],
            treeChildren:[],
            selectedKeys:[],
            enterNodeSelectedKeys:[],
            visible:false,
            //treeBread:[{key:"all",id:"",title:"全部"}]
        }
        this.columns = [{title:"序号",width:80,key:"number",render:(text,record,index) => `${index+1}`},
                    {title:'名称',key: 'dicName',dataIndex:'dicName'},
                    {title:'值',key: 'dicValue',dataIndex:'dicValue'},
                    {title:'编号',key: 'keyValue',dataIndex:'keyValue'},
                    {title:"状态",dataIndex:'enableState',key:'enableState',render:(text,record,index) =>
                        (<Switch checked={record.enableValue} onChange={() => this.switchChange(record)} />)
                    },
                    {title:'备注',key: 'dicDesc',dataIndex:'dicDesc'},
                    {title:"操作",dataIndex:'operation',width:250,key:'operation',render:(text,record,index) => 
                            (<span style={{cursor:'pointer'}}>
                              <Button className="input-btn btn-edit"  onClick={() => this.editRow(record,index)} type="primary" size="small" style={{marginRight: '10px'}} >编辑 </Button>
                              <Button className="input-btn btn-delete" type="danger" size="small" onClick={() => this.deleteRow(record,index)} style={{marginRight: '10px'}} >删除 </Button>
                              <Button className="input-btn btn-edit" onClick={() => this.enterChildNode(record,index)} type="primary" size="small"  style={{marginRight: '10px'}} >进入子节点 </Button>
                          </span>)
                    }]
    }
    switchChange= async (record) => {
      let {enableValue,id} = record;
      let sign = enableValue == true ? 0 : 1;
      await Store.dictionaryEnable({enable:sign,id})
      this.tableRender();
    }
    addForm = ()=>{
      if(this.state.selectedArr.length == 0){
        message.warning(`请选择左侧树！`);
        return;
      }
       this.setState({
            visible:true,
            pagination:{
              ...this.state.pagination,
              id:"",
              saveDicName:""
            }
        })
        Store.viewContent({},'新增字典',false);
    }
    enterChildNode = async (record,index) => {
        await this.setState({
          pagination:{
              ...this.state.pagination,
              pid:record.id,
              page:1,
              size:10
          }
        })
        let {pid,queryString,page,size} = this.state.pagination;
        let obj = {queryString,page,size};
        if(pid) obj ={...obj,pid}
        await Store.queryPageList({...obj}).then(res => {
          this.setState({loading:true})
          if(res.statusCode == 200){
              if(res.data.content.length == 0 && record.pid !=0){
                  this.setState({
                    tableData:res.data.content,
                    loading:false,
                    pagination:{
                      ...this.state.pagination,
                      total:res.data.totalElements
                    }
                })
              }else{
                this.setState({
                  enterNodeSelectedKeys:[...[],record.keyValue],
                  selectedKeys:[...[],record.keyValue],
                  tableData:res.data.content,
                  loading:false,
                  pagination:{
                    ...this.state.pagination,
                    total:res.data.totalElements
                  }
                })
              }
          }
        })
        this.treeRender()
    }
    editRow =(record,index)=>{
      this.setState({
          visible:true,
          pagination:{
              ...this.state.pagination,
              id:record.id,
              saveDicName:record.dicName,
              saveValue:record.dicValue
          }
      })
      Store.viewContent(record,'编辑字典',false);
    }
    deleteRow = async (record)=>{
       await Store.getDicInfoBriefContent({id:record.id}).then(res => {
          if (res.statusCode == 200) {
              Modal.confirm({
                  title: '删除信息',
                  content: (<p style={{color:'#ff6666'}} dangerouslySetInnerHTML = {{__html:res.data}}></p>),
                  okType:'primary',
                  onOk: async () => {
                     await Store.dictionaryDelete({id:record.id}).then(res => {
                          if (res.statusCode == 200) {
                              message.success(`${res.message}`);
                              this.treeRender()
                              this.tableRender();
                          }
                      })
                  }
              });
          }
      });
    }
    handleAddSubmit = (e) => {
        e.preventDefault();
        this.formAdd.props.form.validateFields((err,values)=>{
            if(!err){
              let obj={...values}
              if(this.state.pagination.id) obj.id = this.state.pagination.id;
              if(this.state.pagination.pid) obj.pid = this.state.pagination.pid;
               Store.saveDictionaryForm({...obj}).then(res => {
                 if(res.statusCode == 200){
                   this.setState({
                      visible:false
                  })
                   this.tableRender();
                   this.treeRender();
                   message.success(res.message)
                 }else{
                   message.error(res.message)
                 }
               })
            }
        })
    }
    handleAddCancel = e => {
        this.setState({
          visible:false
      })
    }
    dictionaryNameValidate =(rule,value,callback) => { //dicName 
      let {pid,id,saveDicName} = this.state.pagination;
      Store.existsDicNameValidate({pid,id,dicName:value.trim()}).then(res => {
          if(saveDicName==value.trim()){
            callback()
          }else{
            res.data?callback("名称重复"):callback();
          }
      })
    }
    dictionaryValueValidate =(rule,value,callback) => {
      let {pid,id,saveValue} = this.state.pagination;
      Store.existsDicValueValidate({pid,id,dicValue:value.trim()}).then(res => {
          if(saveValue==value.trim()){
            callback()
          }else{
            res.data?callback("值重复"):callback();
          }
      })
    }
    onChange = async (e) =>{
       await this.setState({  
          pagination:{
            ...this.state.pagination,
            item:e.target.value,
          }
      })
      this.tableRender();
    }
    onSearch = async (val)=>{
      await this.setState({
          pagination:{
            ...this.state.pagination,
            queryString:val.trim()
          }
      })
      this.tableRender();
    }
    onChangeTable = async (pagination,filters,sorter,extra) => {
        await this.setState({
            pagination:{
              ...this.state.pagination,
              current:pagination.current,
              pageSize:pagination.pageSize,
              page:pagination.current,
              size:pagination.pageSize
            }
        })
        this.tableRender();
    }
    tableRender = async () => {
        let {pid,queryString,page,size} = this.state.pagination;
        let obj = {queryString,page,size};
        if(pid) obj ={...obj,pid}
        await Store.queryPageList({...obj}).then(res => {
          this.setState({loading:true})
          if(res.statusCode == 200){
            this.setState({
              tableData:res.data.content,
              loading:false,
              pagination:{
                ...this.state.pagination,
                total:res.data.totalElements
              }
            })
          }
        })
    }
    onSelect = async (selectedKeys, info) => {
        let pid="";
        if(selectedKeys.length){
           pid = info.selectedNodes[0].props.id;
        }
        await this.setState({
          selectedArr:selectedKeys,
          enterNodeSelectedKeys:selectedKeys,
          selectedKeys:selectedKeys,
          pagination:{
              ...this.state.pagination,
              pid:!pid?"":pid,
              page:1,
              size:10
          }
        })
        this.tableRender()
    }
    treeRender = async () => {
       await Store.dictionaryTreeData().then(res => {
        if(res.statusCode == 200){
          let len = this.state.enterNodeSelectedKeys.length;
          this.setState({
            treeData:[...[],res.data],
            selectedKeys:len?this.state.selectedKeys:[...[],res.data.key]
          })
        }
      })
    }
    componentWillUnmount(){
      this.setState = (state,callback) => {
        return
      }
    }
    componentDidMount() {
      this.treeRender()
      this.tableRender()
      let bodyH = document.body.clientHeight;
      this.setState({
        y:bodyH-380
      })
       window.onresize = () => {
        let bodyH = document.body.clientHeight;
        this.setState({
            y:bodyH-380
        })
      }
    }
  render(){
    const {pagination,loading,tableData,y,treeData,selectedKeys} = this.state;
    const len = treeData.length;
    return(
      <HGroup className="dictionary-container" > 
          <VGroup className="dictionary-left">
              <Tag color="#108ee9" style={{width:"56px"}}>字典组</Tag>
              {len ? <AbilityTree treeData={treeData} onSelect = {this.onSelect} selectedKeys = {selectedKeys} /> : null}
          </VGroup>
          <VGroup className="dictionary-right">
                <HGroup style={{marginBottom:"10px"}}>
                    <BreadCrumbNav breadData={data}/>
                </HGroup>
                <HGroup horizontalAlign='space-between' padding="0 10px 10px 0">
                  <Button onClick={this.addForm} type="primary" icon="plus-circle" style={{marginRight:"10px"}}>新增</Button>
                  <Search placeholder="搜索..." style={{width:300,marginLeft:"80px"}}  onSearch={this.onSearch} />
                </HGroup>
                <HGroup >
                  <Card style={{width:'100%'}} className="dictionary-table" >
                    <Table id="userTable" style={{width:'100%'}} scroll={{y}} pagination={pagination} onChange={this.onChangeTable} columns={this.columns} loading={loading} dataSource={tableData} rowKey={row => row.id} />
                  </Card>
                </HGroup>
                <HGroup >
                    <Modal 
                      width={600}
                      title={Store.modalTitle} 
                      visible={this.state.visible} 
                      onCancel={this.handleAddCancel} 
                      centered={true} 
                      destroyOnClose={true} 
                      footer={null}>
                      <WrappedAddForm wrappedComponentRef={(form) => this.formAdd = form} handleAddSubmit={this.handleAddSubmit} handleAddCancel={this.handleAddCancel} dictionaryValueValidate={this.dictionaryValueValidate} dictionaryNameValidate={this.dictionaryNameValidate} />
                  </Modal>
                </HGroup>
          </VGroup>
      </HGroup>   
    )
  }
}
export default DictionaryManage
export const DictionaryManageRoute = <Route path="/dictionary" component={DictionaryManage} exact />;