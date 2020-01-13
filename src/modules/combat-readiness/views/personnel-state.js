import React, { Component } from 'react'
import {HGroup} from 'v-block.lite/layout'
import '../index.less'
import {intCpuMap} from './echarts-liquidfill'

class SingleCard extends Component{
  constructor(props){
    super(props)
    this.state={
      select:false,
      cardInfo:props.info,
      index:props.index
    }
  }

  //组件dom挂在阶段
  componentDidMount(){
    intCpuMap('des'+this.props.index,this.props.info.value)
  }
  componentDidUpdate(){
    intCpuMap('des'+this.props.index,this.props.info.value)
  }
  render(){
    return(
      <div className="Desingle">
        <div className="single-pic" id={'des'+this.props.index}></div>
        <span className="single-title">{this.props.info.title}</span>
      </div>
    )

  }
}

class SingleCardBoth extends Component{
   constructor(props){
     super(props)
     this.state={
       select:false,
       bothInfo:props.bothInfo,
       bothtitle:props.bothTitle
     }
   }

   renderSmall(bothtitle,bothInfo){
     const smallCell=[];
      for (let i=0;i<bothInfo.length;i++){
        const item = bothInfo[i];

        smallCell.push(<SingleSmallCard  key={i+5} index={i} info={item} />)
      }
      return (
        <div className="both-single">
          <div className="both-card-info">
            {smallCell}
          </div>
          <span className="single-title">{bothtitle}</span>
        </div>
      )
   }
  render(){
    return(
      <>
      {this.renderSmall(this.props.bothTitle,this.props.bothInfo)}
      </>
    )
  }
}

class SingleSmallCard extends Component{
  constructor(props){
    super(props)
    this.state={
      select:false,
      Info:props.info,
      index:props.index
    }
  }
  组件dom挂在阶段
  componentDidMount(){
    intCpuMap('smal'+this.props.index,this.props.info.value)
  }
  componentDidUpdate(){
    intCpuMap('smal'+this.props.index,this.props.info.value)
  }

  render(){
    return(
      <div className="cls-small">
        <div className="SmallCard-pic" id={'smal'+this.props.index}></div>
        <span className="SmallCard-title">{this.props.info.title}</span>
      </div>
    )

  }

}

class SingleCardBothZw extends Component{
  constructor(props){
    super(props)
    this.state={
      select:false,
      bothInfo:props.bothInfo,
      bothtitle:props.bothTitle
    }
  }

  renderSmall(bothtitle,bothInfo){
    const smallCell=[];
    for (let i=0;i<bothInfo.length;i++){
      const item = bothInfo[i];
      smallCell.push(<SingleSmallCardZw key={i+5} index={i} info={item} />)
    }
    return (
      <div className="both-single">
        <div className="both-card-info">
          {smallCell}
        </div>
        <span className="single-title">{bothtitle}</span>
      </div>
    )
  }
  render(){
    return(
      <>
      {this.renderSmall(this.props.bothTitle,this.props.bothInfo)}
      </>
    )
  }
}
class SingleSmallCardZw extends Component{
  constructor(props){
    super(props)
    this.state={
      select:false,
      Info:props.info,
      index:props.index
    }
  }
  组件dom挂在阶段
  componentDidMount(){
    intCpuMap('zw'+this.props.index,this.props.info.value)
  }
  componentDidUpdate(){
    intCpuMap('zw'+this.props.index,this.props.info.value)
  }

  render(){
    return(
      <div className="cls-small">
        <div className="SmallCard-pic" id={'zw'+this.props.index}></div>
        <span className="SmallCard-title">{this.props.info.title}</span>
      </div>
    )

  }

}
export default class PersonSate extends Component{
     constructor(props){
       super(props)
       this.state={

       }
     }
     renderCell=(data)=>{
       const {title,list}=data;
       const cells = [];
       const width=310*list.length +'px'
       for(let i = 0; i  < list.length; i++) {
         const item = list[i];
         cells.push(<SingleCard info={item} index={i} key={i}/>)
       }
       if(data.zwlv){
         const {titles,bothlist}=data.zwlv;
         let u=0;
         cells.push(<SingleCardBothZw  key={u-1} bothInfo={bothlist} bothTitle={titles}/>)
       }
       if(data.competent){
         const {titles,bothlist}=data.competent;
         let u=0;
         cells.push(<SingleCardBoth  key={u+4} bothInfo={bothlist} bothTitle={titles}/>)
       }
       return (
         <div style={{height:"100%", width:width, padding:"5px 0px 0px 20px"}}   className="row-find-card">
           <HGroup className="cls-title">
             <span className="cls-row-title">{title}</span>
           </HGroup>
           <HGroup style={{width:"100%",height:"calc(100% - 40px)",marginTop:"5px"}}>
             { cells }
           </HGroup>
         </div>
       )

     }

   render(){
     const data=this.props.personinfo;
     return(
       <HGroup style={{height:"32%",margin:"10px 0px",width:"100%"}}>
         {data&&this.renderCell(data)}
       </HGroup>)
   }
}
