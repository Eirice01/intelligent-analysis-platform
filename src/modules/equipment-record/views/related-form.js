import React, { Component } from 'react'
import { Row, Col,InputNumber, Form, Select} from 'antd'
import { observer } from 'mobx-react'

const { Option } = Select;

@observer
class RegistrationForm extends Component {
  state = {zhuangbeidalei: undefined, zhuangbeixiaolei: undefined };

  handleSelectChange = (type, value) => {
    const { store } = this.props;
    const bdid = store.treeNodeInfo.key;
    if(type === 'zhuangbeidalei') {
      store.getDictions(value).then(res => {
        let firstValue = store.smallCategory[0]['value'];
        this.props.form.setFieldsValue({ zhuangbeixiaolei: firstValue })
        this.setState({zhuangbeidalei: value, zhuangbeixiaolei: firstValue}, () => {
          store.fetchEquipList({...this.state, bdid }).then(res => {
            if(!store.equipList.length) return this.props.form.setFieldsValue({ zhuangbei_id: '' })
          })
        })
      })
    }else if(type === 'zhuangbeixiaolei') {
      const { zhuangbeidalei } = this.state;
      store.fetchEquipList({zhuangbeidalei, zhuangbeixiaolei: value, bdid})
    }
  }

  renderOptions = (category) => category.map(item => <Option key={item.value}>{item.name}</Option>)

  render() {
    const { getFieldDecorator } = this.props.form;
    const { relatedForm, bigCategory, smallCategory, equipList} = this.props.store;
    const idEdit = relatedForm.idEdit || false;
    return (

    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} onSubmit={() => this.sumitForm(this.props)} labelAlign="left">
      <Row>
        <Col span={12}>
          <Form.Item label="装备类型(大类)">
            {getFieldDecorator('zhuangbeidalei',{ rules: [ { required: true, message: '请选择装备大类'}], initialValue: relatedForm['zhuangbeidalei'] })(
              <Select placeholder="请选择" disabled={idEdit} onChange={(value) => this.handleSelectChange('zhuangbeidalei', value)}>
              { this.renderOptions(bigCategory) }
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="装备类型(小类)">
            {getFieldDecorator('zhuangbeixiaolei', { rules: [ { required: true, message: '请选择装备类型小类'}], initialValue: relatedForm['zhuangbeixiaolei'] })(
              <Select placeholder="请选择" disabled={idEdit} onChange={(value) => this.handleSelectChange('zhuangbeixiaolei', value)}>
              { this.renderOptions(smallCategory) }
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="装备名称">
            {getFieldDecorator('zhuangbei_id', { rules: [ { required: true, message: '请选择装备名称'}], initialValue: relatedForm['zhuangbei_id'] })(
              <Select placeholder="请选择" disabled={idEdit} onChange={(value) => this.handleSelectChange('zhuangbei_id', value)}>
              { this.renderOptions(equipList) }
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="数量">
            {getFieldDecorator('num', {rules: [ { required: true, message: '请选择装备数量'}], initialValue: relatedForm['num']})( <InputNumber min={0} style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
    )
  }
}

export default Form.create({ name: 'register' })(RegistrationForm);
