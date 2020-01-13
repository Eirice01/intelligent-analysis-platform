import React, { Component } from 'react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'

import { Tabs, Input } from 'antd'
const { Search } = Input;
const { TabPane } = Tabs;

import { dashboardTitle } from '@modules/home'
import PersonItem from './person-item'
import EquipmentInfo from './equip-info'
import PersonDetail from './person-detail-modal'

function Operations({searchContent, searchFn }) {
  return <Search
  defaultValue={searchContent}
  placeholder="请输入姓名"
  onSearch={value => searchFn(value)}
  className="searchBox"
/>
}


@observer
class Person_Equipment extends Component {
  state = { activeKey: "1", key_first: undefined, key_second: undefined, searchContent: '' };
  tabChange = (key) => {
    const { store } = this.props;
    this.setState({activeKey: key})
    if(key === '2') {
      store.fetchZhuanyedaleiByKey({key: '2-2'}).then(res => {
        let key_first = store.mainCategories[0]['value'];
        this.updateEquipListAndSecondCategory(key_first);
      });
    }
  }

  // 切换大类 更新小类以及装备列表
  updateEquipListAndSecondCategory = ( key_first) => {
    const { store } = this.props;
    const bumen_id = store.treeNodeInfo.key;
    store.fetchZhuanyexiaolei({key: key_first}).then(res => {
      let key_second = store.secondaryCategories[0]['value'];
      store.fetchZhuangbei({bumen_id, key_first, key_second })
      this.setState({key_first, key_second})
    })
  }

  categoryChange = (category, { target }) => {
    const { store } = this.props;
    const bumen_id = store.treeNodeInfo.key;
    if(category === 'mainCategories') {
      this.updateEquipListAndSecondCategory(target.value)
      this.setState({key_first: target.value, key_second: '1'}, () => console.log('key_second', this.state.key_second))
    }else {
      this.setState({key_second: target.value}, () => {
        const { key_first, key_second } = this.state;
        store.fetchZhuangbei({bumen_id, key_first, key_second })
      })
    }
  }

  // 重置失败、为何？
  resetSearchContent = () => {
    this.setState({searchContent: '', activeKey: '1'}, () => console.log('reset search content', this.state.searchContent))
  }

  searchFn = async (value) => {
    await this.setState({searchContent:value})
    this.personItem.fetchDataSource(value)
  }

  render() {
    const { activeKey, key_first, key_second, searchContent } = this.state;
    const { title, personInfoTitle, equipmentInfoTitle, store } = this.props;
    const tabPaneStyle = {height: '300px',overflowY: 'auto'};
    return (
      <VGroup className="person-equipment-info-container" width="100%" padding="10px 0 0 0" flex>
        { dashboardTitle(title) }
        <HGroup className="person-equipment-content" horizontalAlign="flex-start" verticalAlign="flex-start" width="100%" height="100%">
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            tabBarExtraContent={activeKey === "1" ? <Operations searchContent={searchContent} searchFn={this.searchFn} /> : null}
            onChange={this.tabChange}
            className="tabsStyle">
            <TabPane tab={personInfoTitle} key="1" style={tabPaneStyle}>
              <PersonItem ref={ (personItem) => {this.personItem = personItem} } store={store} />
            </TabPane>
            <TabPane tab={equipmentInfoTitle} key="2" style={{...tabPaneStyle, overflowX: 'hidden'}}>
              <EquipmentInfo key_first={key_first} key_second={key_second} categoryChange={this.categoryChange} store={store} />
            </TabPane>
          </Tabs>
        </HGroup>
        <PersonDetail store={store} />
      </VGroup>
    )
  }
}

export default Person_Equipment;

