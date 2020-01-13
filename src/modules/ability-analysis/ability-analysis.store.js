import  { observable, action} from 'mobx';
import { overall,ratio,trend } from './ability-analysis.service'

class Store {
  @observable.ref scoreEchartsData = {};
  @observable.ref ratioEchartsData = {};
  @observable.ref varietyEchartsData = {};
  @observable treeNodeInfo = {};
  @observable chartData = {};

  @action.bound
  setTreeNodeInfo(node) {
    return this.treeNodeInfo = {...node};
  }
   @action UnitOverall(sendData) {
     return overall(sendData);
    }
    @action UnitRatio(sendData) {
     return ratio(sendData);
    }
    @action UnitTrend(sendData) {
     return trend(sendData);
    }
    tens = value => value < 10 ? `0${value}` : value;
    @action defaultTime() {
      let startTime = new Date();
      let year  = startTime.getFullYear();
      let endTime = new Date(`${year}-01-01`);
      let [yStart,mStart,dStart] = [startTime.getFullYear(),startTime.getMonth()+1,startTime.getDate()];
      let [yEnd,mEnd,dEnd] = [endTime.getFullYear(),endTime.getMonth()+1,endTime.getDate()];
      return [`${yEnd}-${this.tens(mEnd)}-${this.tens(dEnd)}`,`${yStart}-${this.tens(mStart)}-${this.tens(dStart)}`];
    }
     @action chartClick () {
       console.log("chartsclicl")
     }


  abilityTreeFn() {
    //abilityScore().then(data => this.scoreEchartsData = data);
    this.treeData = [
      {title:"全部",key:"all",children:[
          {title:"旅1",key:"brigade1",children:[{title:"营1",key:"battalion1-1",children:[{title:"连1",key:"company1-1",children:[{title:"分队1",key:"element1-1"}]}]}]},
          {title:"旅2",key:"brigade2",children:[{title:"营2",key:"battalion2-1",children:[{title:"连2",key:"company2-1",children:[{title:"分队2",key:"element2-1"}]}]}]}
      ]}
    ];
  }


  @action
  abilityScoreFn(obj) {
    //abilityScore().then(data => this.scoreEchartsData = data);
    if(obj.time == "2019"){
        this.scoreEchartsData = { 
            xLabel:["陆军一旅,09","陆军二旅,08","陆军三旅,05","陆军四旅,06","陆军五旅,07","陆军六旅,01","陆军七旅,02","陆军八旅,03","陆军九旅,11","陆军十旅,12",],
            yValue:[10, 52, 200, 334, 390, 330,550,230,960,880]
        }
    }else{
      this.scoreEchartsData = { 
            xLabel:["陆军一旅new","陆军二旅","陆军三旅","陆军四旅","陆军五旅","陆军六旅","陆军七旅","陆军八旅","陆军九旅","陆军十旅",],
            yValue:[10, 52, 200, 334, 390, 330,550,230,960,880]
      }
    }
  }
  @action
  ratioFn(obj) {
    //ratio().then(data => this.ratioEchartsData = data);
    if(obj.time == "2019"){
        this.ratioEchartsData = {
          label:[{name:"A能力分析",max:390},{name:"B能力分析",max:390},{name:"C能力分析",max:390},{name:"D能力分析",max:390},{name:"E能力分析",max:390},{name:"F能力分析",max:390}],
          value:[10, 52, 200, 334, 390, 330]
        };
    }else{
      this.ratioEchartsData = {
          label:[{name:"H能力分析",max:390},{name:"B能力分析",max:390},{name:"C能力分析",max:390},{name:"D能力分析",max:390},{name:"E能力分析",max:390},{name:"F能力分析",max:390}],
          value:[10, 52, 200, 334, 390, 330]
      };
    }
  }
  @action
  varietyFn(obj) {
    //variety().then(data => this.varietyEchartsData = data);
    if(obj.time == "2019"){
        this.varietyEchartsData = {
        label:['活动1','活动2','活动3','活动4','活动5','活动6','活动7','活动8','活动9','活动10','活动11','活动12'],
        seriesData:[[120,132,101,134,90,230,210,182,191,234,260,280],[220,182,191,210,230,270,270,201,154,140,240,250],
                    [150,232,201,154,190,180,210,150,182,201,154,190],[150,232,201,154,190,180,210,150,182,201,154,190],
                    [150,232,201,154,190,180,210,150,182,201,154,190],[200,232,201,200,190,190,210,190,182,201,154,190]],
        legendData:['A能力','B能力','C能力','D能力','E能力','F能力']
    }
    }else{
      this.varietyEchartsData = {
        label:['活动1qq','活动2','活动3','活动4','活动5','活动6','活动7','活动8','活动9','活动10','活动11','活动12'],
        seriesData:[[120,132,101,134,90,230,210,182,191,234,260,280],[220,182,191,210,230,270,270,201,154,140,240,250],
                    [150,232,201,154,190,180,210,150,182,201,154,190],[150,232,201,154,190,180,210,150,182,201,154,190],
                    [150,232,201,154,190,180,210,150,182,201,154,190],[200,232,201,200,190,190,210,190,182,201,154,190]],
        legendData:['G能力','B能力','C能力','D能力','E能力','F能力']
      }
    }
  }
}
export default new Store()