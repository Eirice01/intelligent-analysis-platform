import{ Component } from "react";
import echarts from '@components/chart/echarts'
class RatioEcharts extends Component{
  constructor(props){
    super(props)
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
        const {value,label}=props.ratioEchartsData;
        const domId=props.domId
        this.initEcharts(value,label,domId);
}
  //折线图实例化方法
  initEcharts=(value,label,domId)=>{
    let myChart = echarts.init(document.getElementById(domId));
        myChart.setOption({
            color: ['#33a283'],
            tooltip: {},
            radar: {
                center: ['40%', '50%'],
                name: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitArea: {
                    areaStyle: {
                        color:['transparent']
                    }
                },
                splitLine:{
                    lineStyle:{
                        color:"#096a63",
                        width:2
                    }
                },
                indicator:label
            },
            series: [{
                name: '',
                type: 'radar',
                data: [{
                        areaStyle: {
                            normal: {
                                opacity: 0.3,
                            }
                        },
                        //value: data1[1]
                        value:value
                    }]
            }]
        });
        window.addEventListener('resize',() => myChart.resize())
  }
}
export default RatioEcharts
