import React, { Component } from 'react'
import { Upload, Icon, message } from 'antd';
import '../troops-add.less'
import {HGroup,VGroup } from 'v-block.lite/layout'
import {reaction} from 'mobx'
import TroopStore from "../troops.store";

class VideoUpoladModal extends Component{
   constructor(props){
     super(props)
     this.state={
       videolist:[

       ]
     }
   }

  componentDidMount(){
    reaction(() => [TroopStore.TroopsBack.fjqic],(arr) => {
      let video=[];
      if(arr[0]){
        let tepVideo=arr[0];
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
    })
  }

  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }

  //上传前校验 大小格式
  beforeUpload=(file)=>{
    const isJpgOrPng = file.type === 'video/mp4';
    if (!isJpgOrPng) {
      message.error('只能上传MP4格式的影音');
    }

    return isJpgOrPng
  }

  handleChange = info => {

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }

    if (info.file.status === 'done') {
       let setData=info.file.response;
      this.setState({ loading: false });
       this.setState({
         videolist:[...this.state.videolist,setData.data]
       })
    }
  };
  //返回数据处理
  setVideoList=()=>{
    let tep=[];
    let data=this.state.videolist;
    if(data){
      for(let i=0 ;i<data.length;i++){
        let y=data[i].fileName+','+data[i].filePath;
        tep.push(y);
      }
      return tep
    }


  }

  //展示某一个视频
  showVideoModal=(url)=>{
      this.props.showVideoModal(url)
  }
  //删除某一个视频
  deleteVideo=(items)=>{
   let lis=this.state.videolist;
   if(lis){
     for(let i in lis){
       if(lis[i].fileBs===items.fileBs){
         lis.splice(i,1)
       }
     }
     this.setState({videolist:lis})

   }
  }
  render(){
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传影音</div>
      </div>
    );
    const list=this.state.videolist.map((item,index)=>{
      return(
        <li className="cls-video" key={index}>
          <span className="video-title" onClick={()=>this.showVideoModal(item.filePath)}>{item.fileName}</span>
          <span className="video-delete-btn" ><Icon type="close-circle" onClick={()=>this.deleteVideo(item)}/></span>
        </li>
      )
    })
    return(
      <HGroup>
        <VGroup className="uplodaMenu">
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/api/enemy/troopsinfo/fileUpload"
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
            data={{fileType:4}}
          >
            {uploadButton}
          </Upload>
        </VGroup>
        <VGroup className="video-list">
          {list}
        </VGroup>
      </HGroup>)
  }
}
export default VideoUpoladModal
