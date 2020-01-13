import  { observable,action} from 'mobx';
import {
  getTableData,
  requestDiction,
  getCurrentKey,
  MaterialsInfoAdd,
  lookMaterById,
  lookCombatPersonById,
  combatPersonStatus,
  combatStatus,
  combatStatusTable,
  getCombatStatusById,
} from './materials.service'

class Store {
  @observable.ref materialsTableData = null;
  @observable.ref isVisible=false;
  @observable.ref materialstree = null;
  @observable troopsname=null;
  @observable.ref combatselect=[];
  @observable.ref smallselect=[];
  @observable.ref materselect=[];
  @observable.ref matersmalselect=[];
  @observable.ref setKey="";
  @observable.ref partKey="";
  @observable addMessage=false;
  @observable.ref setMsgInfo={};
  @observable.ref materBackInfo={};
  @observable materId="";
  @observable combatStatus="";
  @observable combatId="";
  @observable.ref materflag=false;
  @observable.ref materType="";
  @observable.ref materTableId="";
  @observable.ref combatIsShow=false;
  @observable.ref combatInfo={};
  @observable.ref combatStatusTable={};
  @observable.ref isEditBtn=false;
  @observable.ref combatStatusBack={
     id:"",
     bdbhofl:"",
     bzsud7:"",
     whsmg0:"",
     sjptso9rpz:"",
     cds6u0:"",
     chubeilv:"",
     biaozhunlv:"",
     zhuangbeileixing:"",
     sjptso9rsl:"",
     zhuangbeidalei:""
  }
  @observable.ref combatPerBack={
    bzrse4vjg:"",
    zwrsr5jjg:"",
    dkrs3htgjgw:"",
    cdrsa4k:"",
    jsczsqb4:"",
    xlczsen8:"",
    dkrs3htqtgw:"",
    bzrse4vsb:"",
    zwrsr5jsb:""
  };
  @observable combatstatusClun = [
    {
      "title":"装备大类",
      "dataIndex":"zhuangbeidalei",
      "align":"center",
      width:120

    },
    {
      "title":"装备小类",
      "dataIndex":"zhuangbeileixing",
      "align":"center",
      width:120

    },
    {
      "title":"装备编制数",
      "dataIndex":"bzsud7",
      "align":"center",
      width:120

    },
    {
      "title":"完好数",
      "dataIndex":"whsmg0",
      "align":"center",
    },
    {
      "title":"出动数",
      "dataIndex":"cds6u0",
      "align":"center",
      width:100
    },
    {
      "title":"储备率",
      "dataIndex":"chubeilv",
      "align":"center",
      width:100
    },
    {
      "title":"标准率",
      "dataIndex":"biaozhunlv",
      "align":"center",
      width:100
    },
    {
      "title":"实际配套数（品种）",
      "dataIndex":"sjptso9rpz",
      "align":"center",
      width:160
    },
    {
      "title":"实际配套数（数量）",
      "dataIndex":"sjptso9rsl",
      "align":"center",
      width:160
    }
  ];

   @action.bound
   changeBtn(type){
     this.isEditBtn=type;
   }
    //战备状态弹框
    @action.bound
    changeCombatModal(type){
      this.combatIsShow=type;
    }
    //改变战备状态装备
   @action.bound
    changeCombatStatus(type){
      this.combatStatus=type;
    }
    @action
    changeMaterId(id){
      this.materId=id;
    }
    @action
    getMaterTanleId(id){
      this.materTableId=id;
    }
    @action
    changeMaterTypes(type){
      this.materType=type;
    }
    @action.bound
   async fetchSelect(key){
      try{
       const data=await requestDiction(key)
        if(data){
          if(key=="2-2"){
            this.combatselect=data.data;
          }else {
            this.smallselect=data.data;
          }
        }
      }catch (err){
        console.log(err)
      }

    }
  @action.bound
  async fetchMaterSelect(key){
    try{
      const data=await requestDiction(key)
      if(data){
        if(key=="0-7"){
          this.materselect=data.data;
        }else {
          this.matersmalselect=data.data;
        }
      }
    }catch (err){
     console.log(err)
    }
  }

