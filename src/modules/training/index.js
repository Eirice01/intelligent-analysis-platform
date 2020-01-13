import React, { Component } from "react";
import "./index.less";
import { HGroup } from "v-block.lite/layout";
import {Radio , Icon} from 'antd'
import { Route } from 'react-router-dom';
import TitleHead from "./views/titleHead";
import TrainingSubjects from './views/trainingSubjects';
import TrainingComplete from './views/trainingComplete';
import TrainingConsume from './views/trainingConsume';
import TreeCard from '@modules/tree'
import trainingStore from './training.store'
import {reaction} from 'mobx'
import moment from 'moment'
const ref = React.createRef();
let end = moment().format("YYYY-MM-DD");
let start = end.split('-')[0]+'-01-01';
class TrainingView extends Component {
  constructor(){
    super();
    this.state = {
      treeKey:null,
      bdbh:null,
      time:`${start},${end}`,
      title:"",
      defaultActive:true,
      showOther:false,
      radioValue:""
    }
  }

  componentDidMount() {
    this.reaction = reaction(() => [trainingStore.trainingDates], (arr) => {
      let data = arr[0];
      if(data[0]){
        this.setState({radioValue:data[0].id});
      }
    })
  }
  componentWillUnmount(){
    this.reaction();
  }
  changeTrainDate = (id) => () => {
    if(id == "other"){
      this.setState({radioValue:id,showOther:true})
    } else {
      this.setState({radioValue:id})
      trainingStore.fetchTrainInfo(id)
    }
  };
  hideOtherAndQuery = id => () => {
    this.setState({showOther:false})
    trainingStore.fetchTrainInfo(id)
  }
  treeSelect = (key,nodeInfo) => {
    const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
    this.setState({treeKey:key[0],title:node.title,bdbh:node.troopsnum},);
    let params = {
      time:this.state.time,
      armyno:node.troopsnum
    }
    trainingStore.fetchSubjectsStatistics(params);
    ref.current.resetActive();
  }
  click = flag => e => {
    this.setState({defaultActive:flag});
  }
  dateChange = (dateStr) => {
    this.setState({time:dateStr});
    let params = {
      time:dateStr,
      armyno:this.state.bdbh
    }
    //请求训练科目
    trainingStore.fetchSubjectsStatistics(params);
    ref.current.resetActive();
  }

  subjectChange = (subject) => {
    trainingStore.fetchSbujectsDates({
      subject:subject.key,
      time:this.state.time,
      armyno:this.state.bdbh
    })
  }

  render() {
    return (
      <HGroup id="training">
        <div className="left-side">
           <TreeCard onSelect={this.treeSelect} selectedKeys={[this.state.treeKey]}/>
        </div>
        <HGroup className="right-side">
            <TrainingSubjects subjectChange={this.subjectChange} ref={ref}/>
            <div className="training-content">
                <TitleHead title={this.state.title} dateChange={this.dateChange}/>
                {
                  trainingStore.trainingDates.length > 0 &&
                  <Radio.Group
                    value={this.state.radioValue}
                    buttonStyle="solid"
                  >
                    {trainingStore.showTrainDates.length>0 && trainingStore.showTrainDates.map(date => (
                      <Radio.Button value={date.id} key={date.id} onClick={this.changeTrainDate(date.id)}>
                        {date.time}
                      </Radio.Button>
                    ))}
                    {trainingStore.hideTrainDates && <Radio.Button value={'other'} onClick={this.changeTrainDate('other')}>...</Radio.Button>}
                  </Radio.Group>
                }
                <div id="other-date-container" className={this.state.showOther ? "show-other-date" : "hide-other-date"}style={{width:`${6*100}px`,height:"500px"}}>
                    <span className="ant-modal-close-x train-close">
                      <Icon type="close" onClick={() => {this.setState({showOther:false})}}/>
                    </span>
                    <Radio.Group buttonStyle="solid">
                      {
                        trainingStore.hideTrainDates && trainingStore.hideTrainDates.map(date => (
                          <Radio.Button key={date.id} onClick={this.hideOtherAndQuery(date.id)}>
                            {date.time}
                          </Radio.Button>
                        ))
                      }
                    </Radio.Group>
                </div>
                <HGroup className="training-tab" verticalAlign="center" gap="20px">
                    <div className={`training-tab-btn${this.state.defaultActive ? ' training-tab-btn-active' : ''}`} onClick={this.click(true)}>训练落实</div>
                    <div className={`training-tab-btn${!this.state.defaultActive ? ' training-tab-btn-active' : ''}`} onClick={this.click(false)}>训练消耗</div>
                </HGroup>
                {
                  this.state.defaultActive ? <TrainingComplete treeKey={this.state.treeKey}/> : <TrainingConsume/>
                }
            </div>
        </HGroup>
      </HGroup>
    );
  }
}


export default TrainingView;
export const TrainingRoute = <Route path="/training" component={TrainingView} exact />
