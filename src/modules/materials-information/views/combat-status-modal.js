import React, { Component } from 'react'
import {HGroup} from 'v-block.lite/layout'
import MaterStore from '../materials.store'
import {Form,Input,Row,Col,Button,Select,message,Table,Icon} from 'antd'
import { observer } from 'mobx-react';
import {reaction} from 'mobx'
import {deleteCombatStatus} from '../materials.service'

const { Option } = Select
const infolis=[
  "满编率：装备数（实有数） 比 编制数",
  "完好率：完好数 比 在位数（实有数)",
  "配套率：实际配套数 比 编制数",
  "出动率：出动数 比 编制数",
  "战备储备达标率：用户直接录入最终值（中文也可)"
]
@observer
class CombatStatusModal extends Component{
     constructor(props){
       super(props)
       this.state={
         tables:[],
         loading:false,
         flag:1,
         isShowMeun:false,
         pagination: {
           total:"",
           pageSize:3,
           current:1,
         },
       }
        this.columns = [
         {
           "dataIndex" : "bdbhofl",
           "title" : "部队名称"
         }, {
           "dataIndex" : "zhuangbeidalei",
           "title" : "装备大类"
         }, {
           "dataIndex" : "zhuangbeileixing",
           "title" : "装备小类"
         }, {
           "dataIndex" : "bzsud7",
           "title" : "编制数"
         }, {
           "dataIndex" : "whsmg0",
           "title" : "完好数"
         }, {
           "dataIndex" : "cds6u0",
           "title" : "出动数"
         }, {
           "dataIndex" : "biaozhunlv",
           "title" : "标准率"
         }, {
           "dataIndex" : "chubeilv",
           "title" : "储备率"
         }, {
           "dataIndex" : "sjptso9rpz",
           "title" : "实际配套数(品种)"
         }, {
           "dataIndex" : "sjptso9rsl",
           "title" : "实际配套数(数量)"
         },
         {
           title: "操作",
             render: (text,record) => (
           <HGroup horizontalAlign="center" verticalAlign="center" gap="5px">
             <div
               className="table-row-btn edit-btn"
               onClick={()=>{this.editRowCombat(record)}}
               size="small"
             >
               编辑
             </div>
             <div
               className="table-row-btn delete-btn"
               onClick={()=>{this.deleteRowCombat(record)}}
               size="small"
             >
               删除
             </div>
           </HGroup>
         )
       }
     ]
     }
  componentDidMount(){
    let lis={
      current:1,
      pageSize:3,
      id:MaterStore.partKey
    }
    this.getClun(lis)
    reaction(() => [MaterStore.partKey],(arr) => {
      let lis={
        current:1,
        pageSize:3,
        id:arr[0]
      }
       this.getClun(lis)
    })

  }

  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }

    changeType=(v)=>{
      MaterStore.fetchSelect(v)
    }
    changeTypes=(e)=>{
      // bdbhofl    部队编号
    console.log(e)
    }
    editRowCombat=async(r)=>{
     await MaterStore.fetchCombatStatusById(r.id)
     await MaterStore.changeCombatStatus("2")
      await this.forbackInfo()
    }

   deleteRowCombat= async(r)=>{
     let res=await deleteCombatStatus(r.id)
     if(res.statusCode==200) {
       message.success("删除成功")
       let lis={
         current:1,
         pageSize:3,
         id:MaterStore.partKey
       }
       this.getClun(lis)
     }
    }

    //分页
    handleTableChange = (pagination) => {
      let current = pagination.current;
      this.setState({
        pagination:{
          current:current,
          pageSize:3
        }
      });
      let data={
        current:current,
        pageSize:3,
        id:MaterStore.partKey,
      }
      this.getClun(data)
    };
    showInfo=()=>{
      this.setState({isShowMeun:true})
    }
    showInfos=()=>{
      this.setState({isShowMeun:false})
    }
 handleSubmits =  (e) => {
    e.preventDefault();
     this.props.form.validateFields((err, values) => {
      if (!err) {
        let data={};
        if(MaterStore.combatStatus==1){
          data={
            bdbhofl:MaterStore.partKey,
            zhuangbeidalei:values.zhuangbeidalei==undefined?"":values.zhuangbeidalei,
            zhuangbeileixing:values.zhuangbeileixing==undefined?"":values.zhuangbeileixing,
            bzsud7:values.bzsud7==undefined?"":values.bzsud7,
            whsmg0:values.whsmg0==undefined?"":values.whsmg0,
            cds6u0:values.cds6u0==undefined?"":values.cds6u0,
            chubeilv:values.chubeilv==undefined?"":values.chubeilv,
            biaozhunlv:values.biaozhunlv==undefined?"":values.biaozhunlv,
            sjptso9rpz:values.sjptso9rpz==undefined?"":values.sjptso9rpz,
            sjptso9rsl:values.sjptso9rsl==undefined?"":values.sjptso9rsl
          }
        }else {
          data={
            id:MaterStore.combatStatusBack.id,
            bdbhofl:MaterStore.partKey,
            zhuangbeidalei:values.zhuangbeidalei==undefined?"":values.zhuangbeidalei,
            zhuangbeileixing:values.zhuangbeileixing==undefined?"":values.zhuangbeileixing,
            bzsud7:values.bzsud7==undefined?"":values.bzsud7,
            whsmg0:values.whsmg0==undefined?"":values.whsmg0,
            cds6u0:values.cds6u0==undefined?"":values.cds6u0,
            chubeilv:values.chubeilv==undefined?"":values.chubeilv,
            biaozhunlv:values.biaozhunlv==undefined?"":values.biaozhunlv,
            sjptso9rpz:values.sjptso9rpz==undefined?"":values.sjptso9rpz,
            sjptso9rsl:values.sjptso9rsl==undefined?"":values.sjptso9rsl
          }
        }

        this.addCombatStatus(data)

      }
    })
  }
  forbackInfo=()=>{
    this.props.form.setFieldsValue({
      zhuangbeidalei:MaterStore.combatStatusBack.zhuangbeidalei,
      zhuangbeileixing:MaterStore.combatStatusBack.zhuangbeileixing,
      bzsud7:MaterStore.combatStatusBack.bzsud7,
      whsmg0:MaterStore.combatStatusBack.whsmg0,
      cds6u0:MaterStore.combatStatusBack.cds6u0,
      chubeilv:MaterStore.combatStatusBack.chubeilv,
      biaozhunlv:MaterStore.combatStatusBack.biaozhunlv,
      sjptso9rpz:MaterStore.combatStatusBack.sjptso9rpz,
      sjptso9rsl:MaterStore.combatStatusBack.sjptso9rsl
    })
  }
  //初始化
  clearForm=()=>{
    this.props.form.resetFields()
  }
  //新增/修改装备信息
  async addCombatStatus(data){
    await MaterStore.fetchCombatStatus(data)
    let datas={
      current:1,
      pageSize:3,
      id:MaterStore.partKey,
    }
    message.success("保存成功")
    this.getClun(datas)
    this.clearForm()
    MaterStore.changeCombatStatus("1")
  }
     async getClun(data){
         await  MaterStore.fetchCombatStatusTable(data)
         let tep=MaterStore.combatStatusTable;
         let tabledata=tep.sourceData;
         await this.setState({tables:tabledata})
         await this.setState({pagination:{total:tep.total}})
      }
    render(){
      const { getFieldDecorator } = this.props.form;
     return(
       <div style={{width:"100%",height:"100%",position:"relative"}}>
         <Form onSubmit={this.handleSubmits} className="troops-form">
           <Row gutter={8}>
             <Col span={8}>
               <Form.Item label="装备类型大类">
                 {getFieldDecorator('zhuangbeidalei', {
                   rules: [{ required: true, message: '类型不能不能为空!' }],
                   initialValue:"",
                 })(
                   <Select
                     onChange={this.changeType}
                     style={{width:"130px",marginLeft: "5px"}}
                   >
                     {(MaterStore.combatselect||[]).map((item,index)=>{
                       return <Option key={index} value={item.value}>{item.name}</Option>
                     })}
                   </Select>
                 )}
               </Form.Item>
             </Col>
             <Col span={8}>
               <Form.Item label="装备类型小类">
                 {getFieldDecorator('zhuangbeileixing', {
                   rules: [{ required: true, message: '类型不能不能为空!' }],
                   initialValue: "",
                 })(
                   <Select
                     onChange={this.changeTypes}
                     style={{width:"130px",marginLeft: "40px"}}
                   >
                     {(MaterStore.smallselect||[]).map((item,index)=>{
                       return <Option key={index} value={item.value}>{item.name}</Option>
                     })}
                   </Select>
                 )}
               </Form.Item>
             </Col>
             <Col span={8}>
               <Form.Item label="装备编制数">
                 {getFieldDecorator('bzsud7', {
                   initialValue:"",
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }]
                 })(
                    <Input style={{width:"130px",marginLeft:"55px"}}/>
                 )}
               </Form.Item>
             </Col>
           </Row>
           <Row gutter={8}>
             <Col span={8}>
               <Form.Item label="完好数">
                 {getFieldDecorator('whsmg0', {
                   initialValue:"",
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }]
                 })(
                   <Input style={{width:"130px",marginLeft:"47px"}}/>
                 )}
               </Form.Item>
             </Col>
             <Col span={8}>
               <Form.Item label="出动数">
                 {getFieldDecorator('cds6u0', {
                   initialValue:"",
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }]

                 })(
                   <Input style={{width:"130px",marginLeft:"84px"}} />
                 )}
               </Form.Item>
             </Col>
             <Col span={8}>
               <Form.Item label="储备率">
                 {getFieldDecorator('chubeilv', {
                   initialValue: "",
                 })(
                   <Input style={{width:"130px",marginLeft:"95px"}}/>
                 )}
               </Form.Item>
             </Col>
           </Row>
           <Row gutter={8}>
             <Col span={8}>
               <Form.Item label="标准率">
                 {getFieldDecorator('biaozhunlv', {
                   initialValue: "",

                 })(
                   <Input style={{width:"130px",marginLeft:"57px"}}/>
                 )}
               </Form.Item>
             </Col>

             <Col span={8}>
               <Form.Item label="实际配套数（品种）">
                 {getFieldDecorator('sjptso9rpz', {
                   initialValue: "",
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }]

                 })(
                   <Input style={{width:"130px"}}/>
                 )}
               </Form.Item>
             </Col>
             <Col span={8}>
               <Form.Item label="实际配套数（数量）">
                 {getFieldDecorator('sjptso9rsl', {
                   initialValue: "",
                   rules: [{
                     required: true,
                     pattern:new RegExp(/^[1-9]\d*$/,"g"),
                     message: '只能输入数字，且不能为空!',
                   }]
                 })(
                   <Input  style={{width:"130px"}}/>
                 )}
               </Form.Item>
             </Col>
           </Row>
         </Form>
         <span className="question" onMouseEnter={this.showInfo} onMouseLeave={this.showInfos}><Icon  type="question-circle"/></span>
         <div className={this.state.isShowMeun?"question-info":"question-info-hide"}>
           <p>
             装备五率计算公式:
           </p>
           <div>
             {
               infolis.map((itm,idx)=>{
                 return <p key={idx}>{itm}</p>
               })
             }
           </div>
         </div>
         <Button type="primary" onClick={this.handleSubmits}>保存</Button>
         <HGroup style={{width:"100%",height:"3px",borderBottom:"1px solid #04987f"}}></HGroup>
         <div className="combat-modal-table">
           <Table
             columns={this.columns}
             dataSource={this.state.tables}
             loading={this.state.loading}
             pagination={{
               ...this.state.pagination,
               showTotal: total => `共 ${total} 条`
             }}
             onChange={this.handleTableChange}
             style={{width:"100%"}}
           />
         </div>
       </div>
     )
     }
}
const CombatNormaModalForm = Form.create({ name: 'combats_Modal' })(CombatStatusModal);
export default CombatNormaModalForm
