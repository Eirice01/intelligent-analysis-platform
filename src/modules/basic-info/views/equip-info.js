import React, { Component } from 'react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { Tag, Radio } from 'antd'

@observer
class EquipmentInfo extends Component {

  renderEquipmentAttributes = (attributes) => {
    return (
      attributes.map(tag => <Tag key={tag.label} style={{ background: 'transparent', borderStyle: 'dashed', color: '#1890ff'}}>{`${tag.name}：${tag.value}${tag.unit}`}</Tag>)
    )
  }

  renderEquipmentItems = (equipmentItems) => {
    const paddingRight = {paddingRight: '10px'};
    return (
      <VGroup className="equipment-items-container">
        {
          equipmentItems.map((item,idx) => (
            <HGroup key={idx} className="content" horizontalAlign="flex-start" width="100%" padding="5px 0 0 0" flex>
              <HGroup className="imgBox" width="95px">
                <img height="100%" width="100%" src={item.pic}/>
              </HGroup>
              <HGroup horizontalAlign="center" verticalAlign="center" width="200px" height="94px">{item.name}</HGroup>
              <HGroup horizontalAlign="center" verticalAlign="center" width="100px" height="94px">{item.connt || 0}</HGroup>
              <VGroup className="describe" verticalAlign="space-around" padding="10px 0 10px 20px" flex>
                <HGroup>
                  <b style={paddingRight}>通用指标：</b>
                  {this.renderEquipmentAttributes(item.tyzbpi5)}
                </HGroup>
                <HGroup>
                  <b style={paddingRight}>专用指标：</b>
                  {this.renderEquipmentAttributes(item.zyzbdl6)}
                </HGroup>
              </VGroup>
            </HGroup>
          ))
        }
      </VGroup>
    )
  }

  render() {
    const { key_first, key_second, categoryChange } = this.props;
    const { mainCategories, secondaryCategories, equipmentItems } = this.props.store;
    return (
      <VGroup className="equipment-info-container" width="100%">
        <HGroup className="big-category" horizontalAlign="flex-start" width="100%" height="40px" padding="5px 0 0 0">
        {
          <Radio.Group value={ key_first } buttonStyle="solid" onChange={(e) => categoryChange('mainCategories', e)}>
            {
              mainCategories.map(item => <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>)
            }
          </Radio.Group>
        }
        </HGroup>
        <HGroup className="secondary-category" horizontalAlign="flex-start" width="100%" height="40px" padding="5px 0 0 0">
        {
          <Radio.Group value={ key_second } buttonStyle="solid" onChange={(e) => categoryChange('secondaryCategories', e)}>
            {
              secondaryCategories.map(item => <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>)
            }
          </Radio.Group>
        }
        </HGroup>
        {this.renderEquipmentItems(equipmentItems)}
      </VGroup>
    )
  }
}

export default EquipmentInfo;

