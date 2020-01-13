import  { observable,action,runInAction} from 'mobx';

/* 
* 人员类型 8-3  军职 8-4 军衔 8-5 学历 8-7 政治面貌 8-8  性别 8-9  心理素质 8-10  宗教信仰 8-11  人员类别 8-12  民族 8-13 
*/
const dirct = {
    rylx:"8-3",
    jz:"8-4",
    jx:"8-5",
    xl:"8-7",
    zzmm:"8-8",
    xb:"8-9",
    xlsz:"8-10",
    zjxy:"8-11",
    rylb:"8-12",
    mz32r:"8-13",
}
import { getDicByKeys } from './person.service'


class Store {
  @observable.ref rylx = null;
  @observable.ref jz = null;
  @observable.ref jx = null;

  @observable.ref xl = null;
  @observable.ref zzmm = null;
  @observable.ref mz32r = null;
  @observable.ref xb = null;
  @observable.ref xlsz = null;
  @observable.ref zjxy = null;
  @observable.ref rylb = null;


  @action
  async fetchPersonDirct() {
    try {
        for(let key in dirct) {
            let res = await getDicByKeys(dirct[key]);
            runInAction(
                () => {
                  this[key] = res.data;
                }
              )
        }
    } catch (err) {
      console.log(err)
    }
  }
}
export default new Store()
