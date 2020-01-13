import './app.less'
import React,{useState} from 'react'
import { HashRouter as Router, Switch } from 'react-router-dom'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { ConfigProvider,message } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import Store from '@modules/login/login.store'

import CustomMenu from '@components/header'
import Menu_Content_Frameset from '@containers/frameset'
import { HomeRoute } from '@modules/home'
import { BasicInfoRoute } from '@modules/basic-info'
import { TrainingRoute } from '@modules/training'
import { TableManagementInfoRoute } from '@modules/table-manage'
import { EquipmentRecordRoute } from '@modules/equipment-record'
import { TroopsRoute } from '@modules/troops-information'
import { CombatRoute } from '@modules/combat-readiness'
import { MaterialsRoute } from '@modules/materials-information'
import { PersonInfoRoute } from '@modules/person-info'
import { TrainingInfoRoute } from '@modules/training-info'
import { AbilitySafeguardRoute } from '@modules/ability-input'
import { WrappedLogin } from '@modules/login'
import { CommandSystemRoute } from '@modules/command-system'
import { ProgramDeriveRoute } from '@modules/program-derive'

import { AbilityRoute } from '@modules/ability-analysis'
import { UserManageRoute } from '@modules/user-manage'
import { DictionaryManageRoute } from '@modules/dictionary-manage'
import { LogRoute } from '@modules/log-manage'
import { DepartConfigRoute } from '@modules/depart-setting'
function MainBody() {
  return(
    <HGroup className="main" horizontalAlign="center">
    <Switch>
      { HomeRoute }
      { AbilityRoute }
      { UserManageRoute }
      { AbilitySafeguardRoute }
      { DictionaryManageRoute }
      { BasicInfoRoute }
      { TroopsRoute }
      { CombatRoute }
      { MaterialsRoute }
      { TrainingRoute }
      { PersonInfoRoute }
      { TrainingInfoRoute }
      { EquipmentRecordRoute }
      { TableManagementInfoRoute }
      { LogRoute }
      { DepartConfigRoute }
      { CommandSystemRoute }
      { ProgramDeriveRoute }
      <Menu_Content_Frameset routes={[]} />
    </Switch>
  </HGroup>
  )
}

const App = () => {
  let isUser = window.sessionStorage.getItem("userInfo")?true:false ;
  const [isLogin, setIslogin] = useState(isUser);
  function isToggleLogin(status){
      Store.userLogout().then(res => {
        if(res.success){
            message.success(`退出成功！`);
            sessionStorage.clear();
            setIslogin(status);
        }else{
            message.error(res.errorMsg);
        }
      })
  }
  function isLogined(status){
    setIslogin(status);
  }
  return (
    <HGroup height="100%">
        {
          isLogin ?
          <ConfigProvider locale={zhCN}>
            <Router>
              <VGroup height="100%" horizontalAlign="stretch" width="100%">
                <CustomMenu isUserLogin = {isToggleLogin} />
                <MainBody />
              </VGroup>
            </Router>
          </ConfigProvider>
          : <WrappedLogin isUserLogin = {isLogined}  />
        }
    </HGroup>
  )
}

export default App
