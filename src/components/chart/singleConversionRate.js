import * as React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core'

import echarts from './echarts'
echarts.registerTheme('my_theme', { background: '#001721'});

export default class SingleConversionRateChart extends React.Component {
  constructor(props) {
    super(props)
  }
  rateOption = () => {
    const { name, value, colors, totalValue } = this.props.data;
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
        color: colors[0],
        textAlign: 'center',
      }
    } : null;

    let option = {
      backgroundColor:'transparent',
      title,
      tooltip: !showToolTip ? null : { confine:true, formatter: (data, e, a) => toolTipName},
      series:{
        name: name,
        type: 'pie',
        clockWise: false,
        radius,
        itemStyle:  {
          normal: {
            color: colors[0],
            shadowColor: colors[0],
            shadowBlur: 0,
            label: { show: false },
            labelLine: { show: false }
          }
        },
        top: '10px',
        hoverAnimation: false,
        center: title ? ['50%', '35%'] : ['50%', '50%'],
        data: [{
            value: value,
            label: {
                normal: {
                    formatter: function(params){
                      return parseInt((value * 100) / totalValue, 10) + '%';
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                        fontSize: '14',
                        fontWeight: 'bold',
                        color: colors[0]
                    }
                }
            },
        }, {
            value: totalValue - value,
            name: 'invisible',
            itemStyle: {
                normal: {
                    color: colors[1]
                },
                emphasis: {
                    color: colors[1]
                }
            }
        }]
      }
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
        style={{ height, width, background: '#001721'}}
        onChartReady={this.onChartReadyCallback}
        onEvents={EventsDict}/>
    )
  }
}
