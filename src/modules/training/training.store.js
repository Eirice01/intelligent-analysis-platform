import { action, observable,reaction,computed } from 'mobx'
import { getSubjectsStatistics, getSubjectsDetails, getTrainInfo ,getDicByKeys, getPersonTableData } from './training.service'
// 训练科目	129-1  训练时段	129-2
const completes = {
  xlsj6tp:"",
  xlsd7qn:"",
  xlddsai:"",
  xlry7q2:"",
  xlnrevk:"",
  xlxg1dq:"",
  rwcjarv:"",
  xlts537:"",
  xljdals:"",
  bjgljnc:"",
  yxle7u:"",
  khwcle0j:"",
  lhlbis:"",
  xlkm5ap:"",
  jtkmqgg:"",
  ssbdbh884:""
};
const consumes = {
  ysjfcue:"",
  xljf2cc:"",
  dyxhlpd:"",
  ylxhqke:"",
  mtxs3ug:"",
  fxxs5jm:""
}
class Store {
    @observable.ref subjectsStatistics = null;
    @observable activeSubject = null;
    @observable.ref trainingDates = [];
    @observable.ref complete = {};
    @observable.ref consume = {};
    @observable jtkm = null;
    @observable xlsd = "";
    @observable.ref trainPersons = [];
    @observable.ref pagination = {
      total:0,
      pageSize:10,
      current:1
    };


    //获取指定部队单位下的科目训练统计
    @action
    async fetchSubjectsStatistics(params) {
      try {
        const res = await getSubjectsStatistics(params);
        this.subjectsStatistics = res.data.details;
        //默认选中科目
        this.changeActiveSubject(res.data.details[0])
        //获取默认科目下的训练时间
        this.fetchSbujectsDates({
          ...params,
          subject :res.data.details[0].key
        })
      } catch (err) {
        console.log(err)
      }
    }
    //当前选中科目
    @action
    changeActiveSubject(data) {
      this.activeSubject = data;
    }
    //当前科目下的训练时间
    @action
    async fetchSbujectsDates(params) {
      try {
        const res = await getSubjectsDetails(params);
        if(res.data.details.length>0){
          this.fetchTrainInfo(res.data.details[0].id);
        } else {
          this.complete = completes;
          this.consume = consumes;
          this.jtkm = null;
          this.xlsd = "";
          this.trainPersons = [];
          this.pagination = {
            total:0,
            pageSize:10,
            current:1
          };
        }
        this.trainingDates = res.data.details;
      } catch (err) {
        console.log(err)
      }
    }

    @action
    async fetchTrainInfo(id) {
      try {
        const res = await getTrainInfo(id);
        this.complete = {...completes,...res.data.complete};
        this.consume = {...consumes,...res.data.consume};
      } catch (err) {
        console.log(err)
      }
    }

    @action
    async fetchTrainPersons(data){
      try {
        let {bdid,size,page,params} = data;
        if(!params.rybhnvh && !params.xm2er){
          this.trainPersons = [];
          this.pagination = {
            size:10,
            total: 0,
            pageSize: 1,
            current: 1
          }
        } else {
          let rybhnvh = params.rybhnvh ? {rybhnvh:params.rybhnvh} : {};
          let xm2er  = params.xm2er ? {xm2er:params.xm2er} : {};
          let requestData = {
            bdid,
            size,
            page,
            params:{
              ...rybhnvh,
              ...xm2er
            }
          }
          const res = await getPersonTableData(requestData);
          this.trainPersons = res.data.sourceData;
          this.pagination = {
            size:10,
            total: res.data.total,
            pageSize: res.data.pageSize,
            current: res.data.current
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    @computed get showTrainDates(){
      if(this.trainingDates.length > 5) {
        return this.trainingDates.slice(0,5);
      }  else {
        return this.trainingDates;
      }
    }

    @computed get hideTrainDates(){
      if(this.trainingDates.length > 5) {
        return this.trainingDates.slice(5);
      }  else {
        return null;
      }
    }
    reaction1 = reaction(() => [this.complete.xlkm5ap], arr => {
      if(arr[0]){
        let temp = [];
        getDicByKeys(arr[0]).then(res => {
          let list = res.data;
          if(this.complete.jtkmqgg) {
            this.complete.jtkmqgg.split(',').map(v => {
              list.forEach(k => {
                if(k.value == v){
                  temp.push(k.name);
                }
              })
            })
            this.jtkm = temp;
          } else {
            this.jtkm = null;
          }
        })
      } else {
        this.jtkm = null;
      }
    })
    reaction2 = reaction(() => [this.complete.xlsd7qn],arr => {
      let str = arr[0];
      if(str){
        getDicByKeys('129-2').then(res => {
          let list = res.data;
          list.map(v => {
            if(v.value == str){
              this.xlsd = v.name;
            }
          })
        });
      } else {
        this.xlsd = "";
      }
    })
}

export default new Store();
