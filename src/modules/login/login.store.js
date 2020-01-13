import  { observable, action} from 'mobx';
import { login,logout } from './login.service'
class Store {
  @observable.ref viewFormObj={}; //新增表单
  @observable modalTitle=''; //表单标题

  @action userLogin(obj) { //登录
    return login(obj) ;
  }
  @action userLogout(obj) { //登出
    return logout(obj);
  }
}
export default new Store();
