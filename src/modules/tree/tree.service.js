import axios from 'axios'

export const militaryTree = () => axios.get('/api/enemy/troopsinfo/troopsinfoByCascader', { headers: {'use-mock-service': false} })
export const militaryTreeChild = (id) => axios.get(`/api/enemy/troopsinfo/getTroopsinfoTree/${id}`, { headers: {'use-mock-service': false} })
