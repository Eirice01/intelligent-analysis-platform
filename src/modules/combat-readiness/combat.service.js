import axios from 'axios';
export async function getCombatData(id) {
  return await axios.get('/combat/combatData').then(res => res.data);
}

export async function getCombatTool(key) {
  return await axios( {
    method:"get",
    url:"/api/status/getZhuanyedaleiByKey",
    headers:{'use-mock-service':false},
    params:{
      key:key
    }
  }).then(res => res.data)
}
//根据id获对应人员状态
export async function getCombatPersonList(id) {
  return await axios( {
    method:"get",
    url:"/api/status/getarstatusById",
    headers:{'use-mock-service':false},
    params:{
      bumen_id:id
    }
  }).then(res => res.data)
}

///api/status/getarstatusByKeys 根据部门ID，大类，小类计算装备状态

export async function getCombatStatusList(data) {
  return await axios( {
    method:"get",
    url:"api/status/getarstatusByKeys",
    headers:{'use-mock-service':false},
    params:{
      bumen_id:data.id,
      first_key:data.bgkey,
      second_key:data.smkey
    }
  }).then(res => res.data)
}
//物资信息表格数据
export async function getTableData(data) {
  return await axios(
    {
      method: "GET",
      url: "/api/material/query",
      headers: {'use-mock-service': false},
      params: {
        page: data.current,
        size: data.pageSize,
        id: data.id
      }
    }).then(res => res.data);
}

