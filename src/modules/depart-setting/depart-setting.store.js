import  { observable, action} from 'mobx';
import { getColumn,setArmyinfo,queInitTroop } from './depart-setting.service'

class Store {
   @observable.ref scoreEchartsData = {};
   @observable.ref ratioEchartsData = {};
   @observable.ref varietyEchartsData = {};
  @observable treeNodeInfo = {};

  @action.bound
  setTreeNodeInfo(node) {
    return this.treeNodeInfo = {...node};
  }
  @action getColumn() {
    return getColumn().then(res => res.data.customColumnVos);
  }
  @action setArmyinfo(sendData) {
    return setArmyinfo(sendData);
  }
 @action queInitTroop(sendData) {
    return queInitTroop().then(res => res.data);
  }
}
export default new Store()