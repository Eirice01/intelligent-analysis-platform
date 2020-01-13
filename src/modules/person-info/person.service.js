import axios from 'axios'

/* use mock */
// export const getPersonTableData = () => axios.get('/addPerson/personTable'); 


/* no mock */
const basic_axios = ({url,params,method,data}) =>  axios({
    method:method || 'get',
    headers:{'use-mock-service':false},
    url,
    data,
    params
}).then(res => res.data);
// 查询人员表列信息
export const getColumns = () => basic_axios({url:'/api/enemy/personnelinfo/getColumn'});
//根据id查询部队名称  
export const getBdNameById = (params) => basic_axios({url:'/api/enemy/troopsinfo/getBdNameById',params});
//人员信息表格
export const getPersonTableData = (params) => basic_axios({url:'/api/enemy/personnelinfo/query',params});
//人员信息新增提交
export const submitPerson = (data) => basic_axios({url:'/api/enemy/personnelinfo/saveOrUpdate',data,method:'post'});
//删除人员信息
export const deletePersonInfo = (params) => basic_axios({url:'/api/enemy/personnelinfo/delete',params,method:'delete'});
// 根据ID查询人员信息
export const getPersonnelById = (params) => basic_axios({url:'/api/enemy/personnelinfo/getPersonnelById',params});
// 校验人员编号是否重复
export const isRepeatByRybh = (params) => basic_axios({url:'/api/enemy/personnelinfo/isRepeatByRybh',params});
// 通过字典编码获取字典值
export const getDicByKeys = (keys) => basic_axios({url:`api/diction/getDicByKeys/${keys}`});