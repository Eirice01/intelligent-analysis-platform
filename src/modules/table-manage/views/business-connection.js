import React, { Component } from 'react'
import { Radio, Modal, message } from 'antd'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'

@observer
class BussinessConnect extends Component {
  state = { code: '' };

  radioChange = e => {
    this.setState({ code: e.target.value});
  };

  sumitForm = (e) => {
    e.preventDefault();
    const { store, record } = this.props;
    store.tableAssociateBusiness({ tableId: record.id, code: this.state.code }).then(res => {
      message.success("关联成功!", {duration: 2});
      store.businessConnectModalChange(false);
    })
  }
  hiddenBusinessConnectModal = () => {
    this.props.store.businessConnectModalChange(false)
  }
  render() {
    const { store, record } = this.props;
    return (
      <Modal
        title="业务关联"
        wrapClassName="businessConnect"
        width="800px"
        visible={store.showBusinessConnectModal}
        onCancel={this.hiddenBusinessConnectModal}
        onOk={this.sumitForm}
        cancelText="取消" okText="确认">
        <HGroup className="title">将【<b style={{color: 'red'}}>{record.tableComments}</b>】与如下业务进行关联：</HGroup>
        <VGroup width="100%">
          <Radio.Group onChange={ this.radioChange } value={ this.state.code }>
            {
              store.businessConnections.map(v => <Radio key={v.key} value={v.key}>{v.value}</Radio>)
            }
          </Radio.Group>
        </VGroup>
      </Modal>
    );
  }
}

export default BussinessConnect;
