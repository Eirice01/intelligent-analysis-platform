import React, { Component } from 'react'
import {HGroup} from 'v-block.lite/layout'
import {Modal,Input,Row,Col,Button,Select,Form,Alert,message} from 'antd'
import MaterialsStore from "../materials.store";
import {MaterialsInfoAdd} from '../materials.service'
import { observer } from 'mobx-react';
import {when} from 'mobx'
const {Option} =Select;
const inf="该类型的信息已经存在是否还要继续添加？继续添加，该信息会覆盖原有信息，仍要添加关闭此弹框后再次点击提交即可，取消请点击取消按钮"
@observer
class MaterialsStateModal extends Component{
    constructor(props){
      super(props)
      this.state={
        Materhide:false,
        isdisabled:false,
        backKey:"",
        iserr:false,
        select:[]
      }


    }
  // fetchMaterSelect
  changeDisabled=(flag)=>{
     this.setState({isdisabled:flag})
  }
  OnokMater=()=>{
    // this.setState({Materhide:true})
  }
  OnCancelMater=()=>{
    MaterialsStore.changeVisible(false)
    MaterialsStore.changeFlag(false)
    this.clearForm()
  }
  handleSubmit=()=>{

  }
  changValue=(type)=>e=>{
    console.log(type,e.target.value)
  }
  handleChangeValue=(value)=>{
      console.log(value)
  }
  handleValue=(v)=>{
    MaterialsStore.fetchMaterSelect(v)
  }
  componentDidMount(){
    when(() => (MaterialsStore.materflag),() => this.forBackInfo(MaterialsStore.materBackInfo))
  }


  handleMaterSubmits =  (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(MaterialsStore.materType=="1"){
          let data={
            bdbhgk2:MaterialsStore.partKey,
            wzlxji1 :values.wzlxji1 ==undefined?"":values.wzlxji1 ,
            wzlxxl6i6:values.wzlxxl6i6==undefined?"":values.wzlxxl6i6,
            xxlquk:values.xxlquk==undefined?"":values.xxlquk,
            yxl7vj:values.yxl7vj==undefined?"":values.yxl7vj,
          }
          this.setMaterialsInfoAdd(data)

        }else if(MaterialsStore.materType=="2"){
          let data2={
            id:MaterialsStore.materTableId,
            bdbhgk2:MaterialsStore.partKey,
            wzlxji1 :values.wzlxji1 ==undefined?"":values.wzlxji1 ,
            wzlxxl6i6:values.wzlxxl6i6==undefined?"":values.wzlxxl6i6,
            xxlquk:values.xxlquk==undefined?"":values.xxlquk,
            yxl7vj:values.yxl7vj==undefined?"":values.yxl7vj,
          }
          this.setMaterialsInfoAdd(data2)
        }
        MaterialsStore.changeFlag(false)
        this.clearForm()
      }
    })
  }
  //回填
  forBackInfo=(arr)=>{
   this.handleValue(arr.wzlxji1)
    MaterialsStore.updateKey(arr.bdbhgk2)
    MaterialsStore.getPartKey(arr.buduiId)
    this.props.form.setFieldsValue({
      wzlxji1 :arr.wzlxji1 ==undefined?"":arr.wzlxji1,
      wzlxxl6i6:arr.wzlxxl6i6 ==undefined?"":arr.wzlxxl6i6,
      xxlquk:arr.xxlquk==undefined?"":arr.xxlquk,
      yxl7vj:arr.yxl7vj==undefined?"":arr.yxl7vj,
    })
  }
  //初始化
  clearForm=()=>{
    this.props.form.setFieldsValue({
      wzlxji1 :"" ,
      wzlxxl6i6:"",
      xxlquk:"",
      yxl7vj:"",
    })
  }

  errClose=()=>{

  }

 async setMaterialsInfoAdd(data){
 let msg=  await  MaterialsInfoAdd(data)
  if(msg.statusCode==200){
    message.success("保存成功")
    this.props.upTable()
    MaterialsStore.changeVisible(false)
  }
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return(
        <Modal
          title="物资信息维护"
          visible={MaterialsStore.isVisible}
          onCancel={this.OnCancelMater}
          footer={null}
          width={800}
          style={{top:100}}
          destroyOnClose={true}
          forceRender={true}
        >
          <div style={{width:"100%",height:"100%"}}>
              <Form onSubmit={this.handleMaterSubmits} className="state-list">
                <Row  gutter={8}>
                  <Col span={12}>
                    <Form.Item label="所属单位">
                      <Input  value={MaterialsStore.setKey}  disabled={true} style={{width:"180px",marginLeft: "50px"}}/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row  gutter={8}>
                  <Col span={12}>
                    <Form.Item label="物资类型(大类)">
                      {getFieldDecorator("wzlxji1",{
                        rules: [{ required: true, message: '类型不能为空!' }],
                        initialValue: MaterialsStore.materBackInfo.wzlxji1
                      })(
                        <Select
                          onChange={this.handleValue}
                          style={{width:"180px"}}
                        >
                          {(MaterialsStore.materselect||[]).map((item,index)=>{
                            return <Option key={index} value={item.value}>{item.name}</Option>
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="物资类型(小类)">
                      {getFieldDecorator("wzlxxl6i6", {
                        rules: [{ required: true, message: '类型不能为空!' }],
                        initialValue: MaterialsStore.materBackInfo.wzlxxl6i6
                      })(
                        <Select
                          onChange={this.handleChangeValue}
                          style={{width:"180px"}}
                        >
                          {(MaterialsStore.matersmalselect||[]).map((item,index)=>{
                            return <Option key={index} value={item.value}>{item.name}</Option>
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row  gutter={8}>
                  <Col span={12}>
                    <Form.Item label="携行量">
                      {getFieldDecorator("xxlquk", {
                        rules: [{
                          required: true,
                          pattern:new RegExp(/^[1-9]\d*$/,"g"),
                          message: '只能输入数字，且不能为空!',
                        }],
                        initialValue: MaterialsStore.materBackInfo.xxlquk
                      })(
                        <Input  style={{width:"180px",marginLeft: "52px"}}disabled={this.state.isdisabled}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="运行量">
                      {getFieldDecorator("yxl7vj", {
                        rules: [{
                          required: true,
                          pattern:new RegExp(/^[1-9]\d*$/,"g"),
                          message: '只能输入数字，且不能为空!',
                        }],
                        initialValue: MaterialsStore.materBackInfo.yxl7vj
                      })(
                        <Input style={{width:"180px",marginLeft: "51px"}} disabled={this.state.isdisabled}/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <div className={this.state.iserr?'showalt':'hidealt'}>
                  <Alert
                    message="类型重复警告"
                    description={inf}
                    closable
                    onClose={this.errClose}
                  >
                  </Alert>
                </div>
              </Form>
            <HGroup className="footer-sub">
              <Button type="primary" style={{marginRight:"8px"}} onClick={this.handleMaterSubmits} disabled={MaterialsStore.isEditBtn}>提交</Button>
              <Button disabled={this.state.isdisabled} onClick={this.OnCancelMater}>取消</Button>
            </HGroup>
          </div>
        </Modal>)
  }
}
const MaterNormaModalForm = Form.create({ name: 'combats_Modal' })(MaterialsStateModal);
export default MaterNormaModalForm

