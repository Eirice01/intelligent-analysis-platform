
import axios from 'axios';
//axios.defaults.headers = {'use-mock-service':false}
//获取字典树
export async function dictionaryTree() {  
 return await axios.get(`/api/diction/tree`).then(res => res.data);
 //return await axios.get(`/diction/tree`).then(res => res.data);
}
//获取字典信息
export async function queryPage(sendData) {
  return await axios.get(`/api/diction/queryPage`,{params:sendData}).then(res => res.data);
  //return await axios.get(`/diction/queryPage`,).then(res => res.data);
}
//验证字典名称是否存在
export async function existsDicName(sendData) {
  return await axios.get(`/api/diction/existsDicName`,{params:sendData}).then(res => res.data);
}
//验证字典值是否存在
export async function existsDicValue(sendData) {
  return await axios.get(`/api/diction/existsDicValue`,{params:sendData}).then(res => res.data);
}
//保存/编辑字典信息
export async function saveDictionary(sendData) {
  return await axios.post(`/api/diction/save`,{...sendData}).then(res => res.data);
}
//启用/禁用字典操作
export async function enable(sendData) {
  return await axios.get(`/api/diction/enable`,{params:sendData}).then(res => res.data);
}
//删除字典(组)
export async function dicDelete(sendData) {
  return await axios.get(`/api/diction/delete`,{params:sendData}).then(res => res.data);
}
//获取字典(组)信息简要
export async function getDicInfoBrief(sendData) {
  return await axios.get(`/api/diction/getDicInfoBrief`,{params:sendData}).then(res => res.data);
}
