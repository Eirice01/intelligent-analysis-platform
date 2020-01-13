import React, { Component } from 'react'
import {VGroup,HGroup} from 'v-block.lite/layout'
import './troops-add.less'
import TroopStore from './troops.store'
import { observer } from 'mobx-react';
import TroopMap from '@components/map'
import {TroopsInfoAdd} from './troops.service'
import PictureUpload from './views/pictureUpload'
import VideoUpload from './views/videoUpload'
import VideoModal from './views/videoModal'
import HistoryModal from './views/history-evolution'
import TroopsFeature from './views/troops-feature'
import {Form,Input,Row,Col,Button,Select,Modal,message} from 'antd'
const { TextArea } =Input;
const { Option } = Select
@observer
class TroopsModal extends Component{
  constructor(props){
    super(props)
    this.state={
      combattype:"",
      parenttype:"",
      combatname:"",
      combatnumber:"",
      combatinfo:"",
      loading:false,
      inputZat:"",
      inputName:"",
      visible:false,
      NewValue:"",
      selectTypeList:[],
      customTypes:"",
      backSelect:"",
      disabled:false,
      level:"",
      customs:[],
      activeMark:"",
      custom:[],
      coordinates:""

    }
  }
  componentDidMount(){
    this.getTroopsSelectType()
    this.getTroopsAllList()
    if(this.props.history.location.query){
      let id=this.props.history.location.query.Tid;
      this.LookTroops(id)
    }
  }

  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }

   async LookTroops(id){
    await TroopStore.fetchLookTroopInfo(id)
     if(TroopStore.TroopsBack.dlwzMap!=""){
       let data=TroopStore.TroopsBack.dlwzMap
       this.setState({activeMark:data.features[0].properties.name,coordinates:TroopStore.TroopsBack.coordinates})
     }
  }

  handleSubmit = e => {
    let setData={};
    let data=this.getHistoryData();
    let lsygujo=data.join(";");
    let tags=this.getTroopsFeature();
    let pic=this.getCombatLogo();
    let video=this.getVideoList();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
       switch (TroopStore.flag){
         case "1":
         setData={
           mc0mx:values.mc0mx,
           fjgosa:TroopStore.TroopsKey,
           bdjsx2b:values.bdjsx2b,
           dlwzo3b:values.troopName+','+values.troopZat,
           lsygujo:lsygujo,
           smrwnba:values.smrwnba,
           bdts9bg:tags.join(";"),
           bdbh1vf:values.bdbh1vf,
           lb1ho:this.state.level,
           tp3oi:pic,
           fjqic:video.join(";")
         }
         this.setTroopsInfo(setData)
           break;
         case "3":
           setData={
             id:TroopStore.troopsId,
             mc0mx:values.mc0mx,
             fjgosa:TroopStore.detailInfo.fjgosa,
             bdjsx2b:values.bdjsx2b,
             dlwzo3b:values.troopName+','+values.troopZat,
             lsygujo:lsygujo,
             smrwnba:values.smrwnba,
             bdts9bg:tags.join(";"),
             bdbh1vf:values.bdbh1vf,
             lb1ho:values.lb1ho,
             tp3oi:pic==undefined?TroopStore.detailInfo.tp3oi:pic,
             fjqic:video.join(";")
           }
           this.setTroopsInfo(setData)
       }
      }else {
        console.log(err)
      }
    });
  };


 //提交修改请求
  setTroopsInfo=(data)=>{
   TroopsInfoAdd(data)
    message.success("保存成功")
    TroopStore.changeMeun(false)
    this.initTroops()
    this.props.history.push({pathname:'/entryInfo/troops'})
 }

  //部队类型下拉
  async getTroopsSelectType(){
    await  TroopStore.fetchTroopSelectType('8-2')
  }
  //获取部队类型全量
  async getTroopsAllList () {
    await TroopStore.fetchTroopAll()
  }
  //类型选择
  changeType=(value)=> {
  this.setState({level:value},()=>{})
 }


  //获取部队logo图片
  getCombatLogo=()=>{
    return this.picture.state.setPic;
  }
  showVideoModal=(url)=>{
     this.VideoModal.OnokModal(url)
  }


  //获取地图点击的经纬度
  getMapClickZat=(lnt,lats)=>{

    let lng=lats.lngLat.lng;
    let lat=lats.lngLat.lat;
    let setinfo=lng+','+lat
    this.setState({inputZat:setinfo},()=>{})
    this.props.form.setFieldsValue({
            troopZat:setinfo,
          })
  }
  //取部队特色
  getTroopsFeature=()=>{
   return this.feature.state.tags;
  }

  //新增完成后初始化
   initTroops=()=>{
     TroopStore.initInfo()
   }
  //获取影音数据
  getVideoList=()=>{
  return this.video.setVideoList()
  }
  //获取历史沿革数据
   getHistoryData=()=>{
   return this.history.margeHistoryData();
   }


  //自定义弹窗确认关闭
  CustomModalOk=()=>{
    let customs = this.state.customs;
    if(!this.state.NewValue){
      message.error('请输入自定义内容!');
    }else if(!this.state.customTypes){
      message.error('自定义类型不能为空!');
    }
    else {
      customs.push({name:this.state.customTypes,value:this.state.NewValue});
    }
    this.setState({customs,visible: false, NewValue: ""});
  }

  CustomModalCancel=()=>{
    this.setState({ visible: false, NewValue: "" });
  }

  customInput = index => e => {
    let customs = this.state.customs;
    customs[index]['value'] = e.target.value;
    this.setState({customs});
  }

  handleBack=()=>{
    TroopStore.changeMeun(false)
    this.initTroops()
    TroopStore.editPic("")
    this.props.history.push({pathname:'/entryInfo/troops'})
  }

  changeHandler = type => e => {
    this.setState({ [type]: e.target.value });
  };

  render(){
    const { getFieldDecorator } = this.props.form;
    return(
      <div style={{width:"100%"}}>
        <div className="modal-contnet">
        <span className="troops-title-modal">部队信息维护</span>
          <VGroup className="troops-main">
            <Form onSubmit={this.handleSubmit} className="troops-form">
              <Row gutter={10}>
                <Col span={6}>
                  <Form.Item label="所属上级">
                    {getFieldDecorator('fjgosa', {
                      initialValue: TroopStore.setKey
                    })(
                      <Input
                        disabled={true}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="部队名称">
                  {getFieldDecorator('mc0mx', {
                    rules: [{ required: true, message: '用户名不能为空!' }],
                    initialValue: TroopStore.TroopsBack.mc0mx
                  })(
                    <Input
                      placeholder="部队名称"
                      disabled={this.state.disabled}
                    />,
                  )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="部队编号">
                    {getFieldDecorator('bdbh1vf', {
                      rules: [{ required: true, message: '部队编号不能为空!' }],
                      initialValue: TroopStore.TroopsBack.bdbh1vf
                    })(
                      <Input
                        placeholder="部队编号"
                        disabled={this.state.disabled}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="编制级别">
                    {getFieldDecorator('lb1ho', {
                      initialValue: TroopStore.TroopsBack.lb1ho
                    })(
                      <Select
                        onChange={this.changeType}
                        style={{width:"165px",marginLeft: "5px"}}
                        disabled={this.state.disabled}
                      >
                        {(TroopStore.selectType||[]).map((item,index)=>{
                          return <Option key={index} value={item.value}>{item.name}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8} style={{marginLeft:"5px"}}>
                {/*tp3oi*/}
                <Col span={5}>
                  <Form.Item label="部队图片">
                    <PictureUpload   ref={(picture)=>{this.picture=picture}}/>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item label="影音">
                    <VideoUpload showVideoModal={this.showVideoModal} ref={(video)=>{this.video=video}} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8} style={{marginLeft:"5px"}}>
                <Form.Item label="部队介绍">
                  {getFieldDecorator('bdjsx2b', {
                    initialValue: TroopStore.TroopsBack.bdjsx2b
                  })(
                    <TextArea id="history-job" row={4} style={{width:"1055px",height:"100px"}}  disabled={this.state.disabled}/>,
                  )}
                </Form.Item>
              </Row>
              <Row gutter={8} style={{marginLeft:"5px"}}>
                <Form.Item label="使命任务">
                  {getFieldDecorator('smrwnba', {
                    initialValue: TroopStore.TroopsBack.smrwnba
                  })(
                    <TextArea id="history-job" row={4} style={{width:"1055px",height:"100px"}}  disabled={this.state.disabled}/>,
                  )}
                </Form.Item>
              </Row>
              <Row gutter={8} style={{marginLeft:"5px"}}>
                {/*lsygujo*/}
                <Form.Item label="历史沿革">{}
                   <HistoryModal  ref={(history)=>{this.history=history}} />
                </Form.Item>
              </Row>

              <Row gutter={8} style={{marginLeft:"5px"}}>
                {/*bdts9bg*/}
                <Form.Item label="部队特色">
                  <TroopsFeature  ref={(feature)=>{this.feature=feature}} />
                </Form.Item>
              </Row>
              <Row gutter={8} style={{marginLeft:"5px"}}>
                {/*dlwzo3b*/}
                <Col span={8}>
                <Form.Item label="地理位置">
                  {getFieldDecorator('troopName', {
                    rules: [{ required: true, message: '名称不能为空!' }],
                    initialValue: TroopStore.TroopsBackZat.troopName
                  })(
                    <Input   placeholder="中文地理名称" style={{marginRight:"30px",width:"180px"}}   disabled={this.state.disabled} />
                  )}
                </Form.Item>
                </Col>
                <Col span={8}>
                  {getFieldDecorator('troopZat', {
                    rules: [{ required: true, message: '经纬度不能为空!' }],
                    initialValue: TroopStore.TroopsBackZat.troopZat
                  })(
                    <Input style={{width:"300px"}} placeholder="所在区域经纬度"   disabled={this.state.disabled}/>
                  )}
                </Col>
              </Row>
              <div className="troops-map-info">
                <TroopMap   stations={TroopStore.TroopsBack.dlwzMap} activeMark={this.state.activeMark}  coordinates={this.state.coordinates} mapClickFuc={this.getMapClickZat}/>
              </div>
              <Row>
                <VGroup gap="10px" style={{paddingLeft:'20px'}}>
                  {this.state.customs.map((custom,index) => (
                    <HGroup key={index} verticalAlign="center" gap="5px">
                      <span style={{color: "rgba(0, 0, 0, 0.85)",fontSize:"14px"}}>{custom.name}</span>
                      <h4>:</h4>
                      <Input value={custom.value} style={{width:'200px',marginLeft: "10px"}} onChange={this.customInput(index)}/>
                    </HGroup>
                  ))}
                </VGroup>
              </Row>
              <li className="combat-submit">
                <Button type="primary" style={{marginRight:"30px"}} onClick={this.handleSubmit} disabled={TroopStore.disabled}>提交</Button>
                <Button  style={{marginRight:"15px"}} onClick={this.handleBack}>取消</Button>
              </li>
            </Form>
          </VGroup>
        </div>
        <Modal title="添加自定义" visible={this.state.visible} onOk={this.CustomModalOk} onCancel={this.CustomModalCancel} width={380} okText="添加" cancelText="取消">
          <VGroup gap="20px">
            <HGroup horizontalAlign="center" verticalAlign="center" gap="10px">
              <span className="label-span">自定义内容:</span>
              <Input style={{ width: "200px" }} value={this.state.NewValue} onChange={this.changeHandler('NewValue')} />
            </HGroup>
          </VGroup>
        </Modal>
        {<VideoModal  ref={(VideoModal)=>{this.VideoModal=VideoModal}}/>}
      </div>
    )
  }
}
const WrappedNormaModalForm = Form.create({ name: 'normal_Modal' })(TroopsModal);
export default WrappedNormaModalForm
