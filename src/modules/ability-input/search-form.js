import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {Button,Form,Input,DatePicker} from 'antd'
@observer class SearchForm extends Component{
    constructor(props){
      super(props)
    }
    render(){
      const {getFieldDecorator} = this.props.form;
      const {customColumnVos,handleSearchReset,handleSearchSubmit } = this.props;
      return(
        <Form layout="inline" onSubmit={handleSearchSubmit} >
            {
                customColumnVos.map(item => { 
                    return (
                        item.isSearch == 1 && item.columnName != 'cjbdbhikd' ?
                        <Form.Item key={item.columnName} label={item.clnComments} >
                            {
                                getFieldDecorator(item.columnName,{})( item.columnType=='text'?  
                                <Input.TextArea rows={3} placeholder={'请输入'+item.clnComments} /> :item.clnComments.includes('时间')?
                                <DatePicker.RangePicker placeholder={'请选择'+item.clnComments}  /> :<Input placeholder={'请输入'+item.clnComments} />
                                )
                            }
                        </Form.Item> : null
                    )
                 })
            }
            <Form.Item >
                <Button type="primary" htmlType="submit" style={{marginRight:"8px",marginLeft:'30px'}}>查询</Button>
                <Button type="default" onClick={handleSearchReset}>重置</Button>
            </Form.Item>
        </Form>
      )
    }
}
const WrappedSearchForm = Form.create({name:'searh'})(SearchForm)
export default WrappedSearchForm;