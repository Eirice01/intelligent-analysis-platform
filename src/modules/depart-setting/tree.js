import './index.less'
import React, { Component } from 'react'
import {HGroup} from 'v-block.lite/layout'
import { Tree,Icon } from 'antd'
import { observer } from 'mobx-react';

const { TreeNode } = Tree;

import TreeStore from '@modules/tree/tree.store'

@observer
class TreeCard extends Component{

  state = { treeData: [], expandedKeys: [],autoExpamdKeys:true};

  componentDidMount() {
    const { onSelect } = this.props;
      TreeStore.getTreeData().then(res => {
      const selectNode = res.children ? res.children[0] : res;
      this.setState({ treeData: [res], expandedKeys: [res.key]}, () => onSelect( [selectNode.key], selectNode, res))
    })
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
        this.setState({ treeData: [...this.state.treeData] }, () => console.log('state', this.state));
        resolve();
      })
    });
  }

  onLoad = (loadedKeys, info) => {}
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });
  }
  onExpend=async(onExpend,info)=>{
    await this.setState({expandedKeys:onExpend,autoExpamdKeys:false},()=>{})
  }
  render(){
    const { onSelect, selectedKeys } = this.props;
    const { expandedKeys } = this.state;
    return(
      <HGroup className="tree-container" width="100%" style={{overflow:'auto'}}>
        <Tree
          autoExpamdKeys={true}
          switcherIcon={<Icon  type="down"/>}
          onSelect={ onSelect }
          selectedKeys={ selectedKeys }
          expandedKeys={ expandedKeys }
          loadData={(e) => this.onLoadData(e) }
          onLoad={this.onLoad}
          onExpand={this.onExpend}
          >
          { this.renderTreeNodes(this.state.treeData) }
        </Tree>
      </HGroup>
    )
  }
}

export const tree_store = TreeStore;
export default TreeCard;
