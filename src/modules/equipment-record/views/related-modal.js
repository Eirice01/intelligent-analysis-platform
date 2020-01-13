import React, { Component } from 'react'
import { Modal, message } from 'antd'
import { observer } from 'mobx-react'

import WrappedRelatedForm from './related-form'

@observer
class AddEquipmentRecord extends Component {
  sumitForm = (e) => {
    const form = this.form;
    const { store, fetchDataSource } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let params = {...fieldsValue, key: store.treeNodeInfo.key,id: store.relatedForm.id || ''};
      store.saveOrUpdateForm_byArmy(params).then(res => {
        this.form.resetFields();
        this.hiddenEquipmentRecordModal();
        fetchDataSource();        
        message.success(res.message)
      })
    });
  }

  saveFormRef = (form) => this.form = form

  hiddenEquipmentRecordModal = () => {
    const { store } = this.props;
    store.setEquipmentRelatedInfo({});   
    this.props.store.equipmentRelatedModalChange(false)
  }

  render() {
    const { store } = this.props;
    return (
      <Modal
        title="装备基本信息添加"
        className="equipment-record-addModal"
        width="1020px"
        bodyStyle={{background: '#0b1a1f'}}
        visible={store.showEquipmentRelatedModal}
        onCancel={this.hiddenEquipmentRecordModal}
        onOk={this.sumitForm}
        destroyOnClose={true}
        cancelText="取消"
        okText="确认">
        <WrappedRelatedForm store={store} ref={this.saveFormRef} />
      </Modal>
    );
  }
}

export default AddEquipmentRecord;
