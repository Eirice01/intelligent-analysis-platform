import  { observable,action} from 'mobx';

import { getCombatData,getCombatTool,getCombatPersonList,getCombatStatusList} from './combat.service'
import {getTableData} from "../materials-information/materials.service";
class Store {
  @observable.ref combatData = null;
  @observable.ref treeInfo = null;
  @observable.ref tolls=[];
  @observable.ref combatlist=[];
  @observable.ref combatNew=[];
  @observable combatKeys="";
  @observable combatTreeTitle="";
  @observable compersonInfo="";
  @observable compersonindex="";
  @observable isVisible=false;
  @observable.ref materialsTableData=null;
  @observable.ref combatData = null;
  @observable.ref treeInfo = null;

  @action
  changeModals(type){
    this.isVisible=type;
  }

  @observable.ref combatData = null;
  @observable.ref treeInfo = null;

  @action.bound
  async fetchCombatData(id) {
    this.combatData = {};
    try {
      const data = await getCombatData(id);
      this.combatData = data;

    } catch (err) {
      console.log(err)
    }
  }

   //存储树选中时的标题
  @action.bound
  getTreeTitle(i){
    this.combatTreeTitle=i
  }
  @action.bound
  async fetchTollData(id){
    this.tolls=[]
    try {
      const  data=await getCombatTool(id);
      this.tolls=data.data;
    }catch (err){
      console.log(err)
    }
  }
  @action.bound
  async fetchCombatList (id){
    try {
      const  data=await getCombatPersonList(id);
       if(data){
       this.combatlist=data.data;
       }
    }catch (err){
      console.log(err)
    }
  }
  //beumenkey
  @action.bound
  getCombatKey(key){
    this.combatKeys=key;
  }
  @action.bound
  async fetchCombatStatusListMore(data){
    try {
    const lis= await getCombatStatusList(data)
      if(lis){
      this.combatNew=lis.data
      }
    }catch (err){
      console.log(err)
    }
  }
  @action.bound
  async fetchMaterialsTableData(id) {
    try {
      const data = await getTableData(id);
      this.materialsTableData = data.data;
    } catch (err) {
      console.log(err)
    }
  }

}
export default new Store()
