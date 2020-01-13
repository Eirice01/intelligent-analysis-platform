import  { observable, action} from 'mobx';
import {
  queInitTroop,
  troopsinfoForMap,
  capabilityAnalysis,
  latestTrainInfo,
  getEquipStatus,
  getTroopLocation,
  HomeTroopsinfo,
  getRyxxByMaxJz
} from './home.service'

class Store {
  @observable.ref markerInfo = {};
  @observable military = {};
  @observable personel = [];
  @observable trainingInfo = [];
  @observable abilityAnalysisDatas = {label: [], value: []};

  // 战备状态数据
  @observable equipmentDesc = '';
  @observable rateDatas = [];
  @observable reignRate = [];
  @observable competentRate = [];
  @observable supportingRate = [];
  @observable equipRateDatas = [];
  @observable complianceRareData = [];

  @action.bound
  setMarkerInfo(obj) {
    this.markerInfo = obj;
  }

  @action.bound
  fetchInitTroop() {
    return queInitTroop().then(res => res.data.data);
  }

  @action.bound
  fetchTroopsinfo(params) {
    return HomeTroopsinfo(params).then(res => this.military = {...res.data.data});
  }

  @action.bound
  fetchTroopsinfoForMap() {
    return troopsinfoForMap().then(res => res.data.data);
  }

  @action.bound
  fetchRyxxByMaxJz(params) {
    return getRyxxByMaxJz(params).then(res => this.personel =res.data.data);
  }

  @action.bound
  fetchEquipStatus(params) {
    return getEquipStatus(params).then(res => {
      const { rateDatas, reignRate, competentRate, equipRateDatas, supportingRate, desc, complianceRareData } = res.data.data;
      this.equipmentDesc = desc;
      this.rateDatas = rateDatas;
      complianceRareData.forEach(v => {
        v.content = JSON.parse(JSON.stringify(v.value));
        v.value = typeof(v.value) === 'number' ? v.value : 0;
      })
      supportingRate.forEach(v => {
        v.content = parseInt((v.value * 100) / v.totalValue, 10) + '%';
      })
      reignRate.forEach(v => {
        v.content = parseInt((v.value * 100) / v.totalValue, 10) + '%';
      })
      competentRate.forEach(v => {
        v.content = parseInt((v.value * 100) / v.totalValue, 10) + '%';
      })
      this.reignRate = reignRate;
      this.competentRate = competentRate;
      this.equipRateDatas = equipRateDatas;
      this.complianceRareData = complianceRareData;
      this.supportingRate = supportingRate;
    });
  }

  @action.bound
  fetchTrainInfo(armyno) {

    return latestTrainInfo(armyno).then(res => this.trainingInfo = res.data.data)
  }

  @action.bound
  fetchCapabilityAnalysis(armyno) {
    return capabilityAnalysis(armyno).then(res => this.abilityAnalysisDatas = res.data.data);
  }

  @action.bound
  fetchTroopLocation() {
    return getTroopLocation().then(res => res.data);
  }
}
export default new Store();
