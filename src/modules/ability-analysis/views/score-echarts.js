import { Component } from "react";
import echarts from '@components/chart/echarts'

import Store from '../ability-analysis.store'
 class ScoreEcharts extends Component{
    constructor(props){
        super(props)
       this.state= {}
    }
    render(){
        return null
    }
    shouldComponentUpdate(nextProps){
        this.echartsParams(nextProps);
        return true;
    }
    componentDidMount() {
        this.echartsParams(this.props);
    }
    echartsParams = (props) => {
        let {yValue, xLabel,}= props.scoreEchartsData;
        if(yValue[0] == 0){
           yValue = yValue.reverse();
           xLabel = xLabel.reverse()
        }
        const maxData = Math.max(...yValue);
        let maxArr = [];
        maxArr = Array.apply(null,Array(yValue.length)).map(() => maxData)
        const domId=props.domId;
        this.initEcharts(yValue, xLabel,maxArr,domId);
    }
  //折线图实例化方法
  initEcharts=(yValue, xLabel,maxArr,domId)=>{
    let myChart = echarts.init(document.getElementById(domId));
    let colorList = ['#1f8efa'];
    myChart.setOption({
        // backgroundColor: '#000',
        color: colorList,
        grid:{
            left:"3%",
            right:"3%"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter:(params) => {
                return `${params[0].name.split(",")[0]}<br><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:rgb(67,144,220);margin-right:10px;"></span>${params[0].value}`
            }
        },
        xAxis: [{
            type: 'category',
           // data: ['数据一', '数据二', '数据三', '数据四', '数据五', '数据六'],
            data:xLabel,
            axisTick: {
                show: false,
                alignWithLabel: true
            },
            axisLine: {
                lineStyle: {
                    color: '#132C57'
                }
            },
            axisLabel: {
                color: '#fff',
                formatter:(params) => {
                    return params.split(",")[0]
                }
            },
        }],
        yAxis: {
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                color: '#fff'
            }
        },
        series: [{
                tooltip: {
                    show: false
                },
                name: 'bg',
                type: 'pictorialBar',
                barWidth: '50%',
                silent: true,
                symbol: 'roundRect',
                symbolRepeat: true,
                symbolMargin: 2,
                symbolSize: [36, 6],
                itemStyle: {
                    color: '#0B4B57'
                },
               //data: [390, 390, 390, 390, 390, 390]
               data:maxArr
            },
            {
                tooltip: {
                    show: false,
                    // formatter:(params) => {
                    //     return `${params[0].name.split(",")[0]}<br><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:rgb(67,144,220);margin-right:10px;"></span>${params[0].value}`
                    // }
                },
                type: 'pictorialBar',
                animation: true,
                animationDuration: 600,
                symbol: 'roundRect',
                symbolRepeat: true,
                symbolSize: [36, 6],
                symbolMargin: 2,
                barWidth: '50%',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return colorList[params.dataIndex]
                        },
                        label: {
                           // position:'right',
                            show: true
                        }
                    }
                },
                //data: [10, 52, 200, 334, 390, 330]
                data:yValue
            }]
    })
    myChart.off('click');
    myChart.on('click', params =>{
        Store.chartData = params;
        this.props.scoreClick()
    });
   // this.setState({myChart})
    window.addEventListener('resize',() => myChart.resize())
  }
}
export default ScoreEcharts
