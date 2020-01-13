import React, { Component } from 'react'
import {VGroup,HGroup} from 'v-block.lite/layout'
import './troops-showinformation.less'
import TroopStore from './troops.store'
import { Tag ,Button} from 'antd'
import TroopMap from '@components/map'
class TroopsInformationModal extends Component{
   constructor(props){
     super(props)
     this.state={
       info:{},
       picInfo:"",
       zat:{},
       addData:[],
       videolist:[],
       tags:[],
       activeMark:"",
       coordinates:""
     }
   }

  componentDidMount() {
     if(this.props.history.location.query){
       let id=this.props.history.location.query.Tid;
       if(id){
         this.LookTroopsInfo(id)
       }
     }
  }
  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }
  backHis=()=>{
    let path=this.props.history.location.query.from;
    if(path=="troop"){
     this.props.history.push({pathname:'/entryInfo/troops'})
   }else if(path=="/"){
     this.props.history.push({pathname:'/'})
   }else {
      this.props.history.push({pathname:'/basic-info'})
    }
  }
  //查看部队信息
  async LookTroopsInfo(id){
    await TroopStore.fetchLookTroopInfo(id)
    await this.setState({info:TroopStore.TroopsBack,picInfo:TroopStore.setPic,zat:TroopStore.TroopsBackZat})
    if(TroopStore.TroopsBack.lsygujo){
      let history=[];
      let tes=TroopStore.TroopsBack.lsygujo;
      if(tes.indexOf(";")){
        tes=tes.split(";")
        for (let i=0;i<tes.length;i++){
          history.push({title:tes[i].split(",")[0],Url:tes[i].split(",")[1]})
        }
      }else {
        tes = tes.split(",")
        history.push({title: tes[0], Url: tes[1]})
      }
      this.setState({addData:history},()=>{})
    }
    if(TroopStore.TroopsBack.fjqic){
      let video=[];
      let tepVideo=TroopStore.TroopsBack.fjqic;
      if(tepVideo.indexOf(";")){
        tepVideo=tepVideo.split(";")
        for (let i=0;i<tepVideo.length;i++){
          video.push({fileName:tepVideo[i].split(",")[0],filePath:tepVideo[i].split(",")[1]})
        }
      }else {
        tepVideo = tepVideo.split(",")
        video.push({fileName: tepVideo[0], filePath: tepVideo[1]})
      }
      this.setState({videolist:video})
    }
    if(TroopStore.TroopsBack.bdts9bg){
      let teptag=TroopStore.TroopsBack.bdts9bg!==null?TroopStore.TroopsBack.bdts9bg.split(";"):"";
      this.setState({tags:teptag})
    }
    if(TroopStore.TroopsBack.dlwzMap!=""){
      let data=TroopStore.TroopsBack.dlwzMap
      this.setState({activeMark:data.features[0].properties.name,coordinates:TroopStore.TroopsBack.coordinates})

    }
  }

  render(){
    return(<div style={{width:"1300px",height:"98%",padding:"30px  50px",margin:"15px auto"}} className="info-main-lg">
      <div className="lg-back"> <Button type="primary" onClick={this.backHis}>返回</Button></div>
      <div className="lg-title">{TroopStore.TroopsBack.mc0mx}部队信息详情</div>
       <HGroup style={{width:"100%",height:"300px",marginBottom:"20px"}}>
         <VGroup style={{width:'80%',height:"100%"}}>
           <HGroup style={{height:"30%",marginBottom:"8px"}} className="title-info-lg">
             <p><span className="info-title-lag">所属上级:</span><span style={{fontSize:"16px"}}>{TroopStore.setKey}</span></p>
             <p><span className="info-title-lag">部队名称:</span><span style={{fontSize:"16px"}}>{TroopStore.TroopsBack.mc0mx}</span></p>
             <p><span className="info-title-lag">部队编号:</span><span style={{fontSize:"16px"}}>{TroopStore.TroopsBack.bdbh1vf}</span></p>
             <p><span className="info-title-lag">编制级别:</span><span style={{fontSize:"16px"}}>{TroopStore.TroopsBack.lb1hoValue}</span></p>
           </HGroup>
           <VGroup style={{height:"calc(70% - 8px)"}}>
             <div className="info-title-lag">
               <span className="combat-info-icon"></span>
               <span >部队介绍：</span>
             </div>
             <div className="info-lis">{TroopStore.TroopsBack.bdjsx2b}</div>
           </VGroup>
         </VGroup>
         <VGroup style={{width:"200px",marginLeft:"20px",textAlign:"center"}}>
           {/*<p className="info-title-lag-a">部队图片</p>*/}
           <span className="lg-pic">
              <img src={TroopStore.setPic} alt=""/>
            </span>
         </VGroup>
      </HGroup>
      <VGroup className="his-lg  his-vg">
        <div className="info-title-lag">历史沿革：</div>
         <HGroup className="history-meun">
           {<HistoryLsit  addData={this.state.addData}/>}
         </HGroup>
      </VGroup>
      <VGroup className="his-lg">
        <div className="info-title-lag">使命任务：</div>
        <div className="info-lis">{TroopStore.TroopsBack.smrwnba}</div>
      </VGroup>
      <VGroup className="his-lg  his-lg-v">
        <span className="info-title-lag">影音列表：</span>
        <HGroup className="info-lis">
          {
            this.state.videolist.map((item,index)=>{
             return(<video src={item.filePath}  key={index} controls  muted className="cls-video-info-lg"></video>)
            })
          }
        </HGroup>
      </VGroup>
      <VGroup className="his-lg his-bts">
        <div className="info-title-lag">部队特色：</div>
        <div  style={{display:"flex",alignItems:"center"}} className="info-lis">
          {
            this.state.tags.map((item,index)=>{
              return(<Tag  color="cyan" key={index}>{item}</Tag>)
            })
          }
        </div>
      </VGroup>
      <div style={{marginBottom:"25px"}}>
        <div className="info-title-lag">地理位置：</div>
        <div className="info-lis-lh">
          <p style={{textAlign:'center'}}><span style={{margin:"0px 15px"}}>地理名称：{TroopStore.TroopsBackZat.troopName}</span> <span>经纬度：{TroopStore.TroopsBackZat.troopZat}</span></p>
          <div className="info-map">
            <TroopMap   stations={TroopStore.TroopsBack.dlwzMap}  coordinates={this.state.coordinates}activeMark={this.state.activeMark}/>
          </div>
        </div>
      </div>
    </div>)
  }

}

class HistoryLsit extends Component{
  constructor(props){
    super(props)
    this.state={
      hisData:props.addData,
      disabled:false
    }
  }

  componentDidMount(){
    console.log(this.props.addData)
  }
  render(){
    const renderHistory=this.props.addData.map((items,index)=>
    {
      return(
        <div className="single-history his-sig" key={index}>
        <span className="single-his-text">
          {items.title}
        </span>
          <img className="sing-his-img-lg" src={items.Url}></img>
        </div>
      )
    })
    return(
      <>
      {renderHistory}
      </>
    )
  }
}
export default TroopsInformationModal
