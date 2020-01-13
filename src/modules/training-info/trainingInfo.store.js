import { observable , action , runInAction } from 'mobx';
import { getTrainingTable, getTrainTableInfo } from './trainingInfo.service'

class Store {
    @observable.ref trainingTable = {};
    @observable.ref consumes = [];
    @observable.ref requestSearchs = [];

    @action
    async fetchTrainingTable(params) {
        try {
            const res = await getTrainingTable(params);
            runInAction(() => {
                this.trainingTable = res.data;
            })
        } catch(error) {
            console.log(error);
        }
    }

    @action
    async fetchTrainInfos () {
        try {
            const res = await getTrainTableInfo();
            let { complete } = res.data;
            let searchs = complete.customColumnVos.filter(v => v.isSearch == 1);
            this.requestSearchs = searchs;
        } catch(error) {
            console.log(error);
        }
    }

    @action.bound
    setTrainingConsumes(data){
        this.consumes = data;
    }
}

export default new Store();