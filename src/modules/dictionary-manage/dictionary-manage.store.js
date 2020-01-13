import  { observable, action} from 'mobx';
import { dictionaryTree,queryPage,existsDicName,existsDicValue,saveDictionary,enable,dicDelete,getDicInfoBrief } from './dictionary-manage.service'
class Store {
  @observable.ref viewFormObj={}; //新增表单
  @observable modalTitle=''; //表单标题
  @action viewContent(obj,title,bool){//查看表单锁存表单数据
    this.viewFormObj = obj;
    this.modalTitle = title;
  }

  @action dictionaryTreeData() { ////获取字典树
    return dictionaryTree() ;
  }
  @action queryPageList(obj) { ////获取字典树
    return queryPage(obj) ;
  }
  @action existsDicNameValidate(obj) { //验证字典名称是否存在
    return existsDicName(obj) ;
  }
  @action existsDicValueValidate(obj) { //验证字典值是否存在
    return existsDicValue(obj) ;
  }
  @action saveDictionaryForm(obj) { //验证字典值是否存在
    return saveDictionary(obj) ;
  }
  @action dictionaryEnable(obj) { //验证字典值是否存在
    return enable(obj);
  }
  @action dictionaryDelete(obj) { //验证字典值是否存在
    return dicDelete(obj);
  }
  @action getDicInfoBriefContent(obj) { //验证字典值是否存在
    return getDicInfoBrief(obj);
  }
}
export default new Store();
