import axios from 'axios'

export const getZhuanyedaleiByKey = (params) => axios.get('/api/equipment/getZhuanyedaleiByKey', { params, headers: {'use-mock-service': false}});
export const getZhuanyexiaolei = (params) => axios.get('/api/equipment/getZhuanyexiaolei', { params, headers: {'use-mock-service': false}});
export const getZhuangbei = (params) => axios.get('/api/equipment/getZhuangbei', { params, headers: {'use-mock-service': false}});
export const militaryDetail = (params) => axios.get('/api/equipment/getZhuangbei', { params, headers: {'use-mock-service': false}});
export const HomeTroopsinfo = (params) => axios.get("/api/enemy/troopsinfo/HomeTroopsinfo",{ params, headers: {'use-mock-service': false} })
export const getRyAndZbCountById = (params) => axios.get("/api/enemy/personnelinfo/getRyAndZbCountById",{ params, headers: {'use-mock-service': false} })
export const getPersonList = (params) => axios.get("/api/enemy/personnelinfo/query",{ params, headers: {'use-mock-service': false} })

