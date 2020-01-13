import './personnelView.less'
import React, { Component } from "react";
import { Route } from 'react-router-dom';
import { HGroup, VGroup } from "v-block.lite/layout";
import { Form, Row, Col, Input, Button, Table, Select, message , Upload,Popconfirm } from "antd";
// import moment from 'moment';
// const { RangePicker } = DatePicker;
const { Option } = Select;
import personinputStore from "./person.store";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react"
import personDirctStore from './personDirct.store';
import TreeCard from '@modules/tree'
import BreadItemNav from '../../components/breadItemNav'

import {deletePersonInfo } from './person.service'


function downloadTemplete() {
  let a = document.createElement('a');
  a.setAttribute("download",'');
  a.href=`/api/enemy/template/downModelExcel?tableName=${'ARMY_RYXXJLB21868'}`;
  a.click();
}

function optionGenerate(options){
  if(!options) return null;
  let arr = [];
  options.forEach((v,i) => arr.push(<Option key={i} value={v.value}>{v.name}</Option>));
  return arr;
}

@withRouter
@observer
class PersonnelView extends Component {
  constructor() {
    super();
    this.state = {
      treeKey:null,
      tableColumns:[],
      tableDataSource:[],
      pagination:{},
      loading: false,
      name:"",
      rybh:"",
      jz:"",
      jx:"",
      checkedDeleteId:"",
      selectedRowKeys:[],
      photoList:[]
    };
  }

  componentDidMount() {

  }
  componentWillUnmount(){
      this.setState = (state,callback) => { return }
  }
  queryPersonTable = async (params) => {
    const actionColumn = {
      title: "操作",
      dataIndex: "operation",
      render: (text,row,index) => {
        return (
          <HGroup verticalAlign="center" gap="5px">
            <div className="table-row-btn detail-btn" onClick={this.detailEdit(true,row)} size="small" >查看</div>
            <div className="table-row-btn edit-btn" onClick={this.detailEdit(false,row)} size="small">编辑</div>
            <Popconfirm title="是否删除？" cancelText="取消" okText="确定" onConfirm={this.deleteRow(text,row,index)}>
              <div className="table-row-btn delete-btn">删除</div>
            </Popconfirm>
          </HGroup>
        );
      }
    };
    const photoColumn = {
      title:"人员照片",
      dataIndex:"ryzp1dr",
      className:"photoColunm",
      render:(text,row,index) => {
        let photoUrl = row.ryzp1dr && row.ryzp1dr.split(',')[1];
        return (
          <HGroup verticalAlign="center" style={{padding:"5px 0px"}}>
              <img src={photoUrl} width="50"/>
          </HGroup>
        )
      }
    }
    await this.setState({ tableDataSource: [], loading: true });
    await personinputStore.fetchPersonTable(params);
    let data = personinputStore.personTable;
    let sourceData = data.sourceData;
    let columns = data.columns.filter(item => item.dataIndex != 'ryzp1dr');
    columns = [photoColumn,...columns,actionColumn];
    let pagination = {
      total:data.total,
      pageSize:data.pageSize,
      current:data.current
    };
    await this.setState({ tableColumns: columns,tableDataSource:sourceData,pagination, loading: false });
  };


  //查看 编辑
  detailEdit = (type,row) => () =>  {
    if(type){
      this.props.history.push({
        pathname:"/entryInfo/personInfo/personDetail",
        state:{
          treeKey:row.ssdwkc5Value,
          editable:type,
          id:row.id
        }
      });
    } else {
      this.props.history.push({
        pathname:"/entryInfo/personInfo/addPerson",
        state:{
          treeKey:row.ssdwkc5Value,
          editable:type,
          id:row.id
        }
      });
    }
  };

