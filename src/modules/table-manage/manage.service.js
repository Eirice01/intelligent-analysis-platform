
import axios from 'axios'

export const tableManageDataList = (params) => axios.get('api/tablemgt/queryTable',{ params, headers: {'use-mock-service': false} })

export const getTableInfos = (tableId) => axios.get(`api/tablemgt/tableInfo/${tableId}`,{ headers: {'use-mock-service': false} })
export const requestDiction = (key) => axios.get(`api/diction/getDicNameValueByKeys/${key}`,{ headers: {'use-mock-service': false} })

export const validateTableName = (params) => axios.get(`api/tablemgt/isRepeat`,{ params, headers: {'use-mock-service': false} })
export const saveTable = (data) => axios.post(`api/tablemgt/save`,data, { headers: {'use-mock-service': false} })
export const associate = ({tableId, code}) => axios.get(`api/tablemgt/associate/${tableId}/${code}`, { headers: {'use-mock-service': false} })
export const requestBusinessConnect = () => axios.get(`api/tablemgt/business`, { headers: {'use-mock-service': false} })
export const dictionTree = () => axios.get(`api/diction/tree`, { headers: {'use-mock-service': false} })
