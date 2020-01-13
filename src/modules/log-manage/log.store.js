import { observable , action , runInAction } from 'mobx';
import { getLogData } from './log.service'

class LogStore {
    @observable.ref logTableData = {};
    @observable pagination = {};

    @observable loading = false;

    @action
    async fetchLogData (params) {
        this.changeLoading(true);
        this.logTableData = {};
        try {
            const res = await getLogData(params);
            runInAction(
              () => {
                this.logTableData = res.data;
                this.pagination = {
                  "total":res.data.totalElements,
                  "pageSize":res.data.size,
                  "current":res.data.number+1,
                  "showQuickJumper":true
                  
                }
                this.changeLoading(false);
              }
            )
          } catch (err) {
            console.log(err)
          }
    }

    @action 
    changeLoading(flag) {
      this.loading = flag;
    }
}

export default new LogStore();