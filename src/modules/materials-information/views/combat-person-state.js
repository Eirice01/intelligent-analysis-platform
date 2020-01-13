import React, { Component } from 'react'
import {HGroup} from 'v-block.lite/layout'
import {Form,Input,Row,Col,Button,Icon,message} from 'antd'
import { observer } from 'mobx-react';
import MaterialsStore from "../materials.store";
const infolis=["满编率：实有人数 比 编制人数","在位率：在位人数 比 编制人数","对口率：对口人数 比 实有人数","出动率：出动人数 比 编制人数","称职率：称职人数 比 实有人数"]
@observer
class CombatStateModals extends Component{
   constructor(props){
     super(props)
     this.state={
       isShowMeun:false
     }
   }

  handleSubmitP=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
       let data={
         id:MaterialsStore.combatPerBack.id,
         bdbhtko:MaterialsStore.partKey,
         bzrse4vjg:values.bzrse4vjg,
         bzrse4vsb:values.bzrse4vsb,
         cdrsa4k: values.cdrsa4k,
         dkrs3htgjgw:values.dkrs3htgjgw,
         dkrs3htqtgw:values.dkrs3htqtgw,
         jsczsqb4:values.jsczsqb4,
         xlczsen8:values.xlczsen8,
         zwrsr5jjg:values.zwrsr5jjg,
         zwrsr5jsb:values.zwrsr5jsb
       }
       this.setNewPerson(data)
      }
    })
  }

  setNewPerson(data){
     MaterialsStore.fetchPersonStatus(data).then(res=>{console.log(res)})
    message.success("保存成功")
     MaterialsStore.changeCombatModal(false)
  }
  showInfo=()=>{
    this.setState({isShowMeun:true})


  }
  showInfos=()=>{
    this.setState({isShowMeun:false})
  }
   render(){
     const { getFieldDecorator } = this.props.form;
     return(
       <div style={{width:"100%",height:"100%",position:"relative"}}>
         <Form onSubmit={this.handleSubmitP} className="troops-form">
           <Row gutter={8}>
             <Col span={9}>
               <Form.Item label="对口人数(关键岗位)">
                 {getFieldDecorator("dkrs3htgjgw", {
                   initialValue: MaterialsStore.combatPerBack.dkrs3htgjgw,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input style={{width:"140px"}}/>
                 )}
               </Form.Item>
             </Col>
             <Col span={9}>
               <Form.Item label="对口人数(其他岗位)">
                 {getFieldDecorator("dkrs3htqtgw", {
                   initialValue: MaterialsStore.combatPerBack.dkrs3htqtgw,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input style={{width:"140px"}}/>
                 )}
               </Form.Item>
             </Col>
           </Row>
           <Row gutter={8}>
             <Col span={9}>
               <Form.Item label="编制人数(军官)">
                 {getFieldDecorator("bzrse4vjg", {
                   initialValue: MaterialsStore.combatPerBack.bzrse4vjg,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input style={{width:"140px",marginLeft:"28px"}}/>
                 )}
               </Form.Item>
             </Col>
             <Col span={9}>
               <Form.Item label="编制人数(士兵)">
                 {getFieldDecorator("bzrse4vsb", {
                   initialValue: MaterialsStore.combatPerBack.bzrse4vsb,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input style={{width:"140px",marginLeft:"28px"}}/>
                 )}
               </Form.Item>
             </Col>

           </Row>
           <Row>
             <Col span={9}>
               <Form.Item label="在位人数(军官)">
                 {getFieldDecorator("zwrsr5jjg", {
                   initialValue: MaterialsStore.combatPerBack.zwrsr5jjg,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input style={{width:"140px",marginLeft:"30px"}}/>
                 )}
               </Form.Item>
             </Col>
             <Col span={9}>
               <Form.Item label="在位人数(士兵)">
                 {getFieldDecorator("zwrsr5jsb", {
                   initialValue: MaterialsStore.combatPerBack.zwrsr5jsb,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input style={{width:"140px",marginLeft:"28px"}} />
                 )}
               </Form.Item>
             </Col>
           </Row>
           <Row gutter={8}>
             <Col span={9}>
               <Form.Item label="军事称职数">
                 {getFieldDecorator("jsczsqb4", {
                   initialValue: MaterialsStore.combatPerBack.jsczsqb4,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input style={{width:"140px",marginLeft:"50px"}}/>
                 )}
               </Form.Item>
             </Col>
             <Col span={9}>
               <Form.Item label="心理称职数">
                 {getFieldDecorator("xlczsen8", {
                   initialValue: MaterialsStore.combatPerBack.xlczsen8,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input style={{width:"140px",marginLeft:"50px"}} />
                 )}
               </Form.Item>
             </Col>
           </Row>

           <Row>
             <Col span={9}>
               <Form.Item label="出动人数">
                 {getFieldDecorator("cdrsa4k", {
                   initialValue: MaterialsStore.combatPerBack.cdrsa4k,
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }],
                 })(
                   <Input  style={{width:"140px",marginLeft:"64px"}}/>
                 )}
               </Form.Item>
             </Col>
           </Row>
         </Form>
         <span className="question" onMouseEnter={this.showInfo} onMouseLeave={this.showInfos}><Icon  type="question-circle"/></span>
         <div className={this.state.isShowMeun?"question-info":"question-info-hide"}>
           <p>
             人员五率计算公式:
           </p>
           <div>
             {
               infolis.map((itm,idx)=>{
                 return <p key={idx}>{itm}</p>
               })
             }
           </div>
         </div>
         <HGroup className="footer-sub"><Button type="primary" onClick={this.handleSubmitP}>保存</Button></HGroup>
       </div>
     )
   }
}
const CombatPNormaModalForm = Form.create({ name: 'combatsp_Modal' })(CombatStateModals);
export default CombatPNormaModalForm
