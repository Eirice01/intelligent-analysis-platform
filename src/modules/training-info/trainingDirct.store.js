import  { observable,action,runInAction} from 'mobx';

/* 
* 训练科目	129-1  训练时段	129-2
*/
const dirct = {
    xlkm:"129-1",
    xlsd:"129-2"
}
import { getDicByKeys } from './trainingInfo.service'


class Store {
  @observable.ref xlkm = null;
  @observable.ref xlsd = null;
  @observable.ref jtkm = null;


  @action
  async fetchTrainingDirct() {
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
  @action
  async fetchJtkmList(key) {
    try {
        let res = await getDicByKeys(key);
        runInAction(
            () => {
                this.jtkm = res.data;
            }
        )
    } catch (err) {
      console.log(err)
    }
  }
}
export default new Store()
