import echarts from '@components/chart/echarts'
import 'echarts-liquidfill';
function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if(regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

export function  intCpuMap (dom,value) {
  let cup=echarts.init(document.getElementById(dom));
  const data=[];
  let c=null;
  let tys=isNumber(value)
  if(tys){
    c=value
  }else {
    c=value;
  }
  data.push(c);
  let option={
    grid:{
      left:'10%'
    },
    title:{
      textStyle:{
        fontWeight:'normal',
        fontSize:'10',
        color:'#d4fffe'
      }
    },
    series:[
      {
        type:'liquidFill',
        radius:'70%',
        data:data,
        color:['#39fdda','#243b43'],
        shape:"triangle",
        backgroundStyle:{
          shadowColor:"#38f9d7",
          borderWidth:3,
          borderColor:'#212a28',
          color:'#243b43'
        },
        outline:{
          itemStyle:{
            borderColor:'#38f9d7',
            borderWidth:5,
          }
        },
        label:{
          normal:{
            formatter:(params)=>{
              let tys=isNumber(params.value)
              if(tys){
                return (params.value*100).toFixed(2)+`%`
              }else {
                return params.value
              }
            },
            textStyle:{
              fontSize:12,
              color:"#d4fffe"
            }
          }
        }
      },

    ]
  }
  cup.setOption(option,true);
  window.addEventListener("resize", function () {
    cup.resize()
  });

}

