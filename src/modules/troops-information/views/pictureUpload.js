import React, { Component } from 'react'
import { Upload, Icon, message } from 'antd';
import {reaction} from 'mobx'
import '../troops-add.less'
import TroopStore from "../troops.store";
class PicturUpload extends Component{
  state = {
    loading: false,
    imageUrl:"",
    setFileData:{}
  };

  componentDidMount(){
    reaction(() => [TroopStore.TroopsBack.tp3oi],(arr) => {
      if(arr[0]){
        let sc=arr[0].split(",")
        this.setState({imageUrl:sc[1]})
      }
     })
  }

  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }

  //上传前校验 大小格式
  beforeUpload=(file)=>{
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

   handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let data=info.file.response;
      let set=data.data;
      let tep=set.fileName+","+set.filePath;
      this.setState({setPic:tep})
      this.setState({setFileData:data.data})
      this.setState({
        imageUrl:set.filePath,
        loading: false,
      })
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/enemy/troopsinfo/fileUpload"
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
        data={{fileType:2}}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}
export default PicturUpload
