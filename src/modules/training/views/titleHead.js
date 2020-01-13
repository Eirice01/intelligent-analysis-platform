import React, { Component } from "react";
import { HGroup } from "v-block.lite/layout";
import { DatePicker} from "antd";
import moment from 'moment';
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";
class TitleHead extends Component {
  //改变统计周期
  dateChange = (date,dateStr) => {
    this.props.dateChange(dateStr.join(','));
  }
  render() {
    let startTime = moment().format(dateFormat).split('-')[0] + '-01-01';
    return (
      <HGroup className="training-title" verticalAlign="center" style={{marginBottom:"10px"}}>
        <span style={{ minWidth: "250px" }}>
          {this.props.title}军事训练情况
        </span>
        <HGroup
          verticalAlign="center"
          horizontalAlign="space-between"
          gap="10px"
          style={{ flex: 1 }}
        >
          <HGroup gap="20px" verticalAlign="center">
            <span style={{ color: "#a7a8a9", fontSize: "14px" }}>统计周期</span>
            <RangePicker onChange={this.dateChange} allowClear={false} defaultValue={[moment(startTime, dateFormat), moment()]} style={{width:"250px"}}/>
          </HGroup>
        </HGroup>
      </HGroup>
    );
  }
}

export default TitleHead;
