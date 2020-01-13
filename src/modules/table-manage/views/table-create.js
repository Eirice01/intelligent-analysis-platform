
import React, { Component } from 'react'
import { VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Modal,
  message
} from 'antd';
const { Option } = Select;

import { EditableFormTable } from './edited-table'

@observer
class RegistrationForm extends Component {

  handleSelectChange = (type, value) => {
    console.log("type",type);
    console.log("value",value);
  }

  validateToTableComments = (rule, value, cb) => {
    console.log('rule', rule)
    const { store } = this.props;
    if (value) {
      store.tableNameValidate(value).then(res => (res && cb()))
    } else {
      cb();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { businessTypes, editableInfo } = this.props.store;
    return (
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} >
        <Row>
          <Col span={12}>
            <Form.Item label="表名称">
              {getFieldDecorator('tableComments', {
                rules: [
                  { required: true, message: '请输入表名称'},
                  // { validator: this.validateToTableComments }
                ],
                initialValue: editableInfo['tableComments'],
              })(<Input disabled={ editableInfo.id ? true : false } />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="表所属业务">
              {getFieldDecorator('typeValue', {
                initialValue: editableInfo['typeValue'],
              })(
                <Select placeholder="请选择" onChange={(value) => this.handleSelectChange('typeValue', value)}>
                {
                  businessTypes.map(item => <Option key={item.value}>{item.name}</Option>)
                }
                </Select>
              )}
            </Form.Item>
            </Col>
            </Row>
            <Row>
            <Col span={12}>
              <Form.Item label="表描述">
                {getFieldDecorator('tableDesc', { initialValue: editableInfo['tableDesc'] })(<Input />)}
              </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedCreateTableForm = Form.create({ name: 'register' })(RegistrationForm);


@observer
class TableCreate extends Component {
  hiddenAddTableModal = () => {
    const { store } = this.props;
    store.setEditableInfos({});
    store.setEditedColumns([]);
    this.props.store.addTableModalChange(false)
  }

  sumitTableCrateForm = () => {
    const form = this.form;
    const { store, getDataSource } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let customTableVo = { ...store.editableInfo, ...fieldsValue };
      let customColumnVos = [...toJS(store.editableColumns)];
      customColumnVos.forEach(v => {
        v.columnType = store.columnTypes.find(d => d.name === v.columnType)['value'];
        v.isSearch = v.isSearch === '是' ? 1 : 0;
        v.isShow = v.isShow === '是' ? 1 : 0;
      })
      store.createTable({ customTableVo, customColumnVos }).then(res => {
        message.success(res.message || "保存成功")
        store.addTableModalChange(false)
        store.setEditableInfos({});
        store.setEditedColumns([]);
        getDataSource();
      })
    });
  }

  saveFormRef = (form) => this.form = form

  render() {
    const { store } = this.props;
    return (
      <Modal
        title="表创建"
        className="tableCreateModal"
        width="1040px"
        visible={store.showAddTableModal}
        onCancel={this.hiddenAddTableModal}
        onOk={this.sumitTableCrateForm}
        cancelText="取消" okText="确认">
        <VGroup width="100%">
          <WrappedCreateTableForm ref={this.saveFormRef} store={store} />
          <EditableFormTable store={store} />
        </VGroup>
      </Modal>
    );
  }
}

export default TableCreate;
