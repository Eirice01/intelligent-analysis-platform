import { action, observable } from 'mobx'
import { militaryTree, militaryTreeChild } from './tree.service'


class Store {

  @observable nodeInfo = {};

  @action.bound
  setTreeNode(nodeInfo) {
    return this.nodeInfo = nodeInfo;
  }

  @action.bound
  getTreeData() {
    return militaryTree().then(res => res.data.data);
  }

  @action.bound
  fetchMilitaryTreeChild(id) {
    return militaryTreeChild(id).then(res => res.data.data);
  }
}
export default new Store();
