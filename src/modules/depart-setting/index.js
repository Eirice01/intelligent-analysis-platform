import './index.less'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { HGroup,VGroup } from 'v-block.lite/layout'
import {Button,message,Tag} from 'antd';
import BreadCrumbNav from '@components/breadItemNav'
import { observer } from 'mobx-react'
import Store from './depart-setting.store'
import AbilityTree from './tree'
const data = [
  {title:"系统设置",key:'system'},
  {title:"默认部门配置",key:'depart'}
]
@observer class DepartConfig extends Component{
    constructor(props){
        super(props)
         this.state={
            selectedKeys: [],
            showData:[]
        }
    }
     onSelect = async (selectedKeys, nodeInfo) => {
        const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
        let column= await Store.getColumn();
        let arr =[];
        column.forEach(item => {
            let obj = {}
            obj['clnComments'] = item.clnComments;
            obj['key'] =item.columnName;
            if(item.columnName == "bmid8in"){
                obj['value'] = node.key;
            }
            if(item.columnName == "bmbh9pg"){
                obj['value'] = node.troopsnum;
            }
            if(item.columnName == "bmmcim6"){
                obj['value'] = node.title;
            }
            arr.push(obj)
        })
        await this.setState({ selectedKeys,showData:[...arr]},() => Store.setTreeNodeInfo(node))
    };
    submitData = async () => {
      let treeData = await Store.treeNodeInfo; 
      if(treeData.key == 1){
        message.warning("请选择总机构以下级别的节点")
        return;
      }
      let obj  = {};
      this.state.showData.forEach(item => {
        obj[item.key] = item.value
      })
      await Store.setArmyinfo({...obj}).then(res => {
        if(res.statusCode == 200){
          message.success(res.message)
        }
      })
    }
    componentDidMount() {
      return Store.queInitTroop().then(
        resOut => {
            let arr = [];
            Store.getColumn().then(res => {
              res.forEach(item => {
                  let obj ={} ;
                  obj['clnComments'] = item.clnComments;
                  obj['key'] =item.columnName;
                  if(item.columnName == "bmid8in"){
                      obj['value'] = resOut[0]['bmid8in'];
                  }
                  if(item.columnName == "bmbh9pg"){
                      obj['value'] = resOut[0]['bmbh9pg'];
                  }
                  if(item.columnName == "bmmcim6"){
                      obj['value'] = resOut[0]['bmmcim6'];
                  }
                  arr.push(obj)
                })
                this.setState({ selectedKeys:[resOut[0].bmid8in],showData:[...arr] })
            });
        }
      )
    }
  render(){
    const {selectedKeys,showData} = this.state;
    return(
     <HGroup className="depart-config" > 
          <HGroup className="config-left" >
              <AbilityTree selectedKeys={selectedKeys} onSelect = {this.onSelect} />
          </HGroup>
          <VGroup className="config-right">
            <HGroup style={{marginBottom:"10px"}}>
                <BreadCrumbNav breadData={data} />
            </HGroup>
            <VGroup style={{marginTop:"20px"}}>
               
                  {
                    showData.length>0?
                      showData.map(item => {
                        return(
                           <div className="config-data" key={item.key}>
                              <span className="cofing-name">{item.clnComments}:</span>
                              <Tag className="config-value" color="orange" >{item.value}</Tag>
                          </div>)}) :null
                  }
                  <Button type="primary" style={{width:"80px",marginTop:"15px"}} onClick={this.submitData} >提交</Button>
            </VGroup>
          </VGroup>
    </HGroup>
    )
  }
}
export default DepartConfig
export const DepartConfigRoute = <Route path="/config" component={DepartConfig} exact />;