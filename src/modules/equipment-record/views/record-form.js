import React, { Component } from 'react'
import { Row, Col, Input, Form, Select} from 'antd'
import { observer } from 'mobx-react'

import PicturUpload from './upload'
import EditableTagGroup from './dynamic-tag'

const { Option } = Select;

// eslint-disable-next-line no-unused-vars
const presetFields = ['zblxdlm60', 'zblxxl2rv', 'zbmcikf', 'bdbhcp7', 'tyzbpi5', 'zyzbdl6', 'zbzplqf', 'bzktb'];
const hiddenFields = ['id', 'recordingtime'];

@observer
class RegistrationForm extends Component {

  handleSelectChange = (type, value) => {
    console.log('type')
    const { store } = this.props;
    if(type === 'zblxdlm60') {
      store.getDictions(value).then(res => {
        this.props.form.setFieldsValue({ zblxxl2rv: store.smallCategory[0]['value'] })
      })
    }
  }

  selectFieldByCustom = () => {
    const { equipForm, customEquipColumns } = this.props.store;
    let fieldDefinedBySelf = [];
    Object.keys(equipForm).forEach(field => {
      if(hiddenFields.indexOf(field) <= -1) {
        if(presetFields.indexOf(field) <= -1){
          let column = customEquipColumns.filter(k => k.columnName === field);
          console.log('column', column)
          if(column && column.length) {
            let o = { label: column[0]['clnComments'], field };
            fieldDefinedBySelf.push(o);
          }
        }
      }
    })
    return fieldDefinedBySelf;
  }

  renderOptions = (category) => category.map(item => <Option key={item.value}>{item.name}</Option>)

  render() {
    const { store } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { equipForm, bigCategory, smallCategory, equipUnits, tongyongColumn, zhuanyeColumn} = store;
    // 筛选出 用户自定义的字段
    let fieldDefinedBySelf = this.selectFieldByCustom();
    const isDisabled = equipForm.mark === 2 ? true : false;
    const editOrWatch = ([1, 2].indexOf(equipForm.mark) >= 0) ? true : false;

    return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} onSubmit={() => this.sumitForm(this.props)} labelAlign="left">
      <Row>
        <Col span={12}>
          <Form.Item label="装备类型(大类)">
            {getFieldDecorator('zblxdlm60',{ initialValue: equipForm['zblxdlm60'] })(
              <Select placeholder="请选择"  disabled={ editOrWatch } onChange={(value) => this.handleSelectChange('zblxdlm60', value)}>
              { this.renderOptions(bigCategory) }
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="装备类型(小类)">
            {getFieldDecorator('zblxxl2rv', { initialValue: equipForm['zblxxl2rv'] })(
              <Select placeholder="请选择"  disabled={ editOrWatch }  onChange={(value) => this.handleSelectChange('zblxxl2rv', value)}>
              { this.renderOptions(smallCategory) }
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="装备名称">
            {getFieldDecorator('zbmcikf', {
              rules: [ { required: !isDisabled, message: '请输入表名称'}],
              initialValue: equipForm['zbmcikf'],
            })(<Input disabled={isDisabled} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="单位">
            {getFieldDecorator('bdbhcp7', { initialValue: equipForm['bdbhcp7'] })(
              <Select placeholder="请选择" disabled={isDisabled} onChange={(value) => this.handleSelectChange('bdbhcp7', value)}>
              { this.renderOptions(equipUnits) }
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="通用指标" labelCol={{span:3}}>
            <EditableTagGroup tags={ equipForm.tyzbpi5 || []} columns={ tongyongColumn } type="tongyong" store={store} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="专用指标" labelCol={{span:3}}>
            <EditableTagGroup tags={ equipForm.zyzbdl6 || []} columns={ zhuanyeColumn } type="zhuanyong" store={store} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="装备图片" labelCol={{span:3}}>
            <PicturUpload fileList={ equipForm.zbzplqf || []} store={store} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        {
          fieldDefinedBySelf.map(item =>(
            <Col span={12} key={item.label}>
              <Form.Item label={item.label}>
                { getFieldDecorator(item.field, { initialValue: equipForm[item.field] })(<Input disabled={isDisabled}/>) }
              </Form.Item>
            </Col>
          ))
        }
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="备注">
            { getFieldDecorator('bzktb', { initialValue: equipForm['bzktb'] })(<Input disabled={isDisabled}/>) }
          </Form.Item>
        </Col>
      </Row>
    </Form>
    )
  }
}

export default Form.create({ name: 'register' })(RegistrationForm);

