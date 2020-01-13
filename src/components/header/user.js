import React,{ useState, useEffect } from 'react'

import { Icon} from 'antd';
import { HGroup } from 'v-block.lite/layout'

import UpdateModalForm from './user-modal'
import User from '@assets/images/user.png';
const tens = value => value < 10 ? `0${value}` : value
function DatetimeFormat(t) {
  const [yy, mm, dd, hh, min, sec] = [
    t.getFullYear(),
    t.getMonth() + 1,
    t.getDate(),
    t.getHours(),
    t.getMinutes(),
    t.getSeconds()
  ];
  return `${yy}-${tens(mm)}-${tens(dd)} ${tens(hh)}:${tens(min)}:${tens(sec)}`
}

const HeaderUser = ({ user,onChange }) => {
  const [time, setTime] = useState(new Date());
  const [isShow, setShow] = useState(false)
  function updatePwd(flag){
    setShow(flag)
  }
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer)
  }, []);
  return (
    <HGroup className="header-user" verticalAlign="center" horizontalAlign="flex-end" padding="5px 15px" flex>
      <HGroup className="item">{DatetimeFormat(time)}</HGroup>
      <HGroup className="item" verticalAlign="center" horizontalAlign="center" gap="5px">
          <img className="person" src={ User } onClick={()=>updatePwd(true)}/>
          <span className="name">{ user.name }</span>
      </HGroup>
      <UpdateModalForm isShow={isShow} updatePwd={updatePwd} />
      <HGroup className="item" verticalAlign="center" horizontalAlign="center" gap="5px"><Icon title="退出" type="poweroff" onClick={() => (onChange(false)) } /></HGroup>
    </HGroup>
  )
};

export default HeaderUser;
