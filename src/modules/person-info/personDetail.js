import "./addPerson.less";
import React, { Component } from "react";
import { Route , withRouter } from "react-router-dom";
import { observer } from 'mobx-react'
import { HGroup, VGroup } from "v-block.lite/layout";
import {Form,Row,Col,Button,Tag} from "antd";
import { getPersonnelById, getColumns, getBdNameById  } from './person.service'


const fixedColumns = ["ryzp1dr","xm2er","rybhnvh","xb6h6","csnyfme","tcdcc","xlszmk9","rylx7bm","ssdwkc5","zw75d","jxahh","grllm7c","jtbj4vg","shgxf5n","zjxy9qf","xl7l8","jg9i1","zzmmsbm","rylbu0o","mz32r","rwsjrok","zjhm3d"];

class PersonDetail extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <HGroup horizontalAlign="center">
        <WrappedAddForm />
      </HGroup>
    );
  }
}

@withRouter
@observer
class AddPersonForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeKey:null,
      id:null,
      inputSkillStatu:false,
      editable:false,
      photoLoading: false,
      photo: "", //照片
      photoParam:"",
      name: "", //姓名
      sex: "", //性别
      militaryAppointment: "", //军职
      militaryRank: "", //军衔
      personId: "", //人员编号
      personType: "一般人员", //人员类型
      rylb:"", //人员类别
      birth: null, //生日
      affiliation: "", //隶属关系
      enlisted:null, //入伍时间
      certificateNum: "", //证件号
      xl:"",
      jg:"",
      nation: "", //民族
      psychological: "", //心理素质
      religious: "", // 宗教信仰
      zzmmsbm:"",//政治面貌 --------------------暂缺
      specialSkills: [], //特长
      resume: "", //个人履历
      family: "", //家庭背景
      social: "", //社会关系
      // visible2: false,
      // customType:"",//自定义类型
      // addNewValue:"", //自定义内容
      addSkillTxt: "", //新增特长
      customs:[]
    };
  }
  componentDidMount(){
    const { location } = this.props;
    let recvParam;
    if(location.state){ //如果路由有参数
      recvParam = location.state;
      sessionStorage.setItem('data',JSON.stringify(recvParam));
    } else {
      recvParam = JSON.parse(sessionStorage.getItem('data'));
    }
    this.queryPersonnelById(recvParam);
  }

  componentWillUnmount(){
    if(sessionStorage.getItem('data')){
      sessionStorage.removeItem('data');
    }
  }

  queryBdName = async (id) =>{
    let res = await getBdNameById({id});
    this.setState({
      affiliation:res.data,
      treeKey:id
    })
  }
  //处理数据得到自定义列
  getCustomVos = async () => {
    let res = await getColumns();
    let allColumns = res.data.customColumnVos;
    let customColumns = [];
    allColumns.map(c => {
      let isHas = fixedColumns.includes(c.columnName);
      if(!isHas){
        customColumns.push({name:c.clnComments,key:c.columnName,value:""});
      }
    })
    return customColumns;
  }
  async queryPersonnelById(params){
    this.queryBdName(params.treeKey);
    let customColumns = await this.getCustomVos(); //自定义集合
    if(params.id){//如果是查看或编辑
      let res = await getPersonnelById({id:params.id});
      customColumns.forEach(v => {
        v.value = res.data[v.key]
      });
      await this.setState({
        id:params.id,
        editable:params.editable,
        photoParam:res.data.ryzp1dr,
        photo:res.data.ryzp1dr&&res.data.ryzp1dr.split(',')[1], //照片
        specialSkills:res.data.tcdcc ? res.data.tcdcc.split(',') : [], //特长
        resume: res.data.grllm7c, //个人履历
        family: res.data.jtbj4vg, //家庭背景
        social: res.data.shgxf5n, //社会关系
        name: res.data.xm2er, //姓名
        sex:  res.data.xb6h6Value, //性别
        militaryAppointment: res.data.zw75dValue, //军职
        militaryRank: res.data.jxahhValue, //军衔
        personId: res.data.rybhnvh, //人员编号
        personType: res.data.rylx7bmValue, //人员类型
        rylb: res.data.rylbu0oValue, //人员类别
        birth: res.data.csnyfme, //生日
        enlisted: res.data.rwsjrok, //入伍时间
        xl:res.data.xl7l8Value, //学历
        jg:res.data.jg9i1,//籍贯
        certificateNum:res.data.zjhm3d, //证件号
        nation: res.data.mz32rValue, //民族
        psychological: res.data.xlszmk9Value, //心理素质
        religious:  res.data.zjxy9qfValue, // 宗教信仰
        zzmmsbm:res.data.zzmmsbmValue,
        customs:customColumns
      })
    } else {
        this.setState({customs:customColumns})
    }
  }


  //取消
  handleReset = () => {
    this.props.form.resetFields();
    this.props.history.push({pathname:'/entryInfo/personInfo'})
  };


  render() {
    return (
      <Form className="addPerson-form" onSubmit={this.handleSubmit}  autoComplete="off">
        <HGroup horizontalAlign="center">
          <h2 style={{color:"#fff"}}>人员信息详情</h2>
        </HGroup>
        <HGroup style={{ marginBottom: "10px" }}>
          <VGroup className="form-div" gap="10px">
            <Row className="addperson-form-row">
              <Col span={6}>
                <Form.Item label="隶属关系">
                  <span className="detail-info">{this.state.affiliation}</span>
                </Form.Item>
              </Col>
               <Col span={6}>
                 <Form.Item label="姓名">
                   <span className="detail-info">{this.state.name}</span>
                 </Form.Item>
               </Col>
              <Col span={6}>
                <Form.Item label="性别">
                  <span className="detail-info">{this.state.sex}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="籍贯">
                  <span className="detail-info">{this.state.jg}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row className="addperson-form-row">
              <Col span={6}>
                <Form.Item label="人员编号">
                  <span className="detail-info">{this.state.personId}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="民族">
                  <span className="detail-info">{this.state.nation}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="宗教信仰">
                  <span className="detail-info">{this.state.religious}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="心理素质">
                  <span className="detail-info">{this.state.psychological}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row className="addperson-form-row">
              <Col span={6}>
                <Form.Item label="出生年月">
                  <span className="detail-info">{this.state.birth}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="政治面貌">
                  <span className="detail-info">{this.state.zzmmsbm}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="学历">
                  <span className="detail-info">{this.state.xl}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="证件号">
                  <span className="detail-info">{this.state.certificateNum}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row className="addperson-form-row">
             <Col span={6}>
               <Form.Item label="军职">
                 <span className="detail-info">{this.state.militaryAppointment}</span>
               </Form.Item>
             </Col>
             <Col span={6}>
               <Form.Item label="入伍时间">
                 <span className="detail-info">{this.state.enlisted}</span>
               </Form.Item>
             </Col>
              <Col span={6}>
                <Form.Item label="人员类别">
                  <span className="detail-info">{this.state.rylb}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="人员类型">
                  <span className="detail-info">{this.state.personType}</span>
                </Form.Item>
              </Col>

            </Row>
            <Row className="addperson-form-row">

            <Col span={24}>
               <Form.Item label="军衔">
                 <span className="detail-info">{this.state.militaryRank}</span>
               </Form.Item>
             </Col>

            </Row>
          </VGroup>

          <div className="photoBox">
            <img src={this.state.photo} style={{ width: "100%" }} />
          </div>
        </HGroup>

        <Row className="addperson-form-row">
          <Form.Item label="特长">
            {this.state.specialSkills.length>0 && this.state.specialSkills.map((skill, index) => (
              <Tag key={index}  closable={!this.state.editable} onClose={() => this.removeSkill(skill)}>{skill}</Tag>
            ))}

          </Form.Item>
        </Row>
        <Row className="addperson-form-row">
          <Form.Item label="个人履历">
            <span className="detail-info">{this.state.resume}</span>
          </Form.Item>
        </Row>
        <Row className="addperson-form-row">
          <Form.Item label="家庭背景">
            <span className="detail-info">{this.state.family}</span>
          </Form.Item>
        </Row>
        <Row className="addperson-form-row">
          <Form.Item label="社会关系">
            <span className="detail-info">{this.state.social}</span>
          </Form.Item>
        </Row>
        <Row>
          <VGroup gap="10px" style={{paddingLeft:"10px"}}>
              {this.state.customs.map((custom,index) => (
                <HGroup key={index} verticalAlign="center" gap="5px">
                  <span style={{width:'100px'}}>{custom.name}</span>
                  <span className="detail-info">{custom.value}</span>
                </HGroup>
              ))}
          </VGroup>
        </Row>
        <Row style={{marginTop:"10px"}}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" onClick={this.handleReset}>关闭</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedAddForm = Form.create({ name: "addperson" })(AddPersonForm);
export default PersonDetail;
export const PersonDetailRoute = (
  <Route exact path="/entryInfo/personInfo/personDetail" component={PersonDetail} />
);
