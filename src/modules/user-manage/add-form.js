import React, { Component } from 'react'
import Store from './user-manage.store'
import { observer } from 'mobx-react'
import {Row,Col,Form,Input,Button,Icon,Tooltip} from 'antd'

@observer class AddForm extends Component{
    constructor(props){
      super(props)
    }
    componentDidMount() {
      const {setFieldsValue } = this.props.form;
      setFieldsValue({
          userName:!Store.viewFormObj['userName']?'':Store.viewFormObj['userName'],
          password:!Store.viewFormObj['password']?'':Store.viewFormObj['password']&&Store.modalTitle.includes("编辑")?'':Store.viewFormObj['password'],
          fullName:!Store.viewFormObj['fullName']?'':Store.viewFormObj['fullName'],
          department:!Store.viewFormObj['department']?'':Store.viewFormObj['department'],
          role:!Store.viewFormObj['role']?'':Store.viewFormObj['role'],
          telephone:!Store.viewFormObj['telephone']?'':Store.viewFormObj['telephone']
      })
    }
    render(){
      const {getFieldDecorator} = this.props.form;
      return(
        <Form className="user-form" layout='inline' onSubmit={this.props.handleAddSubmit}>
            <Form.Item label="用户名">
                {
                getFieldDecorator('userName',{
                  rules:[{required:true,message:"用户名不能为空"},{validator:this.props.userNameValidate}],
                  validateTrigger:"onBlur"
                })(<Input placeholder="请输入用户名" style={{width:'300px'}} />)
                }
            </Form.Item>
            <Form.Item label="密码">
                {
                getFieldDecorator('password',{})(<Input.Password placeholder="请输入密码" style={{width:'300px'}} />)
                }
                <Tooltip title="默认密码为'123456'">
                    <Icon type="info-circle" style={{cursor:"pointer",color:"#1890ff",marginLeft:"8px",fontSize:"20px",verticalAlign:"text-top"}} />
                </Tooltip>
            </Form.Item>
            <Form.Item label="姓名">
                {
                getFieldDecorator('fullName',{
                rules:[{required:true,message:"姓名不能为空"}]
                })(<Input placeholder="请输入姓名" style={{width:'300px'}} />)
                }
            </Form.Item>
            <Form.Item label="部门">
                {
                getFieldDecorator('department',{})(<Input placeholder="请输入部门"   style={{width:'300px'}} />)
                }
            </Form.Item>
            <Form.Item label="角色">
                {
                getFieldDecorator('role',{})(<Input placeholder="请输入角色"   style={{width:'300px'}} />)
                }
            </Form.Item>
            <Form.Item label="联系方式">
                {
                getFieldDecorator('telephone',{})(<Input placeholder="请输入联系方式"   style={{width:'300px'}} />)
                }
            </Form.Item>
            <Row style={{marginTop:'10px',textAlign:"right"}}>
                <Col>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" style={{marginRight:"8px",marginLeft:'118px'}}>提交</Button>
                      <Button type="default" onClick={this.props.handleAddCancel}>取消</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
      )
    }
}
const WrappedAddForm = Form.create({name:'add'})(AddForm)
export default WrappedAddForm;