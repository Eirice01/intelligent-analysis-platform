import  { observable, action} from 'mobx';
import { queryUser,save,isRepeat,enabled,deleteOr,updatePsd,matchesPassword } from './user-manage.service'
class Store {
  @observable.ref viewFormObj={}; //新增表单
  @observable modalTitle=''; //表单标题
  @action viewContent(obj,title,bool){//查看表单锁存表单数据
    this.viewFormObj = obj;
    this.modalTitle = title;
  }

  @action queryUserList(obj) { //拉取用户管理列表
    return queryUser(obj) ;
  }
  @action saveUser(obj) { //新增/更新用户
    return save(obj);
  }
  @action 
  isRepeatUser(sendData) { //用户名是否重名
   return isRepeat(sendData);
  }
  @action 
  async enabledSwitch(id){ //启用/禁用
    await enabled(id).then(res => {})
  }
  @action 
  deleteOrUser(id){ //删除用户
    return deleteOr(id);
  }
  @action 
  updatePsdModal(sendData){ //修改密码
    return updatePsd(sendData);
  }
  @action 
  matchesPasswordModal(sendData){ //验证旧密码是否正确
    return matchesPassword(sendData);
  }
}
export default new Store();
