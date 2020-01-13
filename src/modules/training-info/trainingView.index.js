import './trainingView.less';
import React, { Component } from 'react';
import { HGroup, VGroup } from 'v-block.lite/layout'
import { Button , Table , Input, DatePicker, message, Select, Popconfirm } from 'antd'
import { Route , withRouter } from 'react-router-dom';
import TrainingInfoStore from './trainingInfo.store'
import { deleteTrainInfo , batchDeleteTrainInfo } from './trainingInfo.service'
import TreeCard from '@modules/tree'
import BreadItemNav from '../../components/breadItemNav'
import trainingDirctStore from './trainingDirct.store'
import moment from 'moment'
const { Option } = Select;


function optionGenerate(options){
  if(!options) return null;
  let arr = [];
  options.forEach((v,i) => arr.push(<Option key={i} value={v.value}>{v.name}</Option>));
  return arr;
}
@withRouter
class TrainingView extends Component {
    state = {
      treeKey:null,
      bdbh:null,
      checkedDeleteId:"",
      selectedRowKeys:[],
      columns:[],
      sourceData:[],
      pagination:{},
      xlkm:"",
      xlsd:"",
      xldd:"",
      xlsj:"",
      loading: false,
    }

    componentDidMount() {
        TrainingInfoStore.fetchTrainInfos();
    }

    treeSelect = async (key,nodeInfo) => {
      const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
      await this.setState({treeKey:key[0],bdbh:node.troopsnum,xlkm:"",xlsd:"",xldd:"",xlsj:""});
      this.getTrainingTableData({page:1,size:10,data:{
        ssbdbh884:node.troopsnum
      }});
    }
    async getTrainingTableData(params){
        const actionColumn = {
            title: "操作",
            dataIndex: "operation",
            className:"operation-column",
            render: (text,row,index) => {
              return (
                <HGroup verticalAlign="center" gap="5px">
                  <div className="table-row-btn detail-btn" onClick={this.detailEdit(true,row)} size="small" >查看</div>
                  <div className="table-row-btn edit-btn" onClick={this.detailEdit(false,row)} size="small" >编辑</div>
                  <Popconfirm title="是否删除？" cancelText="取消" okText="确定" onConfirm={this.deleteRow(text,row,index)}>
                    <div className="table-row-btn delete-btn">删除</div>
                  </Popconfirm>
                </HGroup>
              );
            }
          };
          await this.setState({ trainingTableData: {}, loading: true });
          await TrainingInfoStore.fetchTrainingTable(params);
          let data = TrainingInfoStore.trainingTable;
          data.columns.push(actionColumn);
          let pagination = {
            total:data.total,
            pageSize:data.pageSize,
            current:data.current
          };
          await this.setState({ columns: data.columns,sourceData:data.sourceData,pagination, loading: false });
    }
    //新增
    goAdd = () => {
      this.props.history.push({
        pathname:"/entryInfo/trainingInfo/addTraining",
        state:{
          treeKey:this.state.treeKey,
          bdbh:this.state.bdbh
        }
      })
    }
    //查看 编辑
    detailEdit = (type,row) => () =>  {
      if(type){
        this.props.history.push({
          pathname:"/entryInfo/trainingInfo/trainDetail",
          state:{
            treeKey:this.state.treeKey,
            editable:type,
            bdbh:this.state.bdbh,
            id:row.id
          }
        });
      } else {
        this.props.history.push({
          pathname:"/entryInfo/trainingInfo/addTraining",
          state:{
            treeKey:this.state.treeKey,
            editable:type,
            bdbh:this.state.bdbh,
            id:row.id
          }
        });
      }
    };

