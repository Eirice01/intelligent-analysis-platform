import  {Component} from "react";
import echarts from '@components/chart/echarts'

class RatioEcharts extends Component {
    constructor(props) {
        super(props)
    }

    render() {
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
        const {seriesData,legendData,label} = props.varietyEchartsData;
        let arr = [];
        if(seriesData.length){
            arr = seriesData[0].map((col,i) => {
                return seriesData.map((row) => {
                    return row[i]
                })
            }) 
        }
        const domId = props.domId;
        this.initEcharts(arr,legendData,label, domId);
    }
    //折线图实例化方法
    initEcharts = (seriesData,legendData,label,domId) => {
        if(label.length == 0){
            label.push("暂无数据")
        }
        let myChart = echarts.init(document.getElementById(domId));
        let colorList=['#fdcb62','#07ef9f','#ff8400', '#d11b16','#6FE81A','#06e1f2'];
        let seriesItem = this.seriesFn(seriesData,legendData,colorList)
        let fontColor = '#30eee9';
        myChart.setOption({
            grid:{
                left: '3%',
                right: '3%',
                top: '18%',
                bottom: '5%',
                containLabel: true
            },
            tooltip:{
                show: true,
                trigger: 'axis'
            },
            legend:{
                show: true,
                x: 'center',
                top: '3%',
                y: '15',
                icon: 'stack',
                itemWidth:20,
                itemHeight:8,
                textStyle: {color: '#fff'},
               // data: ['A能力','B能力','C能力','D能力','E能力','F能力']
               data:legendData
            },
            xAxis:[{
                    type: 'category',
                    //boundaryGap: false,
                    axisLabel: {color: fontColor},
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#397cbc'}
                    },
                    axisTick: {show: true},
                    splitLine: {
                        show: true,
                        lineStyle: {color: '#414950',type: 'dotted'}
                    },
                   // data: ['活动1','活动2','活动3','活动4','活动5','活动6','活动7','活动8','活动9','活动10','活动11','活动12']
                   data:label
                }],
            yAxis:[{type: 'value',
                    name: '能力值',
                    axisLabel: {
                        //formatter: '{value}',
                        textStyle: {color: '#2ad1d2'}
                },
                axisLine: {lineStyle: {color: '#27b4c2'}},
                splitLine: {show: true,lineStyle: {color: '#414950'}}
            }],
            series:seriesItem
        });
        window.addEventListener('resize',() => myChart.resize())
    }
    seriesFn=(seriesData,legendData,colorList) => {
        let seriesArr = [];
        seriesData.forEach((item,index) => {
            let obj = {
                    name:legendData[index],
                    type: 'line',
                   // stack: '总量',
                    symbol: 'emptyCircle',
                    symbolSize: 2,
                    itemStyle: {
                        normal: {
                            color:colorList[index],
                            lineStyle: {color:colorList[index],width: 1},
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                        {offset: 0,color: 'rgba(34,49,48,0.3)'}, 
                                        {offset: 1,color: 'rgba(25,52,55,0.9)'}])
                            }
                        }
                    },
                    data:item
            }
            seriesArr.push(obj)
        })
        return seriesArr;
    }
}
export default RatioEcharts
