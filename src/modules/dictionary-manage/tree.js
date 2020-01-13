import './index.less'
import React, { Component } from 'react'
import {HGroup} from 'v-block.lite/layout'
import { Tree,Icon } from 'antd'
import { observer } from 'mobx-react';

const { TreeNode } = Tree;

@observer
class TreeCard extends Component{

  render(){
    const {treeData,onSelect,selectedKeys} = this.props;
    const loop = data =>
      data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.key} title={item.title} id={item.id}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.title} id={item.id} />;
    });
    return(
      <HGroup className="tree-container" width="100%" style={{overflow:'auto'}}>
        <Tree
          defaultExpandedKeys={['all', 'brigade1']}
          selectedKeys = {selectedKeys}
          onSelect={onSelect}
          switcherIcon={<Icon  type="down"/>}
          >
          {loop(treeData)}
        </Tree>
      </HGroup>
    )
  }
}
export default TreeCard;
