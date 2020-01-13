import  { observable,action,runInAction} from 'mobx';
import { getPersonTableData, getColumns } from './person.service'


class Store {

  @observable.ref personTable = null;
  @observable.ref allColumns = null;

  @action
  async fetchPersonTable(params={page:1,size:10}) {
    try {
      const data = await getPersonTableData(params);
      runInAction(
        () => {
          this.personTable = data.data;
        }
      )
    } catch (err) {
      console.log(err)
    }
  }

  @action
  async fetchAllColumns () {
    const data = await getColumns();
    this.allColumns = data.data;
  }
}
export default new Store()
