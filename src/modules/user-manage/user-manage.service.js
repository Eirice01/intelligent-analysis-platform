
import axios from 'axios';
export async function queryUser(sendData) {  
  return await axios.get(`/api/user/queryUser`, {params: sendData}).then(res => res.data);
  //return await axios.get(`/user/queryUser`).then(res => res.data);
}
//新增/更新用户
export async function save(sendData) {
  return await axios.post(`/api/user/save`,{...sendData}).then(res => res.data);
}
//用户名重复性验证
export async function isRepeat(sendData) {
  return await axios.get(`/api/user/isRepeat/${sendData.username}`).then(res => res.data);
}
//启/禁用用户
export async function enabled(id) {
  return await axios.get(`/api/user/enabled/${id}`).then(res => res.data);
}
//删除/恢复用户
export async function deleteOr(id) {
  return await axios.get(`/api/user/deleteOr/${id}`).then(res => res.data);
}
//修改密码
export async function updatePsd(sendData) {
  return await axios.get(`/api/user/updatePsd`,{params: sendData}).then(res => res.data);
}
//验证旧密码是否正确
export async function matchesPassword({password,id}) {
  return await axios.get(`/api/user/matchesPassword/${password}/${id}`).then(res => res.data);
}
