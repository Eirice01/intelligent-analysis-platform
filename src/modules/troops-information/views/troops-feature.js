import React, { Component } from 'react'
import { Tag, Input, Tooltip, Icon } from 'antd';
import { observer } from 'mobx-react';
import '../troops-add.less'
import TroopStore from "../troops.store";
import {reaction} from 'mobx'
@observer
class TroopsFeatureModal extends Component{
  constructor(props){
    super(props)
    this.state={
      tags: [],
      inputVisible: false,
      inputValue: '',
    }
  }

  componentDidMount(){
    reaction(() => [TroopStore.TroopsBack.bdts9bg],(arr) => {
      if(arr[0]){
        let teptag=arr[0].split(";");
        this.setState({tags:teptag})
      }else {
        this.setState({tags:[]})
      }
    })
  }

  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };
  saveInputRef = input => (this.input = input);

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div className="troops-info-sty">
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={index} closable onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> 添加部队特色
          </Tag>
        )}
      </div>
    );
  }
}
export default TroopsFeatureModal