  //删除
  deleteRow = (text, row, index) => async () => {
    let id = row.id;
    let res = await deletePersonInfo({id});
    message.info(res.message);
    let params = {
      page:this.state.pagination.current,
      size:this.state.pagination.pageSize,
      bdid:this.state.treeKey,
      params:{
        xm2er:this.state.name,
        rybhnvh:this.state.rybh,
        zw75d:this.state.jz,
        jxahh:this.state.jx
      }
    }
    this.queryPersonTable(params);
  };
  //批量删除
  mulDele = async () => {
    if(this.state.checkedDeleteId){
      let res = await deletePersonInfo({id:this.state.checkedDeleteId});
      message.info(res.message);
      let params = {
        page:this.state.pagination.current,
        size:this.state.pagination.pageSize,
        bdid:this.state.treeKey,
        params:{
          xm2er:this.state.name,
          rybhnvh:this.state.rybh,
          zw75d:this.state.jz,
          jxahh:this.state.jx
        }
      }
      this.queryPersonTable(params);
      this.setState({
        checkedDeleteId:"",
        selectedRowKeys:[]
      })
    }
  }
  goAdd = () => {
    this.props.history.push({
      pathname: "/entryInfo/personInfo/addPerson",
      state:{
        treeKey:this.state.treeKey
      }
    });
  };
  changeHandler = type => e => {
    this.setState({[type]:e.target.value});
  }

  selectChange = type => val => {
    this.setState({[type]:val});
  }

  dateChange = (date,dateStr) => {
    this.setState({
      rwsjd:dateStr[0] ? dateStr : null
    })
  }
  getFields() {
    return (
      <VGroup gap="10px">
        <Row>
          <Col span={6}>
            <HGroup gap="10px" verticalAlign="center">
                <span className="search-label">姓名</span>
                <Input  value={this.state.name} onChange={this.changeHandler('name')} style={{width:"200px"}}/>
            </HGroup>
          </Col>
          <Col span={6}>
            <HGroup gap="10px" verticalAlign="center">
                <span className="search-label">人员编号</span>
                <Input  value={this.state.rybh} onChange={this.changeHandler('rybh')} style={{width:"200px"}}/>
            </HGroup>
          </Col>
          <Col span={6}>
            <HGroup gap="10px" verticalAlign="center">
                <span className="search-label">军职</span>
                <Select defaultValue="" value={this.state.jz} onChange={this.selectChange('jz')} style={{width:"200px"}}>
                 {optionGenerate(personDirctStore.jz)}
                </Select>
            </HGroup>
          </Col>
          <Col span={6}>
            <HGroup gap="10px" verticalAlign="center">
                <span className="search-label">军衔</span>
                <Select defaultValue="" value={this.state.jx} onChange={this.selectChange('jx')} style={{width:"200px"}}>
                {optionGenerate(personDirctStore.jx)}
                </Select>
            </HGroup>
          </Col>
        </Row>
        {/* <Row>
          <Col span={6}>
            <HGroup gap="10px" verticalAlign="center">
                <span className="search-label">人员类别</span>
                <Select defaultValue="" value={this.state.rylb} onChange={this.selectChange('rylb')} style={{width:"200px"}}>
                {optionGenerate(personDirctStore.rylb)}
                </Select>
            </HGroup>
          </Col>
          <Col span={6}>
            <HGroup gap="10px" verticalAlign="center">
                <span className="search-label">人员类型</span>
                <Select defaultValue="" value={this.state.rylx} onChange={this.selectChange('rylx')} style={{width:"200px"}}>
                {optionGenerate(personDirctStore.rylx)}
                </Select>
            </HGroup>
          </Col>
          <Col span={6}>
            <HGroup gap="10px" verticalAlign="center">
                <span className="search-label">入伍时间段</span>
                <RangePicker format={"YYYY-MM-DD"}  value={this.state.rwsjd ? [moment(this.state.rwsjd[0],"YYYY-MM-DD"),moment(this.state.rwsjd[1],"YYYY-MM-DD")] : null} style={{width:"250px"}} onChange={this.dateChange}/>
            </HGroup>
          </Col>
        </Row> */}
      </VGroup>
    );
  }

  //查询
  searchHandler = (e) => {
    e.preventDefault();
    let params = {
      xm2er:this.state.name,
      rybhnvh:this.state.rybh,
      zw75d:this.state.jz,
      jxahh:this.state.jx
    }
    this.queryPersonTable({
      page:1,
      size:10,
      bdid:this.state.treeKey,
      params
    });
  }
  //重置
  handleReset = () => {
    this.setState({
      name:"",
      rybh:"",
      jz:"",
      jx:""
    })
    this.queryPersonTable({
      page:1,
      size:10,
      bdid:this.state.treeKey
    });
  };

