import React, { Component } from "react";
import { observer } from 'mobx-react';
import { HGroup, VGroup } from "v-block.lite/layout";
import { MyIcon } from '../../../components/myIcon'
import trainingStore from '../training.store'

function formatConsume(data){
  let consumes = [];
  for(let k in data){
    let title;
    let unit;
    let icon;
    switch (k) {
      case "ysjfcue":
        title = "预算经费";
        unit = "万元";
        icon = "icon-qita";
        break;
      case "xljf2cc":
        title = "训练经费";
        unit = "万元";
        icon = "icon-qita";
        break;
      case "dyxhlpd":
        title = "弹药消耗";
        unit = "枚";
        icon="icon-zhadan";
        break;
      case "ylxhqke":
        title = "油料消耗";
        unit = "升";
        icon = "icon-youliao";
        break;
      case "mtxs3ug":
        title = "摩托小时";
        unit = "小时";
        icon = "icon-motuoche";
        break;
      case "fxxs5jm":
        title = "飞行小时";
        unit = "小时";
        icon = "icon-feiji";
        break;
    }
    let arr = data[k].split(';').filter(v => v != '').filter(k => k != ',');
    if(arr.length > 0){
      arr = arr.map(v => {
        let temp = v.split(',');
        return {name:temp[0],value:temp[1]}
      })
    } else {
      arr = null;
      unit = "";
    }
    if(arr){
      consumes.push({
        title,
        // "total":1677,
        unit,
        icon,
        "list":arr
      })
    }
  }
  return consumes;
}
@observer
class TrainingConsume extends Component {
  componentDidMount() {

  }
  render() {
    const consumes = formatConsume(trainingStore.consume);
    return (
      <VGroup id="training-consume" gap="30px">

        <HGroup style={{flexWrap:'wrap'}}>
            {
              consumes.map((item,index) => (
                <ConsumeCard
                  key={index}
                  title={item.title}
                  total={item.total}
                  unit={item.unit}
                  list={item.list}
                  icon={item.icon}
                />
              ))
            }   
        </HGroup>
      </VGroup>
    );
  }
}

function ConsumeCard({ title, total, unit, list , icon }) {
  return (
    <VGroup className="consume-card" style={{margin:'10px',padding: "10px" }}>
      <HGroup horizontalAlign="flex-end">
        {/* <span className="consume-detail">明细详情</span> */}
      </HGroup>
      <HGroup gap="20px" verticalAlign="center">
        <HGroup verticalAlign="center" horizontalAlign="center" style={{ width: "160px", height: "120px" }}>
          <MyIcon type={icon} theme="filled" name="consume-card-icon" />
        </HGroup>
        <VGroup gap="20px">
          <span className="lightblue consume-card-title">{title}</span>
          { <HGroup gap="10px" verticalAlign="center">
            <span className="lightblue consume-card-total">单位:</span>
            <span className="lightblue consume-card-unit">{unit}</span>
            </HGroup> }
        </VGroup>
      </HGroup>

      <HGroup className="consume-card-list">
        {list && list.map((item, index) => (
          <HGroup key={index} style={{width:'50%',lineHeight:'30px',paddingLeft:"10px"}} gap="10px">
            <span>{item.name}:</span>
            <span>{item.value}</span>
          </HGroup>
        ))}
      </HGroup>
    </VGroup>
  );
}
export default TrainingConsume;
