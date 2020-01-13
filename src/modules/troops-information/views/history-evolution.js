import React, { Component } from 'react'
import {HGroup,VGroup } from 'v-block.lite/layout'
import { Upload, Icon, message, Input,Button} from 'antd';
import TroopStore from '../troops.store'
import {reaction} from 'mobx'
import '../troops-add.less'
class HistoryLsit extends Component{
  constructor(props){
    super(props)
      this.state={
        hisData:props.addData,
        disabled:false
      }
  }
  deletehistory=(items)=>{
    this.props.deleteHistory(items)
  }
  componentDidMount(){

    if(TroopStore.flag==2){
      this.setState({disabled:true})
    }else {
      this.setState({disabled:false})
    }

  }
  render(){
    const renderHistory=this.props.addData.length!==0?this.props.addData.map((items,index)=>
    {
      return(
        <VGroup className="single-history" key={index}>
        <span className="single-his-text">
          {items.title}
        </span>
          <img className="sing-his-img" src={items.Url}></img>
           <p style={{display:"flex"}} className="his-btn">
             <Button onClick={()=>this.deletehistory(items)} disabled={this.state.disabled}>删除</Button>
           </p>
        </VGroup>
      )
    }):""
    return(
       <>
       {renderHistory}
       </>
      )
  }
}


class HistoryModal extends Component{
   constructor(props){
     super(props)
     this.state={
       loading: false,
       imageUrl:"",
       addData:[],
       disabled:false
     }
   }
  componentDidMount(){
    reaction(() => [ TroopStore.TroopsBack.lsygujo],(arr) => {
      let history=[];
      let tes=arr[0];
      if(arr[0]){
        if(tes.indexOf(";")){
          tes=tes.split(";")
          for (let i=0;i<tes.length;i++){
            history.push({title:tes[i].split(",")[0],Url:tes[i].split(",")[1]})
          }
        }else {
          tes = tes.split(",")
          history.push({title: tes[0], Url: tes[1]})
        }
        this.setState({addData:history})
      }
    })
    if(TroopStore.flag==2){
      this.setState({disabled:true})
    }else {
      this.setState({disabled:false})
    }

  }
  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }


  //上传前校验 大小格式
  historyUpload=(file)=>{
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传类型为jpeg或png的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error('图片的大小不能超过20MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  historyChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let data=info.file.response;
      let set=data.data;
      this.setState({
        imageUrl:set.filePath,
        loading: false,
      })
    }
  };

  deleteHistory=(items)=>{
    let lis=this.state.addData;
    if(lis){
      for(let i in lis){
        if(lis[i].title===items.title){
          lis.splice(i,1)
        }
      }
      this.setState({addData:lis})
    }
  }
  //动态增加历史沿革
  addHistory= async()=>{
   let histitle=this.histitle.state.value;
   let url=this.state.imageUrl;
  await  this.setState({
      addData:[...this.state.addData,{title:histitle,Url:url}]},()=>{this.setState({imageUrl:""})})
  }
  //返回数据处理
  margeHistoryData=()=>{
   let tep=[];
   let data=this.state.addData;
   if(data){
     for(let i=0 ;i<data.length;i++){
       let y=data[i].title+','+data[i].Url;
       tep.push(y);
     }
     return tep
   }
  }
  render(){
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { imageUrl} = this.state;
     return(
       <HGroup>
       <HGroup style={{width:"300px"}} className="cls-up">
         <VGroup className="history-title">
           <HGroup className="pic-t">
             <span> <Input  className="cls-his" ref={(histitle)=>{this.histitle=histitle}}/></span>
           </HGroup>
           <HGroup className="pic-c">
             <Upload
               listType="picture-card"
               className="avatar-uploader"
               showUploadList={false}
               action="/api/enemy/troopsinfo/fileUpload"
               beforeUpload={this.historyUpload}
               onChange={this.historyChange}
               data={{fileType:2}}
             >
               {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
             </Upload>
           </HGroup>
         </VGroup>

         <VGroup className="history-add">
           <Button disabled={this.state.disabled}  style={{marginTop:"15px",background:"#08181c",color:"#fff",borderColor:"#049981"}} onClick={this.addHistory}>+</Button>
         </VGroup>
       </HGroup>
         <div className="history-list-info">
           <HistoryLsit addData={this.state.addData} deleteHistory={this.deleteHistory}/>
         </div>
       </HGroup>)


  }

}
export  default HistoryModal
