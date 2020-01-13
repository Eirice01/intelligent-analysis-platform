import axios from 'axios';

//各单位能力总分值
export async function overall(sendData) {  
  return await axios.get(`/api/capability/overall`, {params: sendData}).then(res => res.data);
}
//各能力占比情况
export async function ratio(sendData) {  
  return await axios.get(`/api/capability/ratio`, {params: sendData}).then(res => res.data);
}
//各能力变化趋势
export async function trend(sendData) {  
  return await axios.get(`/api/capability/trend`, {params: sendData}).then(res => res.data);
}

