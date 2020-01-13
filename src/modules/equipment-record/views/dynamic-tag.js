import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { toJS } from 'mobx'
// eslint-disable-next-line no-unused-vars
import { Tag, Input, Tooltip, Icon, Popover, Select, Button, message } from 'antd';
const { Option } = Select;

@observer
class Quota extends Component {
  state = {selected: undefined, value: undefined, unit: undefined, unitList: []};
  renderAttrOptions = (category) => category && category.map(item => <Option key={item.label}>{item.name}</Option>);
  renderUnitOptions = (category) => category && category.map(item => <Option key={ item }>{item}</Option>);
  handleSelectChange = (o, type, columns) => {
    console.log('type', type)
    // 取出 属性对应的单位
    if(type === 'attr') {
      let singleObject = columns.find(v => v.label === o.key);
      this.setState({ selected: o, unitList: [...singleObject.unit], unit: singleObject.unit[0]}, () => console.log('state', this.state))
    }else if(type === 'input'){
      this.setState({ value: o.target.value })
    } else {
      this.setState({ unit: o}, () => console.log('unit', this.state.unit))
    }
  }
  boxNewQuota = () => {
    const { addNewTags } = this.props;
    addNewTags(this.state);
  }

  render() {
    const { columns } = this.props;
    const { unit, unitList } = this.state;
    return (
      <VGroup className="input-quota-content" horizontalAlign="flex-start" verticalAlign="space-around" width="350px" height="100px">
        <HGroup width="100%" horizontalAlign="flex-start">
          <Select placeholder="请选择属性" style={{width: '220px'}} labelInValue={true} onChange={(o) => this.handleSelectChange(o, 'attr', columns)}>
          { this.renderAttrOptions(columns) }
          </Select>
          {
            unitList.length ?
            (<Select placeholder="请选择单位" value={unit} style={{width: '80px', marginLeft: '20px'}} onChange={(o) => this.handleSelectChange(o)}>
            { this.renderUnitOptions(unitList) }
            </Select>) : null
          }
        </HGroup>
        <Input onChange={(o) => this.handleSelectChange(o, 'input')} placeholder="请输入内容" style={{width: '220px', margin: '10px 0'}}/>
        <Button type="primary" onClick={ this.boxNewQuota } ghost>确定</Button>
      </VGroup>
    )
  }
}

@observer
class EditableTagGroup extends Component {
  state = { visible: false, inputValue: ''};

  handleClose = removedTag => {
    const { tags } = this.props;
    let txt1 = `${removedTag.name}：${removedTag.value}${removedTag.unit}`;
    const tagsArr = tags.filter(v => {
      let txt2 = `${v.name}：${v.value}${v.unit}`;
      return txt1 !== txt2;
    });
    console.log(tagsArr);
    this.setTempDataToStore(tagsArr);
  };

  setTempDataToStore = (tags) => {
    const { store, type } = this.props;
    if(type === "tongyong") {
      store.setTongyongQuota(tags);
    }else {
      store.setZhuanyongQuota(tags);
    }
  }

  addNewTags = (obj) => {
    if(!obj.value) return message.warning('请输入内容！')
    // 此处 const 和 let 出现不同效果
    let { tags } = this.props;
    let tmp = {
      name: obj.selected.label,
      label: obj.selected.key,
      value: obj.value,
      unit: obj.unit
    }
    // 确认未重复添加
    let txt1 = `${tmp.name}：${tmp.value}${tmp.unit}`;
    let isAdd = tags.findIndex(v => {
      let txt2 = `${v.name}：${v.value}${v.unit}`;
      return txt1 === txt2;
    });
    if(isAdd === -1) {
      tags = [...tags, tmp];
    }
    this.setTempDataToStore(tags);
    this.setState({ visible: false });
  }

  handleVisibleChange = visible => this.setState({ visible });

  render() {
    const { visible } = this.state;
    const { tags, store } = this.props;
    const { mark } = store.equipForm;
    console.log('tags in render', toJS(tags));
    const tagStyle = { background: 'rgb(4, 152, 127)', borderStyle: 'dashed', borderColor: 'rgb(4, 152, 127)', color: 'rgb(255, 255, 255)'};
    return (
      <div>
        {tags && tags.map((tag, index) => {
          const text = `${tag.name}：${tag.value}${tag.unit}`;
          const isLongTag = text.length > 40;
          const tagElem = (
            <Tag key={index} closable={ mark !== 2 ? true : false } style={tagStyle} onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${text.slice(0, 40)}...` : text}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={text} key={index}> {tagElem} </Tooltip>
          ) : ( tagElem );
        })}
        <Popover
          content={<Quota columns={ this.props.columns } addNewTags={ this.addNewTags } />}
          title="添加指标"
          trigger="click"
          visible={ visible }
          onVisibleChange={this.handleVisibleChange}
        >
        {
          mark !== 2 ? (
          <Tag onClick={this.handleVisibleChange} style={tagStyle}>
            <Icon type="plus" /> 添加指标
          </Tag>) : null
        }
        </Popover>
      </div>
    );
  }
}

export default EditableTagGroup;

