import React, { Component } from 'react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { Modal, Icon} from 'antd'

const paddingLeft = {  paddingLeft: '10px' };

@observer
class RenderPersonSummary extends Component {
  render() {
    const { personSummary } = this.props;
    const {ryzp1dr, xm2er,zw75d, xb6h6, csnyfme, xlszmk9, tcdcc, zzmmsbm, rwsjrok, homeAddress} = personSummary;
    let imageSrc = ryzp1dr ? ryzp1dr.split(',')[1] : '';
    return (
      <HGroup className="content" horizontalAlign="flex-start" width="100%" padding="5px 0 0 0">
        <HGroup className="imgBox">
          <img with="100%" height="100%" src={imageSrc}/>
        </HGroup>
        <VGroup className="describe" verticalAlign="center" padding="0 0 0 20px">
          <HGroup className="person-name-rank"><b>{xm2er}</b><b style={paddingLeft}>{zw75d}</b></HGroup>
          <HGroup horizontalAlign="space-around">
            <HGroup>性别：{xb6h6}</HGroup>
            <HGroup style={paddingLeft}>出生年月：{csnyfme}</HGroup>
            <HGroup style={paddingLeft}>特长：{tcdcc}</HGroup>
            <HGroup style={paddingLeft}>心理素质：{xlszmk9}</HGroup>
          </HGroup>
          <HGroup>
            <HGroup>政治面貌：{zzmmsbm}</HGroup>
            <HGroup style={paddingLeft}>入伍时间：{rwsjrok}</HGroup>
            <HGroup style={paddingLeft}>家庭住址：{homeAddress}</HGroup>
          </HGroup>
        </VGroup>
      </HGroup>
    )
  }
}

@observer
class RenderSpecificContent extends Component {
  render() {
    // 组装数据格式
    const { grllm7c, jtbj4vg, shgxf5n, zjxy9qf} = this.props.personSummary;
    const specificContent = [
      {title: '个人履历', content: grllm7c },
      {title: '家庭背景', content: jtbj4vg },
      {title: '社会关系', content: shgxf5n },
      {title: '宗教信仰', content: zjxy9qf }
    ];
    return (
      <>
        {specificContent && specificContent.map(item => (
          <VGroup key={item.title} className="specific-content-item" horizontalAlign="center">
            <HGroup horizontalAlign="center" padding="0 10px 10px 0">
              <Icon type="container" style={{ fontSize: '16px', color: '#08c', lineHeight: '24px', paddingRight: '10px'}}/>{item.title}
            </HGroup>
            <HGroup className="content" width="100%" padding="5px">{item.content}</HGroup>
          </VGroup>
        ))}
      </>
    )
  }
}

@observer
class PersonDetail extends Component {
  hiddenPersonDetailsModal = () => {
    this.props.store.personDetailModalChange(false)
  }
  render() {
    const { store } = this.props;
    return (
      <Modal
        title="人员详细信息"
        className="personDetailModal"
        width="1020px"
        visible={store.personDetailModal}
        footer={null} onCancel={this.hiddenPersonDetailsModal}>
        <VGroup>
          <RenderPersonSummary personSummary={ store.peopleDetails }/>
          <HGroup className="person-specific-content" horizontalAlign="flex-start" width="100%" padding="10px 0 10px 0" flex>
            <RenderSpecificContent personSummary={store.peopleDetails}/>
          </HGroup>
        </VGroup>
      </Modal>
    );
  }
}

export default PersonDetail;

