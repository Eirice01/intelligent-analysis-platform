import React, {Component} from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'

import echarts from './echarts'
echarts.registerTheme('my_theme', { background: '#001721'});

export default class BasicPicRate extends Component {
  rateOption = () => {
    const { name, value, content } = this.props.data;
    let radius = this.props.radius || [25, 30];
    const {showToolTip, toolTipName} = this.props;

    let title = this.props.showTitle === "true" ? {
      text:name,
      left: '45%',
      top: '80%',
      textAlign: 'center',
      textStyle: {
        fontWeight: 'normal',
        fontSize: '12',
        color: '#389af4',
        textAlign: 'center',
      },
    } : null;

    let option = {
      backgroundColor:'transparent',
      title,
      tooltip: !showToolTip ? null : { confine:true, formatter: (data, e, a) => toolTipName, transitionDuration: 0},
      series: [
        {
          name,
          type:'pie',
          radius,
          avoidLabelOverlap: true,
          hoverAnimation: false,
          data:[{
            value,
            name,
            highlight: true,
            selectMoad: false,
            itemStyle: { color: '#389af4' }
          }],
          label: {
            normal: {
              show: true, position: 'center', color: '#00F1D6',
              formatter: (data) => content
            }
          }
        }
      ]
    }
    return option;
  }

  render() {

    const {width, height} = this.props;
    return (
      <ReactEchartsCore
        echarts={echarts}
        option={this.rateOption()}
        notMerge={true}
        lazyUpdate={true}
        theme={"my_theme"}
        style={{ height, width ,background: '#001721'}}/>
    )
  }
}
