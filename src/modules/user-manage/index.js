import './index.less'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { HGroup,VGroup } from 'v-block.lite/layout'
import {Card,Button,Radio,Input,Table,Popconfirm,Modal,Switch,message} from 'antd';
import { observer } from 'mobx-react'
import Store from './user-manage.store'
import WrappedAddForm from './add-form'
import BreadCrumbNav from '@components/breadItemNav'
const {Search} = Input; 
const radioData = [{value:"0",label:"全部"},{value:"1",label:"启用"},{value:"2",label:"禁用"},{value:"3",label:"已删"}];
const data = [
  {title:"系统设置",key:'system'},
  {title:"用户管理",key:'user'}
]
@observer class UserManage extends Component{
    constructor(props){
        super(props)
        this.state={
            y:0,
            isDeleted:false,//是否时已删除
            id:"",
            username:"",
            userItem:"0",
            loading:false,
            pagination:{
                current:1,
                page:1,
                size:10,
                pageSize:10,
                total:0,
                showSizeChanger:true,
                showTotal:((total) => {return `共${total}条`}),
                query:"",
                item:"0"//用户类型
            },
            tableData:[],
            visible:false,
            columns:[{title:"序号",width:80,key:"number",render:(text,record,index) => `${index+1}`},
            {title:"用户名",dataIndex:'userName',key:'userName'},
            {title:"姓名",dataIndex:'fullName',key:'fullName'},
            {title:"部门",dataIndex:'department',key:'department'},
            {title:"角色",dataIndex:'role',key:'role'},
            {title:"联系方式",dataIndex:'telephone',key:'telephone'},
            {title:"是否启用",dataIndex:'enabled',key:'enabled',render:(text,record,index) =>
              (<Switch checked={record.enabled} onChange={() => this.switchChange(record)} />)},
            {title:"操作",dataIndex:'operation',key:'operation',render:(text,record,index) => 
                    !this.state.isDeleted? (<span style={{cursor:'pointer'}}>
                    <Button className="input-btn btn-edit" onClick={() => this.editRow(record,index)} type="primary" size="small"  style={{marginRight: '10px'}} >编辑 </Button>
                    <Popconfirm title="确认删除此条数据吗？" okText="确定" cancelText="取消" onConfirm={()=>this.deleteRow(record,index)} >
                        <Button className="input-btn btn-delete" type="danger" size="small"  style={{marginRight: '10px'}} >删除 </Button>
                    </Popconfirm>
                </span>):(<span style={{cursor:'pointer'}}>
                    <Popconfirm title="确认恢复此条数据吗？" okText="确定" cancelText="取消" onConfirm={()=>this.deleteRow(record,index)}  >
                        <Button  className="input-btn btn-edit" type="primary" size="small" >恢复 </Button>
                    </Popconfirm>
                </span>)
            }]
        }
    }
    switchChange= async (record) => {
      await Store.enabledSwitch(record.id)
      this.tableRender();
    }
    addForm = ()=>{
       this.setState({
            visible:true,
            id:"",
            username:""
        })
        Store.viewContent({
          password:"123456"
        },'新增用户',false);
    }
    editRow =(record,index)=>{
      this.setState({
          visible:true,
          id:record.id,
          username:record.userName
      })
      Store.viewContent(record,'编辑用户',false);
    }
    deleteRow = async (record)=>{
      await Store.deleteOrUser(record.id).then(res => {
          if(res.statusCode == 200){
            message.success('删除成功')
            this.tableRender();
          }
      })
    }
    handleAddSubmit = (e) => {
        e.preventDefault();
        this.formAdd.props.form.validateFields((err,values)=>{
            if(!err){
               let id = this.state.id;
               Store.saveUser({id,...values}).then(res => {
                 if(res.statusCode == 200){
                   this.setState({
                      visible:false
                  })
                   this.tableRender();
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
    userNameValidate =(rule,value,callback) => {
      Store.isRepeatUser({username:value.trim()}).then(res => {
        if(this.state.username==value){
          callback()
        }else{
          res.data?callback():callback("用户名重复")
        }
      })
    }
    handleCancel=(e)=>{
         this.setState({
            visible:false
        })
    }
    onChange = async (e) =>{
       await this.setState({  
          pagination:{
            ...this.state.pagination,
            item:e.target.value,
          },
          isDeleted:e.target.value == 3?true:false
      })
      this.tableRender();
    }
    onSearch = async (val)=>{
      await this.setState({
          pagination:{
            ...this.state.pagination,
            query:val.trim()
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
    tableRender = () => {
        let {item,page,size,query} = this.state.pagination;
        Store.queryUserList({item:Number(item),page,size,query}).then(res => {
          this.setState({
            tableData:res.data.content,
            pagination:{
              ...this.state.pagination,
              total:res.data.totalElements
            }
          })
      })
    }

    componentDidMount() {
      this.tableRender();
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
    const {pagination,loading,tableData,y,columns} = this.state;
    return(
      <HGroup height="100%" width="100%" className="user-container" padding="10px 80px"  horizontalAlign='center' > 
          <VGroup width="100%" style={{color:'#fff'}} >
              <HGroup style={{marginBottom:"10px"}}>
                  <BreadCrumbNav breadData={data}/>
              </HGroup>
            <Card style={{width:'100%'}}>
                <HGroup horizontalAlign='space-between' padding="0 0 10px">
                  <Button onClick={this.addForm} type="primary" icon="plus-circle" style={{marginRight:"10px"}}>新增</Button>
                  <HGroup>
                      <Radio.Group value={pagination.item} onChange={this.onChange}>
                      {
                        radioData.map(item => <Radio.Button value={item.value} key={item.value} >{item.label}</Radio.Button>)
                      }
                      </Radio.Group>
                      <Search placeholder="搜索..." style={{width:300,marginLeft:"80px"}}  onSearch={this.onSearch} />
                  </HGroup>
                </HGroup>
                <HGroup padding="10px 0" className="user-table">
                    <Table id="userTable" style={{width:'100%'}} scroll={{y}} pagination={pagination} onChange={this.onChangeTable} columns={columns} loading={loading} dataSource={tableData} rowKey={row => row.id} />
                </HGroup>
            </Card>
            <HGroup >
                <Modal 
                  width={600}
                  title={Store.modalTitle} 
                  visible={this.state.visible} 
                  onCancel={this.handleCancel} 
                  centered={true} 
                  destroyOnClose={true} 
                  footer={null}>
                  <WrappedAddForm wrappedComponentRef={(form) => this.formAdd = form} handleAddSubmit={this.handleAddSubmit} handleAddCancel={this.handleAddCancel} userNameValidate={this.userNameValidate}  />
              </Modal>
            </HGroup>
          </VGroup>
      </HGroup>   
    )
  }
}
export default UserManage
export const UserManageRoute = <Route path="/user" component={UserManage} exact />;