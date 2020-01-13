import React, { Component } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'

import echarts from './echarts'
echarts.registerTheme('my_theme', { background: '#001721'});

export default class RadarChart extends Component {

  rateOption = () => {
    const { label, value } = this.props.data;
    const center = this.props.center || ['40%', '50%'];

    let option = {
      tooltip:{  confine:true, transitionDuration:0},
      backgroundColor: 'transparent',
      color: ['#33a283'],
      calculable: true,
      radar: {
        center,
        name: {
          textStyle: { color: '#fff' }
        },
        splitArea: {
          areaStyle: {
            color:['transparent']
          }
        },
        splitLine:{
          lineStyle:{ color:"#096a63", width:2 }
        },
        indicator: label,
        symbolRotate:90
      },
      series: [{
        name: '',
        type: 'radar',
        data: [{
          areaStyle: { normal: { opacity: 0.3 } },
          value: value
        }]
      }]
    }
    return option;
  }

  onChartReadyCallback = () => {
    console.log('onChartReady')
  }

  onChartClick = () => {
    console.log('chart click')
  }

  onChartLegendselectchanged = () => {
    console.log('onChartLegendselectchanged')
  }

  render() {
    let EventsDict = {
      'click': this.onChartClick,
      'legendselectchanged': this.onChartLegendselectchanged
    };
    const width = this.props.width;
    const height = this.props.height;
    return (
      <ReactEchartsCore
        echarts={echarts}
        option={this.rateOption()}
        notMerge={true}
        lazyUpdate={true}
        theme={"my_theme"}
        style={{ height, width ,background: '#001721'}}
        onChartReady={this.onChartReadyCallback}
        onEvents={EventsDict}/>
    )
  }
}
