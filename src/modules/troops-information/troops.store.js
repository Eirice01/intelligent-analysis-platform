import  { observable,action} from 'mobx';
import { getTableData,getTreeMap,getTroopsType,getTroopsAll,detailTroops,checkTroops,delectTroops,getCurrentKey} from './troops.service'

class Store {
  @observable.ref troopTableData = null; //部队信息表格数据
  @observable.ref tree=null;
  @observable.ref selectType=null;       //部队信息类型
  @observable.ref troopsAll=null;        //部队信息列表类型全  show_显示
  @observable editorHtml=null;           //富文本编辑内容
  @observable flag=null;                 //新增，修改，查看 类型识别
  @observable.ref detailInfo={};
  @observable isData=false;
  @observable tages =[];
  @observable isedit=false;
  @observable checkInfo="";          //删除前部队信息标识/false（有子节点不能删除）/true
  @observable.ref deleteInfo={};
  @observable troopsId="";
  @observable setPic="";
  @observable TroopsKey="";
  @observable setKey="";
  @observable pagetype=null;
  @observable disabled=false;
  @observable.ref TroopsBackZat={
    troopZat:"",
    troopName:""
  }
  @observable.ref TroopsBack={
     id:"",
     mc0mx :"",
     fjgosa:"",
     bdjsx2b:"",
     dlwzo3b: "",
     lsygujo: "",
     smrwnba :"",
     bdts9bg:"",
     bdbh1vf:"",
     lb1ho:"",
     tp3oi :"",
     fjqic : "",
    fjgosaValue:"",
    dlwzMap:"",
    lb1hoValue:"",
    coordinates:""

  }
   @action.bound
   changeDisabled(type){
      this.disabled=type;
   }
  //更新部队名称
  @action
  updateKey(key){
    this.setKey=key;
  }
  //部分点击key翻译
  @action
  async fetchGetMoreKey(key){
    try {
      const keys=await getCurrentKey(key)
      if(keys){
        this.setKey=keys.data;
      }
    }catch (err){
      console.log(err)
    }
  }

  //部分key
  @action.bound
  getTroopsKey(key){
    this.TroopsKey=key;
  }
  @action.bound
  EditorHtml(html){
    this.editorHtml=html;
  }
  @action.bound
  editPic(data){
    this.setPic=data;
  }
  @action.bound
  changeFlag(type){
    this.flag=type;
  }
  @action.bound
  getTroopsId(id){
    this.troopsId=id;
  }
  @action.bound
  changeMeun(type){
    this.isedit=type;
  }

  @action.bound
  async fetchTroopTableData(id) {
    this.troopTableData = {};
    try {
      const data = await getTableData(id);
      this.troopTableData = data.data;
    } catch (err) {
      console.log(err)

    }
  }
  @action.bound
  async fetchTreeData(){
    this.tree={}
    try {
      const  data=await getTreeMap();
      this.tree=data.data;
    }catch (err){
      console.log(err)
    }
  }

  @action.bound
  async fetchTroopSelectType(type) {
    this.selectType = [];
    try {
      const data = await getTroopsType(type);
      this.selectType = data.data;
    } catch (err) {
      console.log(err)

    }
  }

  @action.bound
  async fetchTroopAll() {
    this.troopsAll = [];
    try {
      const data = await getTroopsAll();
      let troops=data.data.customColumnVos;
      console.log(troops)
    } catch (err) {
      console.log(err)

    }
  }
  @action
  initInfo(){
    this.TroopsBack={
      id:"",
      mc0mx :"",
      fjgosa:"",
      bdjsx2b:"",
      dlwzo3b: "",
      lsygujo: "",
      smrwnba :"",
      bdts9bg:"",
      bdbh1vf:"",
      lb1ho:"",
      tp3oi :"",
      fjqic : "",
      fjgosaValue:"",
      dlwzMap:"",
      lb1hoValue:"",
      coordinates:""
    }
  }
  @action
  setInfos(data){
    this.TroopsBack={
      ...data
    }
  }
  @action.bound
  async fetchLookTroopInfo(id){
      let teos=null;
      let setZat="";
      let pics="";
    try {
      const data = await detailTroops(id);
      teos=data.data;
      if(teos){

        let zat=teos.dlwzo3b;
        if(zat!==""||zat!==null){
          setZat=zat.split(",");
        }else {
          setZat=""
        }
        this.TroopsBackZat={
          troopZat:setZat[1]+","+setZat[2],
          troopName:setZat[0]
        }
        if(teos.tp3oi!==null){
          pics=teos.tp3oi.split(",")
        }else {
          pics=""
        }
        this.editPic(pics[1])
         await this.setInfos(teos)

      }else {
        this.initInfo()
      }
    } catch (err) {
      console.log(err)

    }
  }
  @action.bound
  async fetchCheckTroops(id){
    try {
       const data=await checkTroops(id)
        if(data.data){
         this.deleteInfo=data;
         this.checkInfo=true;
         this.fetchDeleteTroops(id)
        }else {
         this.checkInfo=false;
        }
    }catch (err) {
      console.log(err)

    }
  }

  @action.bound
  async fetchDeleteTroops(id){
    try {
      await delectTroops(id)
    }catch (err) {
      console.log(err)

    }
  }
}
export default new Store()
