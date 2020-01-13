import React, { Component } from 'react'
import { Upload, Icon, Modal , message} from 'antd'

function getUrlBase64(url, ext, callback) {
  var canvas = document.createElement("canvas");   //创建canvas DOM元素
  var ctx = canvas.getContext("2d");
  var img = new Image;
  img.crossOrigin = 'Anonymous';
  img.src = url;
  img.onload = function () {
    canvas.height = 60; //指定画板的高度,自定义
    canvas.width = 85; //指定画板的宽度，自定义
    ctx.drawImage(img, 0, 0, 60, 85); //参数可自定义
    var dataURL = canvas.toDataURL("image/" + ext);
    callback.call(this, dataURL); //回掉函数获取Base64编码
    canvas = null;
  };
}

class PicturesWall extends Component {
  state = { previewVisible: false, previewImage: '', fileList: [] };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    const { url, name } = file;
    const ext = name && name.substring(name.length-4);
    getUrlBase64(url, ext, (base64) => this.setState({ previewImage: base64, previewVisible: true }));
  };

  //上传前校验 大小格式
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传类型为jpeg或png的图片!');
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('图片的大小不能超过20MB!');
    }
    return isJpgOrPng && isLt20M;
  }

  handleUploadChange = ({fileList}) => {
    const { store } = this.props;
    this.setState({ fileList }, () => store.setUploadTempPicList(this.state.fileList))
  }

  handleRemove = file => {
    const { store } = this.props;
    const { fileList } = this.state;
    console.log('file', file)
    // 包含 response \ 包含 response
    const noResponseFileList = fileList.filter(v => !v.response);
    const hasResponseFileList = fileList.filter(v => v.response);
    let tmp, laveFile;
    if(file.response) {
      tmp = hasResponseFileList.filter(v => v.name !== file.name);
      laveFile = [...noResponseFileList, ...tmp];
    }else {
      tmp = noResponseFileList.filter(v => v.fileBs !== file.fileBs);
      laveFile = [...hasResponseFileList, ...tmp];
    }
    this.setState({fileList: laveFile}, () => store.setUploadPicture([...laveFile]))
    return true;
  }

  componentDidMount() {
    const { fileList } = this.props;
    this.setState({fileList})
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { store } = this.props;
    const { mark } = store.equipForm;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">文件上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/api/equipment/fileUpload"
          listType="picture-card"
          className="upload-list-inline"
          multiple
          fileList={fileList}
          showUploadList={{showPreviewIcon:false, showRemoveIcon: mark === 2 ? false : true}}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleUploadChange}
          onRemove={this.handleRemove}
          data={{ fileType:2 }}
        >
          { (fileList.length >= 8 || mark === 2) ? null : uploadButton }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default PicturesWall;
