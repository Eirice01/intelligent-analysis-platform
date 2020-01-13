// 顶部菜单配置
export const menus = [
  { key:'/', title: '首页'},
  { key:'/basic-info', title: '部队信息'},
  { key:'/combat', title: '战备状态'},
  { key:'/training', title: '训练动态'},
  { key:'/ability', title: '能力分析'},
  { key:'/entryInfo', title: '信息录入',
    subs: [
      { title: '部队信息维护', key: '/entryInfo/troops' },
      { title: '人员信息维护', key: '/entryInfo/personInfo' },
      { title: '装备关联管理', key: '/equipment' },
      { title: '装备信息录入', key: '/equipment/record' },
      { title: '物资信息维护', key: '/materials' },
      { title: '训练信息维护', key: '/entryInfo/trainingInfo' },
      { title: '能力分析维护', key: '/entryInfo/ability-input' }
    ]
  },
  { key:'/commandSystem', title: '指挥系统'},
  { key:'/programDerive', title: '方案推演'},
  { key:'/systemSetting', title: '系统设置',
    subs: [
      { key: '/table-manage', title: '表管理'},
      { key: '/user', title: '用户管理'},
      { key: '/dictionary', title: '字典管理'},
      { key: '/log', title: '日志管理'},
      { key: '/config', title: '默认部门配置'}
    ]
  }
];

export const settingMenu = [
  {path:'/table-manage',label: "表管理"},
  {path: "/user",label: "用户管理"},
  {path: "/dictionary",label: "字典管理"},
  {path: "/log",label: "日志管理"}
];
