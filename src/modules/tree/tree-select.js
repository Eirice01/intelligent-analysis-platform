import './index.less'
import React, { Component } from 'react'
import { TreeSelect } from 'antd'
import { observer } from 'mobx-react';

const { TreeNode } = TreeSelect;

import TreeStore from './tree.store'

@observer
class TreeSelectCard extends Component{

  state = { treeData: [], value: undefined };
  componentDidMount() {
    TreeStore.getTreeData().then(res => this.setState({ treeData: [res] }))
  }

  onLoadData = treeNode => {
    const { key } = treeNode.props.dataRef;
    return new Promise(resolve => {
      if (treeNode.props.children && treeNode.props.children.length > 0) {
        resolve();
        return;
      }
      TreeStore.fetchMilitaryTreeChild(key).then(res => {
        treeNode.props.dataRef.children = [...res];
        this.setState({ treeData: [...this.state.treeData] });
        resolve();
      })
    });
  }

  onChange = value => this.setState({ value })

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} value={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} value={item.key} {...item} dataRef={item} />;
    });
  }

  render(){
    const { onSelect, placeholder } = this.props;
    const { treeData } =  this.state;
    return(
      <TreeSelect
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={placeholder}
        treeNodeFilterProp="title"
        loadData={(e) => this.onLoadData(e) }
        onChange={this.onChange}
        onSelect={ onSelect }
      >
      { this.renderTreeNodes(treeData) }
      </TreeSelect>
    )
  }
}

export default TreeSelectCard;
