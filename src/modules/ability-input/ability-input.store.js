import  { observable, action} from 'mobx';
import {getCapabilityTableInfo,queryPage,save,deleteCap,getCapabilityInfo,batchDelete} from './ability-input.service'
class Store {
  @observable capabilityData={}; //动态表格数据
  @observable troopsnum=''; //部队编号
  @observable troopsname=''; //部队名称
  @observable treeSelected=''; //左侧树选择的key
  @observable viewFormObj={}; //编辑数据
  @observable selectedRowData =[];

  @observable modalTitle=''; //表单标题
  @observable addDisabled=false; //表单标题
  @observable treeNodeInfo = {};
  @action viewContent(obj,title,bool){//查看表单锁存表单数据
    this.viewFormObj = obj;
    this.modalTitle = title;
    this.addDisabled = bool;
  }

  @action.bound
  setTreeNodeInfo(node) {
    return this.treeNodeInfo = {...node};
  }

  @action getCapabilityTableInfoData() {
     return getCapabilityTableInfo().then(res => {
       this.capabilityData = res.data;
     });
  }
  @action queryPageList({page,size},sendData) {
     return queryPage({page,size},sendData);
  }
  @action abilitySave(sendData) {
     return save(sendData);
  }
  @action deleteCapability(id) {
     return deleteCap(id);
  }
  @action batchDeleteData(arr) {  
        return batchDelete(arr);
  }
  @action getCapabilityInfoData(id) {
     return getCapabilityInfo(id);
  }
  @action troopsnumVal(troopsnum,troopsname,treeSelected) {  
        this.troopsnum = troopsnum;
        this.troopsname = troopsname;
        this.treeSelected = treeSelected;
  }
  @action selectedRowStore(selectedRowData) {  
        this.selectedRowData = selectedRowData;
  }
}
export default new Store();
