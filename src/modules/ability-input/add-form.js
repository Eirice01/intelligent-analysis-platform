import React, { Component } from 'react'
import Store from './ability-input.store'
import { observer } from 'mobx-react'
import moment from 'moment'
import {Form,Input,Button,DatePicker,InputNumber} from 'antd'

@observer class AddForm extends Component{
    constructor(props){
      super(props)
    }
    componentDidMount() {
        const {setFieldsValue } = this.props.form;
        setTimeout(() => {
              if(Object.keys(Store.viewFormObj).length == 0){
                setFieldsValue({
                    cjbdbhikd:Store.troopsname
                })
            }else{
                let obj = {};
                Store.capabilityData.customColumnVos.forEach(item => {
                    obj[item.columnName] = Store.viewFormObj[item.columnName]
                })
                obj['hdsju31'] = moment(obj['hdsju31']);
                setFieldsValue({
                    ...obj
                })
            }
        },0)
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const {customColumnVos,handleAddSubmit,handleAddCancel } = this.props;
      return(
        <Form onSubmit={handleAddSubmit} className="ability-add-form">
            {
                customColumnVos.map(item => {
                    return(
                        Store.addDisabled ?
                        <Form.Item key={item.columnName} label={item.clnComments} className="input-view" >
                            {
                                getFieldDecorator(item.columnName,{})(
                                    item.columnType=='text' ?   <Input.TextArea rows={3} disabled style={{resize:"none"}} />:<Input disabled />
                                )
                            }
                        </Form.Item> :
                         <Form.Item key={item.columnName} label={item.clnComments} >
                            {
                                getFieldDecorator(item.columnName,
                                 item.columnName=='cjbdbhikd' || item.columnName=='hdmcc0p' || item.columnName=='hdsju31'? {rules:[{required:true,message:`${item.clnComments}不能为空`}]}: {})( item.clnComments.includes('时间')?
                                <DatePicker placeholder={'请选择'+item.clnComments} /> : item.columnName == "cjbdbhikd"? <Input placeholder={'请输入'+item.clnComments} disabled />:
                                item.columnName == "hdmcc0p"?<Input placeholder={'请输入'+item.clnComments} />: item.columnName == "hdms53s" ?
                                <Input.TextArea rows={3} placeholder={'请输入'+item.clnComments} style={{resize:"none"}} /> : <InputNumber placeholder={'请输入'+item.clnComments+'范围0~100'} min={0} max={100} style={{width:"100%"}} />
                                )
                            }
                        </Form.Item>
                    )
                 })
            }
            <Form.Item >
                {
                    Store.addDisabled?<Button type="default" onClick={handleAddCancel}>关闭</Button>:
                    <>
                        <Button type="primary" htmlType="submit" style={{marginRight:"8px",marginLeft:'30px'}}>提交</Button>
                        <Button type="default" onClick={handleAddCancel}>取消</Button>
                    </>
                }
            </Form.Item>
        </Form>
      )
    }
}
const WrappedAddForm = Form.create({name:'add'})(AddForm)
export default WrappedAddForm;
