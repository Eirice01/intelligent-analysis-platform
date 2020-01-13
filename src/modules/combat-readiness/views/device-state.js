import React, { Component } from 'react'
import {HGroup} from 'v-block.lite/layout'
import '../index.less'
import {intCpuMap} from './echarts-liquidfill'
class SingleCard extends Component{
  constructor(props){
    super(props)
    this.state={
      select:false,

    }
  }

  //组件dom挂在阶段
  componentDidMount(){

    intCpuMap('dev'+this.props.index,this.props.info.value)
  }
  componentDidUpdate(){
    intCpuMap('dev'+this.props.index,this.props.info.value)
  }
  render(){
    return(
      <div className="Desingle">
        <div className="single-pic" id={'dev'+this.props.index}></div>
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

     }
   }

   renderSmall(bothtitle,bothInfo){
     const smallCell=[];
      for (let i=0;i<bothInfo.length;i++){
        const item = bothInfo[i];
        smallCell.push(<SingleSmallCard key={i+5} index={i} info={item} />)
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
    }
  }
  组件dom挂在阶段
  componentDidMount(){
    intCpuMap('sdev'+this.props.index,this.props.info.value)
  }
  componentDidUpdate(){
    intCpuMap('sdev'+this.props.index,this.props.info.value)
  }

  render(){
    return(
      <div className="cls-small">
        <div className="SmallCard-pic" id={'sdev'+this.props.index}></div>
        <span className="SmallCard-title">{this.props.info.title}</span>
      </div>
    )

  }

}

class SingleCardBothDv extends Component{
  constructor(props){
    super(props)
    this.state={
      select:false,
    }
  }

  renderSmall(bothtitle,bothInfo){
    const smallCell=[];
    for (let i=0;i<bothInfo.length;i++){
      let item = bothInfo[i];
      smallCell.push(<SingleSmallCardDv key={i-2} index={i} infos={item} />)
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

class SingleSmallCardDv extends Component{
  constructor(props){
    super(props)
    this.state={
      select:false,
    }
  }
  组件dom挂在阶段
  componentDidMount(){

    intCpuMap('dvv'+this.props.index,this.props.infos.value)
  }
  componentDidUpdate(){
    intCpuMap('dvv'+this.props.index,this.props.infos.value)
  }

  render(){
    return(
      <div className="cls-small">
        <div className="SmallCard-pic" id={'dvv'+this.props.index}></div>
        <span className="SmallCard-title">{this.props.infos.title}</span>
      </div>
    )

  }

}
export default class DeviceSate extends Component{
     constructor(props){
       super(props)
       this.state={

       }
     }
     renderCell=(data)=>{
       const {list}=data;
       const cells = [];
       const width=310*list.length +'px'
       for(let i = 0; i  < list.length; i++) {
         const item = list[i];
         cells.push(<SingleCard info={item} index={i} key={i}/>)
       }
       if(data.ptlv){
         const {titles,bothlist}=data.ptlv
         let u=0;
         cells.push(<SingleCardBothDv  key={u-1} bothInfo={bothlist} bothTitle={titles}/>)
       }
       if(data.reserve){
         const {titles,bothlist}=data.reserve
         let u=0;
         cells.push(<SingleCardBoth  key={u+4} bothInfo={bothlist} bothTitle={titles}/>)
       }
       return (
         <div style={{height:"100%", width:width, padding:"5px 0px 0px 20px"}}   className="row-find-card">

           <HGroup style={{width:"100%",height:"100%",marginTop:"5px"}}>
             { cells }
           </HGroup>
         </div>
       )

     }

   render(){
     const data=this.props.equipment;
     return(
       <HGroup style={{height:"25%",margin:"10px 0px 10px 0px",width:"100%"}}>
         {data&&this.renderCell(data)}
       </HGroup>)
   }
}
