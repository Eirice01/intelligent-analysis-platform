import './index.less';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { HGroup,VGroup } from "v-block.lite/layout";
import { Input, Button , Table , DatePicker  } from 'antd'
import { Route } from 'react-router-dom';
import LogStore from './log.store'
import BreadItemNav from '../../components/breadItemNav'
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, row, index) => {
      return <div>{LogStore.logTableData.number*LogStore.logTableData.size+ (index + 1)}</div>
      }
    },
    {
      title: '用户姓名',
      dataIndex: 'userName'
    },
    {
      title:'IP地址',
      dataIndex:'address'
    },
    {
      title: '操作时间',
      dataIndex: 'logDate'
    },
    {
      title:'操作模块',
      dataIndex:'goal'
    },
    {
      title:'操作类型',
      dataIndex:'typele'
    },
    {
      title: '操作描述',
      dataIndex: 'describele'
    },
  ];
  
@observer
class Log extends Component {
    state = {
      userName:"",
      address:"",
      start:null,
      end:null
    }
    componentDidMount(){
      LogStore.fetchLogData();
    }
    onChange = type => (value, dateString) => {
      this.setState({[type]:value});
    }
    inputHandle = type => e => {
      this.setState({[type]:e.target.value});
    }
    onOk = type => (value) => {
      this.setState({[type]:value});
    }

   //表格分页、排序、筛选变化时触发
    tableChange = (pagination, filters, sorter, extra) => {
      let params = {
        page:pagination.current-1,
        size:pagination.pageSize,
        userName:this.state.userName,
        address:this.state.address,
        start:this.state.start ? this.state.start.format("YYYY-MM-DD HH:mm:ss") : null,
        end:this.state.start ? this.state.end.format("YYYY-MM-DD HH:mm:ss") : null
      }
      LogStore.fetchLogData(params);
    };

    onSearch = () => {
      let params = {
        page:0,
        size:10,
        userName:this.state.userName,
        address:this.state.address,
        start:this.state.start ? this.state.start.format("YYYY-MM-DD HH:mm:ss") : null,
        end:this.state.start ? this.state.end.format("YYYY-MM-DD HH:mm:ss") : null
      }
      LogStore.fetchLogData(params);
    }
    onReset = () => {
      this.setState({
        userName:"",
        address:"",
        start:null,
        end:null
      });
      LogStore.fetchLogData();
    }
    render(){
        const dataSource = LogStore.logTableData.content;
        return (
            <VGroup id="log-main" gap="20px">
                <BreadItemNav breadData={[{key:"system",title:"系统设置"},{key:"logManage",title:"日志管理"}]}/>
                <VGroup className="log-search-container" gap="20px">
                    <HGroup gap="20px">
                        <HGroup gap="5px" verticalAlign="center"><span className="log-search-label">用户姓名:</span><Input style={{width:"150px"}} onChange={this.inputHandle('userName')}/></HGroup>
                        <HGroup gap="5px" verticalAlign="center"><span className="log-search-label">IP地址:</span><Input style={{width:"150px"}} onChange={this.inputHandle('address')}/></HGroup>
                        <HGroup gap="5px" verticalAlign="center"><span className="log-search-label">开始时间:</span><DatePicker value={this.state.start} showTime placeholder="选择开始时间" onOk={this.onOk('start')} onChange={this.onChange('start')} /></HGroup>
                        <HGroup gap="5px" verticalAlign="center"><span className="log-search-label">结束时间:</span><DatePicker value={this.state.end} showTime placeholder="选择结束时间" onChange={this.onChange('end')} /></HGroup>
                    </HGroup>
                    <HGroup gap="20px" horizontalAlign="flex-end">
                        <Button type="primary" onClick={this.onSearch}>查询</Button>
                        <Button type="warning" onClick={this.onReset}>重置</Button>
                    </HGroup>
                </VGroup>
                <VGroup className="log-table-container">
                     <Table dataSource={dataSource} columns={columns}  loading={LogStore.loading}
                        pagination={{
                          ...LogStore.pagination,
                          showTotal: total => `共 ${total} 条`
                        }}
                        onChange={this.tableChange}/>
                </VGroup>
            </VGroup>
        );
    }
}

export default Log;
export const LogRoute = <Route exact path="/log" component={Log} />