import axios from 'axios'

// 装备录入部分
export const equipmentList = (params) => axios.get('/api/equipment/query', { params, headers: {'use-mock-service': false} })
export const saveEquipmentRecord = (data) => axios.post('/api/equipment/saveOrUpdate', {params: data}, { headers: {'use-mock-service': false} })
export const getTongyongColumn = () => axios.get('/api/equipment/getTongyongColumn', { headers: {'use-mock-service': false} })
export const getZhuanyeColumn = () => axios.get('/api/equipment/getZhuanyeColumn', { headers: {'use-mock-service': false} })
export const getEquipmentById = (params) => axios.get('/api/equipment/getEquipmentById', {params, headers: {'use-mock-service': false} })
export const getTongyongById = (params) => axios.get('/api/equipment/getTongyongById', {params, headers: {'use-mock-service': false} })
export const getZhuanyeById = (params) => axios.get('/api/equipment/getZhuanyeById', {params, headers: {'use-mock-service': false} })
export const deleteEquipmentById = (params) => axios.get('/api/equipment/deleteById', {params, headers: {'use-mock-service': false} })
export const requestDiction = (key) => axios.get(`api/diction/getDicByKeys/${key}`,{ headers: {'use-mock-service': false} })
export const getEquipColumn = (key) => axios.get(`/api/equipment/getColumn`,{ headers: {'use-mock-service': false} })

// 装备关联管理
export const query_byKeys = (data) => axios.post(`/api/equipment/query_byKeys`, {params: data}, { headers: {'use-mock-service': false} })
export const queryByArmyId = (params) => axios.get('/api/equipment/queryByArmyId', { params, headers: {'use-mock-service': false} })
export const getArmyById = (params) => axios.get('/api/equipment/getArmyById', { params, headers: {'use-mock-service': false} })
export const saveOrUpdate_byArmy = (data) => axios.post('/api/equipment/saveOrUpdate_byArmy', {params: data}, { headers: {'use-mock-service': false} })
export const delete_byArmy = (params) => axios.get('/api/equipment/delete_byArmy', {params}, { headers: {'use-mock-service': false} })