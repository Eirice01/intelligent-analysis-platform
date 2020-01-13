import './index.less'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import moment from 'moment'
import { HGroup,VGroup } from 'v-block.lite/layout'
import Store from './ability-input.store'
import { observer } from 'mobx-react'
import {Card,Modal,Popconfirm,Button,Table,message} from 'antd'
import WrappedAddForm from './add-form'
import WrappedSearchForm from './search-form'
import TreeCard from '@modules/tree'
import BreadCrumbNav from '@components/breadItemNav'
const data = [
  {title:"信息录入",key:'system'},
  {title:"能力分析维护",key:'dictionary'}
]
@observer class AbilitySafeguard extends Component{
    constructor(props){
        super(props)
        this.state={
            loading:false,
            visible:false,
            columns:[],
            y:0,
            tableData:[],
            searchData:{},
            id:"",
            selectedKeys:[],
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
            }
        }
        this.actionColumns = [{title:"操作",dataIndex:'operation',key:'operation',width:200,render:(text,record,index) =>
                    (<span style={{cursor:'pointer'}}>
                        <Button className="input-btn btn-view" onClick={() => this.viewRow(record,index)} type="primary" size="small" style={{marginRight: '5px'}} >查看 </Button>
                        <Button className="input-btn btn-edit"  onClick={() => this.editRow(record,index)} type="primary" size="small"  style={{marginRight: '5px'}} >编辑 </Button>
                        <Popconfirm title="确认删除此条数据吗？" okText="确定" cancelText="取消" onConfirm={()=>this.deleteRow(record,index)} >
                            <Button className="input-btn btn-delete" type="danger" size="small"  style={{marginRight: '10px'}} >删除 </Button>
                        </Popconfirm>
                    {
                    }
                </span>)}]
    }
    addForm = e => {
        if(Store.treeSelected && Store.treeSelected != "1"){
             this.setState({
                visible:true,
                id:''
            })
            Store.viewContent({
            },'录入新增',false);
        }else{
            message.warning("请选择总机构以下级别的节点树")
        }
    }
    viewRow = (record,index)=>{
        Store.getCapabilityInfoData(record.id).then(res => {
           if(res.statusCode == 200){
                this.setState({
                    visible:true
                })
                Store.viewContent(res.data,'录入查看',true);
           }
        })
    }
    editRow = (record,index)=>{
        this.setState({
            visible:true,
            id:record.id
        })
        Store.viewContent(record,'录入编辑',false);
    }
    deleteRow = (record,index)=>{
        Store.deleteCapability(record.id).then(res => {
            if(res.statusCode == 200){
                message.success(res.message)
                this.initTableList();
            }
        })
    }
    handleAddSubmit = (e) => {
        e.preventDefault();
        this.formAdd.props.form.validateFields((err,values)=>{
            if(!err){
                values['hdsju31'] = moment(values['hdsju31']).format('YYYY-MM-DD')
                values['cjbdbhikd'] = Store.troopsnum;
                let {id} = this.state;
                let obj;
                id?obj={id,...values}:obj={...values}
                Store.abilitySave({...obj}).then(res => {
                    if(res.statusCode == 200){
                        this.setState({
                            visible:false
                        })
                        message.success(res.message)
                        this.initTableList();
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
    handleSearchSubmit = async (e) => {
        e.preventDefault();
        let values = this.formRef.props.form.getFieldsValue();
        for(let i in values){
            if(!values[i] || values[i].length == 0 ){
                delete values[i]
            }
        }
        if(values['hdsju31']){
           values['hdsju31'] = [moment(values['hdsju31'][0]).format('YYYY-MM-DD'),moment(values['hdsju31'][1]).format('YYYY-MM-DD')].join(',');
        }
        values["cjbdbhikd"] = Store.troopsnum;
        await this.setState({
            searchData:values
        })
        this.initTableList();
    }
    handleSearchReset = async (e) => {
        this.formRef.props.form.resetFields();
        await this.setState({
            searchData:{}
        })
        if(Store.troopsnum){
            await this.setState({
            searchData:{
                ...this.state.searchData,
                cjbdbhikd:Store.troopsnum
            }
            })
        }
        this.initTableList();
    }
    onSelect = async (key, info,rootNode) => {
        const node = info.node ? info.node.props.dataRef : info;
        const selectedKeys = rootNode ? rootNode.key : node.key;
        if(rootNode){
            await Store.troopsnumVal(rootNode.troopsnum,rootNode.title,rootNode.key);
            await this.setState({
                selectedKeys:[rootNode.key]
                },() => Store.setTreeNodeInfo(rootNode))
        }else{
            if(key.length){
                await Store.troopsnumVal(node.troopsnum,node.title,selectedKeys[0]);
                await this.setState({
                    selectedKeys:key
                },() => Store.setTreeNodeInfo(rootNode))
            }else{
                return;
            }
        }
         if(this.formRef){
                let values = this.formRef.props.form.getFieldsValue();
                 for(let i in values){
                    if(!values[i] || values[i].length == 0 ){
                        delete values[i]
                    }
                }
                if(values['hdsju31']){
                values['hdsju31'] = [moment(values['hdsju31'][0]).format('YYYY-MM-DD'),moment(values['hdsju31'][1]).format('YYYY-MM-DD')].join(',');
                }
                values["cjbdbhikd"] = Store.troopsnum;
                 this.setState({
                    searchData:values
                })
            }
        if(Store.troopsnum){
            await this.setState({
            searchData:{
                ...this.state.searchData,
                cjbdbhikd:Store.troopsnum
            }
            },() => Store.setTreeNodeInfo(node))
        }
       this.initTableList();
    };
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
        this.initTableList();
    }
    initTableList = () => {
        let {page,size}=this.state.pagination;
        let {searchData} = this.state;
        Store.queryPageList({page,size},searchData).then(res => {
            this.setState({
                columns:[...res.data.columns,...this.actionColumns],
                tableData:[...res.data.sourceData],
                pagination:{
                    ...this.state.pagination,
                     total:res.data.total
                }
            })
        })
    }
    selectedRow = (selectedRowKeys,selectedRows) => {
        Store.selectedRowStore(selectedRowKeys)
    }
    batchDelete = () => {
        if(Store.selectedRowData.length == 0){
            message.warning("请选择删除项")
            return;
        }
        Store.batchDeleteData(Store.selectedRowData).then(res => {
            if(res.statusCode == 200){
                message.success(res.message)
                this.initTableList();
            }
        })
    }
    componentDidMount() {
        Store.getCapabilityTableInfoData();
        let bodyH = document.body.clientHeight;
        this.setState({
            y:bodyH-580
        })
        window.onresize = () => {
            let bodyH = document.body.clientHeight;
            this.setState({
                y:bodyH-580
            })
        }
    }
     componentWillUnmount(){
      this.setState = (state,callback) => {
        return
      }
    }
    render(){
        const {pagination,loading,tableData,y,columns,selectedKeys} = this.state;
        const rowSelection = {
            onChange:this.selectedRow
        }
        return(
            <HGroup className="ability-container">
                <VGroup className="input-left">
                    <TreeCard onSelect={this.onSelect} selectedKeys={selectedKeys} />
                </VGroup>
                <VGroup className="input-right">
                    <HGroup style={{marginBottom:"10px"}}>
                        <BreadCrumbNav breadData={data}/>
                    </HGroup>
                    <HGroup>
                        <Card style={{width:'100%',height:"90px"}}>
                            {
                                Store.capabilityData.customColumnVos?<WrappedSearchForm
                                wrappedComponentRef={(form) => this.formRef = form} customColumnVos={Store.capabilityData.customColumnVos}
                                handleSearchSubmit={this.handleSearchSubmit} handleSearchReset={this.handleSearchReset}
                                />:null
                            }
                        </Card>
                    </HGroup>
                    <HGroup>
                        <Card style={{width:'100%',marginTop:"20px"}}>
                            <Button onClick={this.addForm} type="primary" icon="plus-circle" style={{marginRight:"10px"}}>新增</Button>
                            <Button type="danger" icon="delete" onClick={this.batchDelete}>批量删除</Button>
                        </Card>
                    </HGroup>
                    <HGroup>
                        <Card className="ablity-input-table" style={{width:'100%',marginTop:"20px"}}>
                            <Table style={{width:'100%'}} scroll={{y}} rowSelection={rowSelection}  pagination={pagination} onChange={this.onChangeTable} columns={columns} loading={loading} dataSource={tableData} rowKey={row => row.id} />
                        </Card>
                    </HGroup>
                </VGroup>
                <HGroup >
                     <Modal
                        width={800}
                        title={Store.modalTitle}
                        visible={this.state.visible}
                        onCancel={this.handleAddCancel}
                        destroyOnClose={true}
                        footer={null}>
                        {
                            Store.capabilityData.customColumnVos?
                            <WrappedAddForm wrappedComponentRef={(form) => this.formAdd = form}
                            handleAddSubmit={this.handleAddSubmit} handleAddCancel={this.handleAddCancel}
                            customColumnVos={Store.capabilityData.customColumnVos} />
                            :null
                        }
                    </Modal>
                </HGroup>
            </HGroup>
        )
    }
}
export default AbilitySafeguard
export const AbilitySafeguardRoute = <Route path="/entryInfo/ability-input" component={AbilitySafeguard} exact />;

