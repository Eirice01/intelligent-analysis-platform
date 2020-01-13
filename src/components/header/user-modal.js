import React, { Component } from 'react'
import {VGroup } from 'v-block.lite/layout'
import {Modal,Form,Input,Row,Col,Button,message} from 'antd'
import Store from '@modules/user-manage/user-manage.store'
class UpdateModal extends Component{
    constructor(props){
      super(props)
      this.state={
        isShow:false,
        newPwd:"",
        confirmPwd:""
      }
    }
  oldPsdValidate =(rule,value,callback) => { //验证旧密码是否存在
      let {id} = JSON.parse(window.sessionStorage.getItem("userInfo"));
      Store.matchesPasswordModal({id,password:value.trim()}).then(res => {
          res.data?callback():callback("旧密码错误");
      })
  }
  newPsdValidate= async (rule,value,callback) => { //dicName 
      await this.setState({
        newPwd:value.trim()
      })
      callback();
  }
  confirmPsdValidate = async (rule,value,callback) => { //dicName 
       await this.setState({
        confirmPwd:value.trim()
      })
      let {confirmPwd,newPwd} = this.state;
      confirmPwd == newPwd ? callback():callback("确认密码与新密码不符");
  }
  handleAddSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
            if(!err){
              let {id} = JSON.parse(window.sessionStorage.getItem("userInfo"));
               Store.updatePsdModal({id,...values}).then(res => {
                 if(res.statusCode == 200){
                  this.props.updatePwd(false)
                   message.success(res.message)
                 }else{
                   message.error(res.message)
                 }
               })
            }
        })
  }
  render(){
    const {getFieldDecorator} = this.props.form;
    return(
      <div>
        <Modal
          title="修改密码"
          visible={this.props.isShow}
          onCancel={() => this.props.updatePwd(false)}
          destroyOnClose={true}
          footer={null}
          width={600}
          style={{top:100}}
        >
          <VGroup horizontalAlign="center">
              <Form className="update-form" layout='inline' onSubmit={this.handleAddSubmit}>
              <Row>
                <Col>
                    <Form.Item label="旧密码" >
                      {
                      getFieldDecorator('oldPsd',{
                        rules:[{required:true,message:"旧密码不能为空"},{validator:this.oldPsdValidate}],
                        validateTrigger:"onBlur"
                      })(<Input.Password placeholder="请输入旧密码" style={{width:'300px'}} />)
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                    <Form.Item label="新密码" >
                      {
                      getFieldDecorator('newPsd',{
                        rules:[{required:true,message:"新密码不能为空"},{validator:this.newPsdValidate}],
                        validateTrigger:"onBlur"
                      })(<Input.Password placeholder="请输入新密码" style={{width:'300px'}} />)
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                    <Form.Item label="确认密码" >
                      {
                      getFieldDecorator('confirmPsd',{
                        rules:[{required:true,message:"确认密码不能为空"},{validator:this.confirmPsdValidate}],
                        validateTrigger:"onBlur"
                      })(<Input.Password placeholder="请输入确认密码" style={{width:'300px'}} />)
                    }
                  </Form.Item>
                </Col>
              </Row>
            <Row style={{marginTop:'10px',textAlign:"center"}}>
                <Col>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" style={{marginRight:"15px",marginLeft:"120px"}} >提交</Button>
                      <Button type="default" onClick={() => this.props.updatePwd(false)} >取消</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
          </VGroup>
        </Modal>
      </div>)
  }
}
const UpdateModalForm = Form.create({name:'add'})(UpdateModal)
export default UpdateModalForm
