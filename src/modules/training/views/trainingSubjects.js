import React, { Component } from "react";
import { HGroup, VGroup } from "v-block.lite/layout";
import { MyIcon } from "../../../components/myIcon"
import { observer } from "mobx-react"
import trainingStore from '../training.store'

@observer
class TrainingSubjects extends Component {
    constructor(){
        super();
        this.state = {
            activeIndex:0
        }
    }
    changeSubject = (item,index) => () =>{
        this.setState({activeIndex:index});
        trainingStore.changeActiveSubject(item);
        this.props.subjectChange(item);
    }
    resetActive = () => {
        this.setState({
            activeIndex:0
        })
    }
    render() {
      return (
          <VGroup horizontalAlign="center" className="training-subjects">
                  <HGroup gap="10px" verticalAlign="center" style={{paddingLeft:"20px",width:'100%'}}>
                      <MyIcon type="icon-kemu" name="subjects-title-icon"/>
                      <span className="subjects-title">训练科目</span>
                  </HGroup>
                  {trainingStore.subjectsStatistics && trainingStore.subjectsStatistics.map((item,index) => {
                      return (
                         <VGroup key={item.key} className={`subject-item${this.state.activeIndex == index ? ' subject-item-active' : ''}`} horizontalAlign="center" gap="20px" onClick={this.changeSubject(item,index)}>
                              <MyIcon type={this.state.activeIndex == index ? `icon-691xunlian` :`icon-chakanxiangqing`} name="subjects-title-icon"/>
                              <span className="subjects-item-title">{item.name}({item.count})</span>
                         </VGroup> 
                      )
                  })}
          </VGroup>
      );
    }
  }

  export default TrainingSubjects;