    //删除
    deleteRow = (text, row, index) => async () => {
      let id = row.id;
      let res = await deleteTrainInfo(id);
      message.info(res.message);
      let params = {
        page:this.state.pagination.current,
        size:this.state.pagination.pageSize,
        data:{
          ssbdbh884:this.state.bdbh,
          xlkm5ap:this.state.xlkm,
          xlddsai:this.state.xldd,
          xlsj6tp:this.state.xlsj,
          xlsd7qn:this.state.xlsd
        }
      }
      this.getTrainingTableData(params);
    };
    //批量删除
    batchDelete = async () => {
      if(this.state.checkedDeleteId.length > 0){
        let res = await batchDeleteTrainInfo(this.state.checkedDeleteId);
        message.info(res.message);
        let params = {
          page:this.state.pagination.current,
          size:this.state.pagination.pageSize,
          data:{
            ssbdbh884:this.state.bdbh,
            xlkm5ap:this.state.xlkm,
            xlddsai:this.state.xldd,
            xlsj6tp:this.state.xlsj,
            xlsd7qn:this.state.xlsd
          }
        }
        this.getTrainingTableData(params);
        this.setState({
          checkedDeleteId:"",
          selectedRowKeys:[]
        })
      }
    }
    inputChange = type => (e) => {
      this.setState({
        [type]:e.target.value
      })
    }
    selectChange = type => val => {
      this.setState({[type]:val});
    }
    dateChange = (date,dateStr) => {
      this.setState({
        xlsj:dateStr
      })
    }
    //查询
    searchHandler = () => {
      this.getTrainingTableData({page:1,size:10,data:{
        ssbdbh884:this.state.bdbh,
        xlkm5ap:this.state.xlkm,
        xlddsai:this.state.xldd,
        xlsj6tp:this.state.xlsj,
        xlsd7qn:this.state.xlsd
      }});
    }
    //重置
    resetSearch = async () => {
      await this.setState({
        xlkm:"",
        xldd:"",
        xlsj:"",
        xlsd:""
      })
      this.getTrainingTableData({page:1,size:10,data:{
        ssbdbh884:this.state.bdbh,
        xlkm5ap:this.state.xlkm,
        xlddsai:this.state.xldd,
        xlsj6tp:this.state.xlsj,
        xlsd7qn:this.state.xlsd
      }});
    }
    //表格分页、排序、筛选变化时触发
    tableChange = (pagination, filters, sorter, extra) => {
      let params = {
        page:pagination.current,
        size:pagination.pageSize,
        data:{
          ssbdbh884:this.state.bdbh,
          xlkm5ap:this.state.xlkm,
          xlddsai:this.state.xldd,
          xlsj6tp:this.state.xlsj,
          xlsd7qn:this.state.xlsd
        }
      };
      this.getTrainingTableData(params);
    };
    //列表选择行
    checkChange = (selectedRowKeys,selectdRows)=>{
      let ids = selectdRows.map(item => item.id);
      this.setState({checkedDeleteId:ids,selectedRowKeys});
    }
    render(){
        const {selectedRowKeys} = this.state;
        const rowSelection={
          selectedRowKeys,
          onChange:this.checkChange
        }
        return (
            <HGroup id="training-view">
                <div className="left-side">
                  <TreeCard onSelect={this.treeSelect} selectedKeys={[this.state.treeKey]}/>
                </div>
                <VGroup className="right-side" gap="20px">
                    <BreadItemNav breadData={[{key:"info",title:"信息录入"},{key:"trainInfo",title:"训练信息维护"}]}/>
                    <HGroup gap="20px" verticalAlign="center" style={{ height: "60px" }}>
                        <Button type="primary"  icon="plus-circle" onClick={this.goAdd}>新增</Button>
                        <Button type="danger" icon="delete" onClick={this.batchDelete}>批量删除</Button>
                    </HGroup>
                    <VGroup className="search-container" gap="20px" style={{padding:"10px"}}>
                      <HGroup gap="20px">
                      <HGroup gap="5px" verticalAlign="center">
                        <span style={{color:"#fff"}}>训练科目:</span>
                        <Select value={this.state.xlkm} style={{width:"150px"}} onChange={this.selectChange('xlkm')}>
                          {optionGenerate(trainingDirctStore.xlkm)}
                        </Select>
                      </HGroup>
                      <HGroup gap="5px" verticalAlign="center">
                        <span style={{color:"#fff"}}>训练地点:</span>
                        <Input value={this.state.xldd} style={{width:'150px'}} onChange={this.inputChange("xldd")}/>
                      </HGroup>
                      <HGroup gap="5px" verticalAlign="center">
                        <span style={{color:"#fff"}}>训练时间:</span>
                        <DatePicker value={this.state.xlsj ? moment(this.state.xlsj,'YYYY-MM-DD') : null} style={{width:'150px'}} onChange={this.dateChange}/>
                      </HGroup>
                      <HGroup gap="5px" verticalAlign="center">
                        <span style={{color:"#fff"}}>训练时段:</span>
                        <Select value={this.state.xlsd} style={{width:"150px"}} onChange={this.selectChange('xlsd')}>
                          {optionGenerate(trainingDirctStore.xlsd)}
                        </Select>
                      </HGroup>
                      </HGroup>
                      <HGroup horizontalAlign="flex-end" gap="30px">
                        <Button type="primary" onClick={this.searchHandler}>查询</Button>
                        <Button type="default" onClick={this.resetSearch}>重置</Button>
                      </HGroup>
                    </VGroup>
                    <VGroup className="table-container training-table-container">
                        <Table dataSource={this.state.sourceData} columns={this.state.columns} loading={this.state.loading}
                            rowSelection={rowSelection}
                            pagination={{
                                ...this.state.pagination,
                                showTotal: total => `共 ${total} 条`
                            }}
                            onChange={this.tableChange}/>
                    </VGroup>
                </VGroup>
            </HGroup>
        );
    }
}

export default TrainingView;
export const TrainingViewRoute = <Route exact path="/entryInfo/trainingInfo" component={TrainingView} />
