import axios from 'axios';
//登录
export async function login({username,password}) {
  return await axios.post(`/api/login?username=${username}&password=${password}`,{}).then(res => res.data);
}
//退出
export async function logout(sendData) {
  return await axios.get(`/api/logout`).then(res => res.data);
}