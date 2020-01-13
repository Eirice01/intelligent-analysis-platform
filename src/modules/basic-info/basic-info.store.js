import { action, observable } from 'mobx'
import {
  HomeTroopsinfo,
  getZhuanyedaleiByKey,
  getZhuanyexiaolei,
  getZhuangbei,
  getRyAndZbCountById,
  getPersonList
} from './basic-info.service'


class Store {

  @observable personDetailModal = false;
  @observable treeNodeInfo = {};
  @observable military = {};
  @observable personel = [];
  @observable mainCategories = [];
  @observable secondaryCategories = [];
  @observable equipmentItems = [];
  @observable peopleDetails = {}

  @action.bound
  setTreeNodeInfo(node) {
    return this.treeNodeInfo = {...node};
  }

  @action.bound
  setPeopleDetails(personDetail) {
    return this.peopleDetails = personDetail;
  }

  @action.bound
  getMilitaryDetail(params) {
    return HomeTroopsinfo(params).then(res => this.military = {...res.data.data});
  }

  @action.bound
  fetchZhuanyedaleiByKey(params) {
    return getZhuanyedaleiByKey(params).then(res => this.mainCategories = res.data.data);
  }

  @action.bound
  fetchZhuanyexiaolei(params) {
    return getZhuanyexiaolei(params).then(res => this.secondaryCategories = res.data.data);
  }

  @action.bound
  fetchZhuangbei(params) {
    return getZhuangbei(params).then(res => this.equipmentItems = res.data.data);
  }
  @action.bound
  fetchRyAndZbCountById(params) {
    return getRyAndZbCountById(params).then(res => res.data.data);
  }
  @action.bound
  fetchPersonList(params) {
    return getPersonList(params).then(res => res.data.data);
  }

  @action.bound
  personDetailModalChange(bool) {
    return this.personDetailModal = bool;
  }
}

export default new Store();
