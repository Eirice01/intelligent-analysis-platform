import React, { Component } from "react";
import { HGroup, VGroup } from "v-block.lite/layout";
import { Icon, Input, Tag ,Pagination } from "antd";
import { MyIcon } from '../../../components/myIcon'
import {observer} from 'mobx-react';
import {reaction} from 'mobx'
import TitleView from "./title";
import trainingStore from "../training.store"

const { Search } = Input;

@observer
class TrainingComplete extends Component {
  state = {
    searchVal:""
  }
  componentDidMount(){
    this.reaction = reaction(() => [trainingStore.complete], arr => {
      let rybh = arr[0]["xlry7q2"];
      let params = {
        bdid:this.props.treeKey,
        page:1,
        size:10,
        params:{rybhnvh:rybh}
      }
      trainingStore.fetchTrainPersons(params);
    })

  }

  componentWillUnmount(){
    // this.setState = (state,callback) => { return }
    this.reaction();
  }

  searchTrainPerson = val => {
    this.setState({searchVal:val})
    if(val){
      let params = {
        bdid:this.props.treeKey,
        page:trainingStore.pagination.current,
        size:trainingStore.pagination.pageSize,
        params:{xm2er:val,rybhnvh:trainingStore.complete.xlry7q2}
      }
      trainingStore.fetchTrainPersons(params);
    } else {
      trainingStore.fetchTrainPersons({  bdid:this.props.treeKey,page:trainingStore.pagination.current,size:trainingStore.pagination.pageSize, params:{rybhnvh:trainingStore.complete.xlry7q2}});
    }

  }
  pageChange = pageNumber => {
    let params = {
      bdid:this.props.treeKey,
      page:pageNumber,
      size:trainingStore.pagination.pageSize,
      params:{rybhnvh:trainingStore.complete.xlry7q2,xm2er:this.state.searchVal}
    }
    trainingStore.fetchTrainPersons(params);
  }
  render() {
    const complete = trainingStore.complete;
    let texts = [
      { title:"训练内容",content:complete.xlnrevk },
      {title:"训练效果",content:complete.xlxg1dq },
      {title:"任务场景",content:complete.rwcjarv },
      {title:"训练质量",content:`${complete.xljdals ? ('训练进度'+complete.xljdals+'%') : ""}  ${complete.bjgljnc ? ('不及格率'+complete.bjgljnc+'%') : ""}  ${complete.yxle7u ? ('优秀率'+complete.yxle7u+'%') : ""}  ${complete.khwcle0j ? ('考核完成率'+complete.khwcle0j+'%') : ""}  ${complete.lhlbis ? ('良好率'+complete.lhlbis+'%') : ""}`},
    ];
    return (
      <VGroup id="training-complete" gap="30px">
        <HGroup gap="20px" verticalAlign="center">
          <span style={{color:"#00f1d6",fontSize:"16px"}}>具体科目:</span>
          <HGroup>
              {trainingStore.jtkm &&  trainingStore.jtkm.map((item,index) => {
              return <Tag color="#108ee9" key={index}>{item}</Tag>
              })}
          </HGroup>
        </HGroup>
        <HGroup gap="60px">
          <HGroup gap="20px" verticalAlign="center">
            <MyIcon type="icon-rili" theme="filled" name="training-complete-tit-ico"/>
            <HGroup gap="10px">
              <span className="training-complete-tit">训练时间:</span>
              <span className="training-complete-content">{complete.xlsj6tp}</span>
            </HGroup>
          </HGroup>
          <HGroup gap="20px" verticalAlign="center">
            <Icon type="clock-circle" theme="filled" className="training-complete-tit-ico"/>
            <HGroup gap="10px">
              <span className="training-complete-tit">训练时段:</span>
            <span className="training-complete-content">{trainingStore.xlsd}</span>
            </HGroup>
          </HGroup>
          <HGroup gap="20px" verticalAlign="center">
            <MyIcon type="icon-weizhi" theme="filled" name="training-complete-tit-ico"/>
            <HGroup gap="10px">
              <span className="training-complete-tit">训练地点:</span>
            <span className="training-complete-content">{complete.xlddsai}</span>
            </HGroup>
          </HGroup>
        </HGroup>
        <VGroup gap="30px">
          <HGroup gap="60px" verticalAlign="center">
            <TitleView title={"参训人员信息"} />
            <Search
              placeholder="搜索姓名"
              onSearch={this.searchTrainPerson}
              style={{ width: 200 }}
            />
          </HGroup>
          <PersonInfoList/>
          <Pagination defaultCurrent={1} showTotal={total => `共 ${total} 人`} total={trainingStore.pagination.total} onChange={this.pageChange} />
        </VGroup>

        {texts.length>0 && texts.map((item,index) => (
          <VGroup key={index}>
            <TitleView title={item.title}/>
            <p className="training-txt">{item.content}</p>
          </VGroup>
        ))}
      </VGroup>
    );
  }
}

function PersonInfoList() {
  return (
    <HGroup gap="20px" className="train-person-container" style={{flexWrap:'wrap',flexShrink: 0}}>
      {trainingStore.trainPersons && trainingStore.trainPersons.map(info => (
        <HGroup gap="10px" key={info.id} verticalAlign="center" style={{padding:"10px 0px"}}>
          <img src={info.ryzp1dr.split(',')[1]} style={{width:'90px'}}/>
          <VGroup>
            <span style={{color:"#00f1d6"}}>{info.xm2er}</span>
            <HGroup gap="5px">
              <span style={{color:"#01a4dd"}}>{info.xb6h6}</span>
              <span style={{color:"#01a4dd"}}>{info.mz32r}</span>
            </HGroup>
          </VGroup>
        </HGroup>
      ))}
    </HGroup>
  );
}

export default TrainingComplete;
