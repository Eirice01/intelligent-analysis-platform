import axios from 'axios';
/* use mock */
// export const getTrainingTable = () => axios.get('/training-info/trainingTable');
// export const getTrainingConsume = () => axios.get('/training-info/trainingConsumes');

/* no mock */
const basic_axios = ({url,params,method,data}) =>  axios({
    method:method || 'get',
    headers:{'use-mock-service':false},
    url,
    data,
    params
}).then(res => res.data);

// 通过字典编码获取字典值
export const getDicByKeys = (keys) => basic_axios({url:`api/diction/getDicByKeys/${keys}`});
//根据id查询部队名称
export const getBdNameById = (params) => basic_axios({url:'/api/enemy/troopsinfo/getBdNameById',params});
// 训练数据保存修改接口
export const trainSave = (data) => basic_axios({url:'/api/train/save',data,method:'post'});
// 训练数据列表
export const getTrainingTable = ({size,page,data={}}) => basic_axios({url:`/api/train/queryPage?size=${size}&page=${page}`,data,method:'post'});
//获取训练状态表信息
export const getTrainTableInfo = () => basic_axios({url:`/api/train/getTrainTableInfo`});
// 获取训练数据
export const getTrainInfo = (id) => basic_axios({url:`/api/train/getTrainInfo/${id}`});
// 删除训练数据
export const deleteTrainInfo = (id) => basic_axios({url:`/api/train/delete/${id}`});
// 批量删除训练数据
export const batchDeleteTrainInfo = (data) => basic_axios({url:`/api/train/batchDelete`,data,method:'post'});
// 根据部队id查询下级所有的人员
export const getAllCountById = (params) => basic_axios({url:`/api/enemy/personnelinfo/getAllCountById`,params});
// 根据id查询部队树子节点
export const getTroopsinfoTree = (id) => basic_axios({url:`/api/enemy/troopsinfo/getTroopsinfoTree/${id}`});
// 根据id查询部队树根节点
export const getRootNodeById = (id) => basic_axios({url:`/api/enemy/troopsinfo/getRootNodeById/${id}`});