  //表格分页、排序、筛选变化时触发
  tableChange = (pagination, filters, sorter, extra) => {
    let params = {
      page:pagination.current,
      size:pagination.pageSize,
      bdid:this.state.treeKey,
      params:{
        xm2er:this.state.name,
        rybhnvh:this.state.rybh,
        zw75d:this.state.jz,
        jxahh:this.state.jx
      }
    };
    this.queryPersonTable(params);
  };
  onSelect = async (key,nodeInfo, rootNode) => {
    const { location } = this.props;
    const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
    let selectedKeys = rootNode ? rootNode.key : node.key;
    if(location.state && location.state.treeKey){
      selectedKeys = location.state.treeKey;
    }
    await this.setState({treeKey:selectedKeys})
    this.queryPersonTable({
      page:1,
      size:10,
      bdid:selectedKeys
    });
  }
  checkChange = (selectedRowKeys,selectdRows)=>{
    let ids = selectdRows.map(item => item.id);
    this.setState({checkedDeleteId:ids.join(','),selectedRowKeys:selectedRowKeys});
  }
  uploadHandle = type => (info) => {
    if (info.file.status === 'done') {
      if(type == "infoList"){
        message.success(`${info.file.response.message}!`);
        this.queryPersonTable();
      }
    } else if (info.file.status === 'error') {
      message.error(`上传失败!`);
    }
  }
  render() {
    const {selectedRowKeys} = this.state;
    const rowSelection={
      selectedRowKeys,
      onChange:this.checkChange
    }
    return (
      <HGroup id="person-view">
        <VGroup className="leftSider">
          <TreeCard  onSelect={this.onSelect} selectedKeys={[this.state.treeKey]}/>
        </VGroup>
        <VGroup className="rightContent" gap="10px">
          <VGroup gap="10px">
            <BreadItemNav breadData={[{key:"info",title:"信息录入"},{key:"personInfo",title:"人员信息维护"}]}/>
            <HGroup gap="20px" verticalAlign="center" style={{ height: "50px" }}>
              <Button type="primary"  icon="plus-circle" onClick={this.goAdd}>新增</Button>
              <Button type="primary" icon="download" onClick={downloadTemplete}>模板下载</Button>
              <Upload accept=".xls,.xlsx" action="/api/enemy/template/importFile" data={{tableName:"ARMY_RYXXJLB21868"}} showUploadList={false} onChange={this.uploadHandle("infoList")}>
                <Button type="primary" icon="upload">批量上传人员信息</Button>
              </Upload>
              <Upload accept=".jpg,.jpeg,.png" action="/api/enemy/personnelinfo/fileUpload"  multiple={true} data={{isbatch:true}} showUploadList={false}  onChange={this.uploadHandle("photoList")}>
                <Button type="primary" icon="upload">批量上传人员照片</Button>
              </Upload>
              <Button type="danger" icon="delete" onClick={this.mulDele}>批量删除</Button>
              <p className="zhuyi">注意:批量上传照片允许上传jpg,jpeg,png格式的照片,照片名称必须为人员编号-姓名,如(001-李四.png)</p>
              {/* <Button type="danger" icon="delete">撤销上次导入</Button> */}
            </HGroup>
            <HGroup className="multi-upload-list" gap="10px">
               {this.state.photoList.map(item => <HGroup key={item.uid}><span>{item.name}</span></HGroup>)}
            </HGroup>
          </VGroup>

          <HGroup>
            <Form
              className="personnelInput-search-form"
              onSubmit={this.handleSearch}
              autoComplete="off"
            >
              {this.getFields()}
              <Row style={{marginTop:"10px"}}>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button type="primary" htmlType="submit" onClick={this.searchHandler}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          </HGroup>
          <VGroup className="addPersonTable-container">
            <Table
              rowSelection={rowSelection}
              dataSource={this.state.tableDataSource}
              columns={this.state.tableColumns}
              loading={this.state.loading}
              pagination={{
                ...this.state.pagination,
                showTotal: total => `共 ${total} 条`
              }}
              onChange={this.tableChange}
            />
          </VGroup>
        </VGroup>
      </HGroup>
    );
  }
}

export default PersonnelView;
export const PersonnelViewRoute = <Route exact path="/entryInfo/personInfo" component={PersonnelView}/>
