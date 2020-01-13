import React,{Component} from 'react'
import {Modal} from 'antd'
import '../troops-add.less'
export default class VideoModals extends Component{
  constructor(props){
    super(props)
    this.state={
      Isvisible:false,
      setUrl:""
    }
  }


  OnokModal=(url)=>{
    this.setState({Isvisible:true})
    this.setState({setUrl:url})
  }
  OnCancel=()=>{
    this.setState({Isvisible:false})
    this.setState({setUrl:""})
  }
  render(){
    return(<div id="modal-cls">
        <Modal
          title="影音预览"
          visible={this.state.Isvisible}
          onOk={this.OnokModal}
          onCancel={this.OnCancel}
          footer={null}
          width={800}
          style={{top:200}}
        >
         <div className="video-mian-info">
           <video src={this.state.setUrl} controls width="600px" height="300px" muted className="cls-video-info"></video>
         </div>
        </Modal>
      </div>
    )
  }
}
