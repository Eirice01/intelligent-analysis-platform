import React, { Component } from 'react'
import Store from './dictionary-manage.store'
import { observer } from 'mobx-react'
import {Row,Col,Form,Input,Button} from 'antd'

@observer class AddForm extends Component{
    constructor(props){
      super(props)
    }
    componentDidMount() {
      const {setFieldsValue } = this.props.form;
      setFieldsValue({
          dicName:!Store.viewFormObj['dicName']?'':Store.viewFormObj['dicName'],
          dicValue:!Store.viewFormObj['dicValue']?'':Store.viewFormObj['dicValue'],
          dicDesc:!Store.viewFormObj['dicDesc']?'':Store.viewFormObj['dicDesc']
      })
    }
    render(){
      const {getFieldDecorator} = this.props.form;
      return(
        <Form className="dictionary-form" layout='inline' onSubmit={this.props.handleAddSubmit}>
            <Form.Item label="名称">
                {
                getFieldDecorator('dicName',{
                  rules:[{required:true,message:"名称不能为空"},{validator:this.props.dictionaryNameValidate}],
                  validateTrigger:"onBlur"
                })(<Input placeholder="请输入名称" style={{width:'300px'}} />)
                }
            </Form.Item>
            <Form.Item label="值">
                {
                getFieldDecorator('dicValue',{
                  rules:[{required:true,message:"值不能为空"},{validator:this.props.dictionaryValueValidate}],
                  validateTrigger:"onBlur"
                })(<Input placeholder="请输入值" style={{width:'300px'}} />)
                }
            </Form.Item>
            <Form.Item label="备注">
                {getFieldDecorator('dicDesc',{})(<Input placeholder="请输入备注"   style={{width:'300px'}} />)}
            </Form.Item>
            <Row style={{textAlign:"center",marginRight:"80px"}}>
                <Col>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" style={{marginRight:"8px",marginLeft:'130px'}}>提交</Button>
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