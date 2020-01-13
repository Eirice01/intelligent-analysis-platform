import axios from 'axios';

//查询初始化配置表列信息
export async function getColumn(sendData) {  
  return await axios.get(`/api/enemy/initset/getColumn`).then(res => res.data);
}
//设置部队信息
export async function setArmyinfo(sendData) {  
  return await axios.post(`/api/enemy/initset/setArmyinfo`,{...sendData}).then(res => res.data);
}
//查询配置的部队信息
export async function queInitTroop(sendData) {  
  return await axios.get(`/api/enemy/initset/queInitTroop`).then(res => res.data);
}
