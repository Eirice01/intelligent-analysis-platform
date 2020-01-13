import  { observable, action } from 'mobx';
import {
  tableManageDataList,
  requestDiction,
  requestBusinessConnect,
  validateTableName,
  saveTable,
  associate,
  getTableInfos,
  dictionTree
} from './manage.service'

// @observable.ref 、@observable.shallow、 @observable
class Store {
  @observable showAddTableModal = false;
  @observable showBusinessConnectModal = false;
  @observable tableManageDataSource = [];
  @observable columnTypes = [];
  @observable businessTypes = [];
  @observable businessConnections = [];
  @observable editableInfo = {};
  @observable editableColumns = [];
  @observable dictionTree = [];

  @action.bound
  addTableModalChange(bool) {
    return this.showAddTableModal = bool;
  }

  @action.bound
  businessConnectModalChange(bool) {
    return this.showBusinessConnectModal = bool;
  }

  @action.bound
  setEditableInfos(tableInfo) {
    return this.editableInfo = {...tableInfo};
  }

  @action.bound
  setEditedColumns(columns) {
    return this.editableColumns = [...columns];
  }

  @action.bound
  getBusinessConnect(params) {
    return requestBusinessConnect(params).then(res => this.businessConnections = res.data.data);
  }

  @action.bound
  getDictions(key) {
    return requestDiction(key).then(res => {
      let data = res.data.data;
      if(key === '8-1') this.columnTypes = data;
      else if(key === '2-1') return this.businessTypes = data;
    });
  }

  @action.bound
  getTableManageDataSource(requestParams) {
    return tableManageDataList(requestParams).then(res => res.data.data);
  }

  @action.bound
  tableNameValidate(requestParams) {
    return validateTableName(requestParams).then(res => res.data);
  }
  @action.bound
  createTable(params) {
    return saveTable(params).then(res => res.data);
  }
  @action.bound
  tableAssociateBusiness(params) {
    return associate(params).then(res => res.data);
  }
  @action.bound
  fetchTableInfos(tableId) {
    return getTableInfos(tableId).then(res => res.data.data);
  }
  @action.bound
  fetchDictionTrees() {
    return dictionTree().then(res => this.dictionTree = [res.data.data]);
  }
}
export default new Store();
