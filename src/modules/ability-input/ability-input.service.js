import axios from 'axios';
//获取能力表信息
export async function getCapabilityTableInfo() {  
  return await axios.get(`/api/capability/getCapabilityTableInfo`).then(res => res.data);
  
}
//能力数据列表
export async function queryPage({page,size},sendData) {  
  return await axios.post(`/api/capability/queryPage?page=${page}&size=${size}`,{...sendData}).then(res => res.data);
  
}
//能力分析数据单条新增/更新
export async function save(sendData) {  
  return await axios.post(`/api/capability/save`,{...sendData}).then(res => res.data);
  
}
//删除能力数据
export async function deleteCap(id) {  
  return await axios.get(`/api/capability/delete/${id}`).then(res => res.data);
  
}
//获取活动能力数据
export async function getCapabilityInfo(id) {  
  return await axios.get(`/api/capability/getCapabilityInfo/${id}`).then(res => res.data);
}
//批量删除能力数据
export async function batchDelete(arr) {  
  return await axios.post(`/api/capability/batchDelete`,arr).then(res => res.data);
}

