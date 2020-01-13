import axios from 'axios'
/* use mock */
// export const getTrainingConsumeCards = () => axios.get('/training/trainingConsumeCards');

/* no mock */
const basic_axios = ({url,params,method,data}) =>  axios({
    method:method || 'get',
    headers:{'use-mock-service':false},
    url,
    data,
    params
}).then(res => res.data);
// 获取指定部队单位下的科目训练统计
export const getSubjectsStatistics = (params) => basic_axios({url:'/api/train/getSubjectsStatistics',params});
// 获取科目下所有训练的时间信息
export const getSubjectsDetails = (params) => basic_axios({url:'/api/train/getSubjectsDetails',params});
// 获取训练数据
export const getTrainInfo = (id) => basic_axios({url:`/api/train/getTrainInfo/${id}`});
//人员信息表格
export const getPersonTableData = (params) => basic_axios({url:'/api/enemy/personnelinfo/query',params});
// 通过字典编码获取字典值
export const getDicByKeys = (keys) => basic_axios({url:`api/diction/getDicByKeys/${keys}`});
