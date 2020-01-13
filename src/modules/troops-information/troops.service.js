import axios from 'axios';
//部队信息表格数据
export async function getTableData(data) {
  return await axios(
    {
      method:"GET",
      url:"/api/enemy/troopsinfo/query",
      headers:{'use-mock-service':false},
      params:{
        page:data.current,
        size:data.pageSize,
        bdid:data.id,
        params:{
          mc0mx:data.params.mc0mx,
          bdbh1vf:data.params.bdbh1vf,
        }
      }
    }).then(res => res.data);
}
export async function getTreeMap() {
  return await axios( {
      method:"GET",
      url:"/api/enemy/troopsinfo/troopsinfoByCascader",
      headers:{'use-mock-service':false},
  }).then(res => res.data)
}


//获取部队信息列表类型
export async function getTroopsType(type) {
  let url='/api/diction/getDicByKeys'+'/'+type
  return await  axios.get(url).then(res=>res.data)
}

//部队信息列表类型全量
export async function getTroopsAll() {
  return await axios.get('/api/enemy/troopsinfo/getColumn').then(res => res.data);
}

//部队信息新增/修改
export async function TroopsInfoAdd(data) {
  return await axios( {
      method:"post",
      url:"/api/enemy/troopsinfo/saveOrUpdate",
      headers:{'use-mock-service':false},
      data:data
    }).then(res => res.data)

}

//部队信息查看

export async function detailTroops(id) {
  return await axios( {
    method:"get",
    url:"/api/enemy/troopsinfo/getTroopsinfoById",
    headers:{'use-mock-service':false},
    params:{
      id:id
    }
  }).then(res => res.data)
}


//部队信息-列表删除某一个部队信息前需要校验

export async function checkTroops(id) {

  return await axios( {
      method:"get",
      url:"/api/enemy/troopsinfo/checkIsDel",
      headers:{'use-mock-service':false},
      params:{
        id:id
      }
    }).then(res => res.data)
}

//部队信息删除--列表删除某一个部队信息（在校验通过后才可以删除）

export async function delectTroops(id) {

  return await axios( {
      method:"DELETE",
      url:" /api/enemy/troopsinfo/delete",
      headers:{'use-mock-service':false},
      params:{
        id:id
      }
    }).then(res => res.data)

}

//根据部门key获取对应的翻译
export async function getCurrentKey(key) {
  return axios.get(`/api/enemy/troopsinfo/getBdNameById?id=${key}`).then(res=>res.data)
}
