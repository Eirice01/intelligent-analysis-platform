import axios from 'axios';

//物资信息表格数据
export async function getTableData(data) {
  return await axios(
    {
      method:"GET",
      url:"/api/material/query",
      headers:{'use-mock-service':false},
      params:{
        page:data.current,
        size:data.pageSize,
        id:data.id
      }
    }).then(res => res.data);
}

//类型字典
export async function requestDiction(key) {
  return await axios( {
    method:"get",
    url:`api/diction/getDicByKeys/${key}`,
    headers:{'use-mock-service':false},
  }).then(res => res.data)
}

//根据部门key获取对应的翻译
export async function getCurrentKey(key) {
 return axios.get(`/api/enemy/troopsinfo/getBdNameById?id=${key}`).then(res=>res.data)
}


//物资信息新增/修改
export async function MaterialsInfoAdd(data) {
  return await axios( {
    method:"POST",
    url:"/api/material/saveOrUpdate",
    headers:{'use-mock-service':false},
    data:data
  }).then(res => res.data)

}

//根据id删除对应信息
export async function deleteMater (id) {
  return await axios( {
    method:"get",
    url:"/api/material/deleteById",
    headers:{'use-mock-service':false},
    params:{
      ids:id
    }
  }).then(res => res.data)
}

//根据id 编辑查看对应物资信息
export async function lookMaterById(id) {
  return await axios( {
      method:"get",
      url:"/api/material/getMaterialById",
      headers:{'use-mock-service':false},
      params:{
        id:id
      }
    }).then(res => res.data)
}

//根据id 编辑查看对应战备状态人员信息
export async function lookCombatPersonById(id) {
  return await axios( {
    method:"get",
    url:"/api/status/getPeopleStatusById",
    headers:{'use-mock-service':false},
    params:{
      id:id
    }
  }).then(res => res.data)
}

//新增修改人员状态

export async function combatPersonStatus(data) {
  return await axios( {
    method:"POST",
    url:"/api/status/saveOrUpdate_people",
    headers:{'use-mock-service':false},
    data:data
  }).then(res => res.data)
}

//新增或修改装备状态

export async function  combatStatus(data) {
  return await axios( {
    method:"POST",
    url:"/api/status/saveOrUpdate_equipped",
    headers:{'use-mock-service':false},
    data:data
  }).then(res => res.data)
}

export async function combatStatusTable(data) {
  return await axios(
    {
      method:"GET",
      url:" /api/status/queryEquipmentStatus",
      headers:{'use-mock-service':false},
      params:{
        page:data.current,
        size:data.pageSize,
        id:data.id
      }
    }).then(res => res.data);

}

export async function getCombatStatusById(id) {
  return await axios( {
    method:"get",
    url:"/api/status/getEquipmentById",
    headers:{'use-mock-service':false},
    params:{
      id:id
    }
  }).then(res => res.data)
}


export function deleteCombatStatus(id) {
  return  axios( {
    method:"DELETE",
    url:"/api/status/delete",
    headers:{'use-mock-service':false},
    params:{
      ids:id
    }
  }).then(res => res.data)
}
