import React, { Component } from 'react'
import { Modal, Button, message } from 'antd'
import { observer } from 'mobx-react'

import WrappedRecordForm from './record-form'

@observer
class AddEquipmentRecord extends Component {
  sumitForm = (e) => {
    const form = this.form;
    const { store, fetchDataSource } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const findlyPic = store.tempPicList.map(v => {
        const content = v.response ? v.response.data : v;
        return content;
      })
      let params = { ...store.equipForm, ...fieldsValue, zbzplqf:findlyPic };
      store.saveOrUpdateEquipmentRecord(params).then(res => {
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
    store.setEquipRecordForm({zbzplqf:[], zyzbdl6: [], tyzbpi5: []});
    this.props.store.equipmentRecordModalChange(false)
  }

  render() {
    const { store } = this.props;
    const { mark } = store.equipForm;
    const title = mark === undefined ? "添加" : mark === 1 ? "修改" : "查看";
    return (
      <Modal
        title={ `装备基本信息${title}`}
        className="equipment-record-addModal"
        width="1020px"
        keyboard={false}
        maskClosable={false}
        visible={store.showEquipmentRecordModal}
        onCancel={this.hiddenEquipmentRecordModal}
        bodyStyle={{background: '#0b1a1f'}}
        destroyOnClose={true}
        footer={
          mark === 2 ? [
            <Button key="cancel" onClick={this.hiddenEquipmentRecordModal}>关闭</Button>
          ] : [
          <Button key="cancel" onClick={this.hiddenEquipmentRecordModal}>取消</Button>,
          <Button key="submit" type="primary" onClick={this.sumitForm}>确认</Button>,
        ]}>
        <WrappedRecordForm store={store} ref={this.saveFormRef} />
      </Modal>
    );
  }
}

export default AddEquipmentRecord;