  @action.bound
  async fetchMaterialsTableData(id) {
    this.materialsTableData = {};
    try {
      const data = await getTableData(id);
      this.materialsTableData = data.data;
    } catch (err) {
      console.log(err)
    }

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
  //弹框装套
   @action.bound
   changeVisible(type){
      this.isVisible=type;
   }
   //部分key
   @action.bound
    getPartKey(key){
      this.partKey=key;

   }
   @action.bound
   async fetchMaterialsInfoAdd(data){
     try {
       const datas= await MaterialsInfoAdd(data)
       return datas
     }catch (err){
       console.log(err)
     }
   }
   @action.bound
    changeMsg(type){
      this.addMessage=type;
   }
    @action.bound
    changeFlag(type){
      this.materflag=type;
    }
    //根据id查询对应物资信息
   @action.bound
    async fetchMaterialsInfos(id){
      try {
      const mk=await lookMaterById(id)
      this.materBackInfo=mk.data
      if(this.materBackInfo!=={}){
        this.materflag=true;
      }else {
        this.materflag=false;
      }
      }catch (err){
        console.log(err)
      }
   }

   //根据id查询对应部门的人员状态
  @action
    async fetchCombatPersonInfo(id){
      try {
        const per=await lookCombatPersonById(id)
        let data=per.data[0];
        if(per.data.length!=0){
          this.combatPerBack={
            id:data.id,
            bdbhtko:data.bdbhtko,
            bzrse4vjg:data.bzrse4vjg,
            zwrsr5jjg:data.zwrsr5jjg,
            dkrs3htgjgw:data.dkrs3htgjgw,
            cdrsa4k:data.cdrsa4k,
            jsczsqb4:data.jsczsqb4,
            xlczsen8:data.xlczsen8,
            dkrs3htqtgw:data.dkrs3htqtgw,
            bzrse4vsb:data.bzrse4vsb,
            zwrsr5jsb:data.zwrsr5jsb
          }
        }else {
          this.combatPerBack={
            id:"",
            bdbhtko:this.partKey,
            bzrse4vjg:"",
            zwrsr5jjg:"",
            dkrs3htgjgw:"",
            cdrsa4k:"",
            jsczsqb4:"",
            xlczsen8:"",
            dkrs3htqtgw:"",
            bzrse4vsb:"",
            zwrsr5jsb:""
          }
        }
      }
      catch (err){
        console.log(err)
      }
    }
    //新增人员状态
  @action
    async fetchPersonStatus(data){
      try {
        await combatPersonStatus(data)
      }catch (err){
       console.log(err)
      }
    }
    //新增装备状态
  @action
    async fetchCombatStatus (data){
      try {
        await combatStatus(data)
      }catch (err){
        console.log(err)
      }
    }
    //初始化参数
   @action
   reastInfo(){
     this.combatStatusBack={
       id:"",
       bdbhofl:"",
       bzsud7:"",
       whsmg0:"",
       sjptso9rpz:"",
       cds6u0:"",
       chubeilv:"",
       biaozhunlv:"",
       zhuangbeileixing:"",
       sjptso9rsl:"",
       zhuangbeidalei:""
     }
   }

   @action
   //初始化装备信息表
   initRestTable(){
     this.combatStatusTable={}
   }
    //新增装备信息后对应列表数据
  @action
   async fetchCombatStatusTable(data){
      try {
      const list= await  combatStatusTable(data)
      if(list){
        this.combatStatusTable=list.data;
      }
      }catch (err){
        console.log(err)
      }
   }
  //根据id查询对应装备状态信息
  @action
   async fetchCombatStatusById(id){
      try {
        const teps=await  getCombatStatusById(id)
        let tepo=teps.data;
        if(tepo){
        await this.fetchSelect(tepo.zhuangbeidalei)
         this.combatStatusBack={
            id:tepo.id,
            bdbhofl:tepo.bdbhofl,
            bzsud7:tepo.bzsud7,
            whsmg0:tepo.whsmg0,
            sjptso9rpz:tepo.sjptso9rpz,
            cds6u0:tepo.cds6u0,
            chubeilv:tepo.chubeilv,
            biaozhunlv:tepo.biaozhunlv,
            zhuangbeileixing:tepo.zhuangbeileixing,
            sjptso9rsl:tepo.sjptso9rsl,
            zhuangbeidalei:tepo.zhuangbeidalei
          }
        }else {
          this.combatStatusBack={
            id:"",
            bdbhofl:"",
            bzsud7:"",
            whsmg0:"",
            sjptso9rpz:"",
            cds6u0:"",
            chubeilv:"",
            biaozhunlv:"",
            zhuangbeileixing:"",
            sjptso9rsl:"",
            zhuangbeidalei:""
          }
        }
      }catch (err){
        console.log(err)
      }
   }
  }
export default new Store()
