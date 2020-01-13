import  { observable, action } from 'mobx';
import {
  equipmentList,
  saveEquipmentRecord,
  deleteEquipmentById,
  getEquipmentById,
  requestDiction,
  getTongyongColumn,
  getZhuanyeColumn,
  getEquipColumn,

  queryByArmyId,
  saveOrUpdate_byArmy,
  query_byKeys,
  getArmyById,
  delete_byArmy
} from './equipment.service'

class Store {
  @observable treeNodeInfo = {};
  @observable bigCategory = [];
  @observable smallCategory = [];
  @observable equipmentRecordData = [];
  @observable showEquipmentRecordModal = false;
  @observable showEquipmentRelatedModal = false;
  @observable.ref equipForm = {};
  @observable tongyongColumn = [];
  @observable zhuanyeColumn = [];
  @observable equipUnits = [];
  @observable equipList = [];
  @observable.ref tempPicList = [];

  @observable relatedForm = {};
  @observable customEquipColumns = [];

  @action.bound
  setTreeNodeInfo(node) {
    return this.treeNodeInfo = {...node};
  }

  @action.bound
  fetchCustomEquipColumns() {
    return getEquipColumn().then(res => this.customEquipColumns = res.data.data.customColumnVos);
  }

  @action.bound
  getDictions(key) {
    return requestDiction(key).then(res => {
      let data = res.data.data;
      switch(key) {
        case '2-2': return this.bigCategory = data;
        case '131-6': return this.equipUnits = data;
        default: return this.smallCategory = data;
      }
    });
  }
  @action.bound
  fetchEquipList(params) {
    return query_byKeys(params).then(res => this.equipList = res.data.data);
  }

  @action.bound
  equipmentRecordModalChange(bool) {
    return this.showEquipmentRecordModal = bool;
  }
  @action.bound
  equipmentRelatedModalChange(bool) {
    return this.showEquipmentRelatedModal = bool;
  }

  @action.bound
  fetchEquipmentList(params) {
    return equipmentList(params).then(res => res.data.data);
  }

  @action.bound
  deleteEquipment(data) {
    return deleteEquipmentById(data).then(res => res.data);
  }

  // 录入部分所用接口
  @action.bound
  fetchEquipmentById(data) {
    return getEquipmentById(data).then(res => res.data.data);
  }

  @action.bound
  saveOrUpdateEquipmentRecord(data) {
    return saveEquipmentRecord(data).then(res => res.data);
  }

  @action.bound
  fetchTongyongColumn() {
    return getTongyongColumn().then(res => this.tongyongColumn = res.data.data);
  }

  @action.bound
  fetchZhuanyeColumn() {
    return getZhuanyeColumn().then(res => this.zhuanyeColumn = res.data.data);
  }
  // 用于重置
  @action.bound
  setEquipRecordForm(data) {
    return this.equipForm = {...data};
  }
  // 暂存通用指标
  @action.bound
  setTongyongQuota(arr) {
    return this.equipForm = {...this.equipForm, tyzbpi5: [...arr]}
  }
  // 暂存专用指标
  @action.bound
  setZhuanyongQuota(arr) {
    return this.equipForm = {...this.equipForm, zyzbdl6: [...arr]}
  }
  // 暂存上传图片
  @action.bound
  setUploadPicture(data) {
    this.equipForm = {...this.equipForm, zbzplqf: [...data]}
  }
  // 暂存上传图片
  @action.bound
  setUploadTempPicList(data) {
    this.tempPicList = [...data]
  }

  // 装备关联部分

  @action.bound
  setEquipmentRelatedInfo(row) {
    return this.relatedForm = {...row};
  }

  @action.bound
  fetchRelatedList(params) {
    return queryByArmyId(params).then(res => res.data.data);
  }
  @action.bound
  fetchArmyById(params) {
    return getArmyById(params).then(res => res.data.data);
  }
  @action.bound
  saveOrUpdateForm_byArmy(params) {
    return saveOrUpdate_byArmy(params).then(res => res.data);
  }
  @action.bound
  set_delete_byArmy(params) {
    return delete_byArmy(params).then(res => res.data.data);
  }
}
export default new Store()
