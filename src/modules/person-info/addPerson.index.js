import "./addPerson.less";
import React, { Component } from "react";
import { Route , withRouter } from "react-router-dom";
import { observer } from 'mobx-react'
import { HGroup, VGroup } from "v-block.lite/layout";
import {Form,Row,Col,Input,Button,Icon,Select,Tag,Upload,message,DatePicker} from "antd";
import moment from 'moment';
import { submitPerson , getPersonnelById, getColumns, getBdNameById ,isRepeatByRybh } from './person.service'
import personDirctStore from './personDirct.store';
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';


const fixedColumns = ["ryzp1dr","xm2er","rybhnvh","xb6h6","csnyfme","tcdcc","xlszmk9","rylx7bm","ssdwkc5","zw75d","jxahh","grllm7c","jtbj4vg","shgxf5n","zjxy9qf","xl7l8","jg9i1","zzmmsbm","rylbu0o","mz32r","rwsjrok","zjhm3d"];
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function optionGenerate(options){
  if(!options) return null;
  let arr = [];
  options.forEach((v,i) => arr.push(<Option key={i} value={v.value}>{v.name}</Option>));
  return arr;
}

class AddPerson extends Component {
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
        sex:  res.data.xb6h6, //性别
        militaryAppointment: res.data.zw75d, //军职
        militaryRank: res.data.jxahh, //军衔
        personId: res.data.rybhnvh, //人员编号
        personType: res.data.rylx7bm, //人员类型
        rylb: res.data.rylbu0o, //人员类别
        birth: res.data.csnyfme, //生日
        enlisted: res.data.rwsjrok, //入伍时间
        xl:res.data.xl7l8, //学历
        jg:res.data.jg9i1,//籍贯
        certificateNum:res.data.zjhm3d, //证件号
        nation: res.data.mz32r, //民族
        psychological: res.data.xlszmk9, //心理素质
        religious:  res.data.zjxy9qf, // 宗教信仰
        zzmmsbm:res.data.zzmmsbm,
        customs:customColumns
      })
      this.props.form.setFieldsValue({
        name: res.data.xm2er, //姓名
        sex:  res.data.xb6h6, //性别
        militaryAppointment: res.data.zw75d, //军职
        militaryRank: res.data.jxahh, //军衔
        personId: res.data.rybhnvh, //人员编号
        personType: res.data.rylx7bm, //人员类型
        rylb: res.data.rylbu0o, //人员类别
        birth: res.data.csnyfme ? moment(res.data.csnyfme,dateFormat) : null, //生日
        enlisted: res.data.rwsjrok ? moment(res.data.rwsjrok,dateFormat) : null, //入伍时间
        certificateNum:res.data.zjhm3d, //证件号
        xl:res.data.xl7l8,//学历
        jg:res.data.jg9i1,//籍贯
        nation: res.data.mz32r, //民族
        psychological: res.data.xlszmk9, //心理素质
        religious:  res.data.zjxy9qf, // 宗教信仰
        zzmmsbm:res.data.zzmmsbm,
      });
    } else {
        this.setState({customs:customColumns})
    }
  }

  changeHandler = type => e => {
    this.setState({ [type]: e.target.value });
  };

  selectChange = type => val => {
    this.setState({ [type]: val });
  };

  dateChange = type => (date,dateStr) => {
    this.setState({
      [type]:dateStr
    })
  }
  beforeUpload = (file) => {
    const requiredInfo = this.state.name && this.state.personId;
    if(!requiredInfo){
      message.error("上传照片必须先填写姓名和人员编号!");
      return false;
    }
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传JPG/PNG格式的照片!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error("所传照片不能超过20MB!");
      return false;
    }
    return isJpgOrPng && isLt2M;
  }
  //上传照片
  photoChange = async info => {
    await this.setState({photoParam:""});
    if (info.file.status === "uploading") {
      this.setState({ photoLoading: true });
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, photoUrl =>{
        if(info.file.response.statusCode !== 200){
          message.error("照片上传失败!");
          this.setState({ photo: "", photoLoading: false })
        } else {
          this.setState({ photo: photoUrl, photoLoading: false })
        }
      }
      );
      let res = info.file.response.data;
      await this.setState({photoParam:`${res.fileName},${res.filePath}`})
    }
  };


  //新增自定义列
  // addCustom = () => {
  //   if(this.state.customType){
  //     this.setState({visible2:true});
  //   } else {
  //     message.error('请先选择自定义列类型!');
  //   }
  // }
  //提交
  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( async (err, values) => {
      if (!err) {
        if(!this.state.id){//新增提交需要验证人员编号是否重复
          let res = await isRepeatByRybh({rybhnvh:this.state.personId});
          if(res.data) return message.error("人员编号已存在!");
        }
        let submitParams = {};
        let customParams = {};
        this.state.customs.map(v => {customParams[v.key] = v.value});
        console.log(this.state.photoParam)
        let params = {
          ...customParams,
          xm2er:this.state.name,
          rybhnvh:this.state.personId,
          xb6h6:this.state.sex,
          csnyfme:this.state.birth,
          tcdcc:this.state.specialSkills.join(','),
          xlszmk9:this.state.psychological,
          rylx7bm:this.state.personType,
          ssdwkc5:this.state.treeKey,
          zw75d:this.state.militaryAppointment,
          jxahh:this.state.militaryRank,
          zjhm3d:this.state.certificateNum,
          rylbu0o:this.state.rylb,
          mz32r:this.state.nation,
          grllm7c:this.state.resume,
          jtbj4vg:this.state.family,
          shgxf5n:this.state.social,
          rwsjrok:this.state.enlisted,
          zjxy9qf:this.state.religious,
          ryzp1dr:this.state.photoParam,
          zzmmsbm:this.state.zzmmsbm,
          xl7l8:this.state.xl,
          jg9i1:this.state.jg
        }
        this.state.id ?  submitParams = {...params,id:this.state.id} : submitParams = params;
        let res = await submitPerson(submitParams);
        if(res.statusCode == 200){
           message.success(res.message);
           this.props.history.push({
             pathname:'/entryInfo/personInfo'
           })
        } else {
           message.error(res.message);
        }
      }
    });
  };
  //取消
  handleReset = () => {
    this.props.form.resetFields();
    this.props.history.push({pathname:'/entryInfo/personInfo'})
  };

  inputNewSkill = e => {
    this.setState({ addSkillTxt: e.target.value });
  };

  //添加特长
  addSkillHandle = (e) => {
    e.preventDefault();
    if(this.state.addSkillTxt){
      this.setState({
        specialSkills: [...this.state.specialSkills, this.state.addSkillTxt],
        visible: false,
        addSkillTxt: ""
      });
    }
    this.setState({inputSkillStatu:false})
  }

  //去掉特长
  removeSkill = removeSkill => {
    const tags = this.state.specialSkills.filter(tag => tag !== removeSkill);
    this.setState({specialSkills: tags });
  }

  // modalOk2 = e => {
  //   let customs = this.state.customs;
  //   if(!this.state.addNewValue){
  //     message.error('请输入自定义内容!');
  //   } else {
  //     customs.push({name:this.state.customType,value:this.state.addNewValue});
  //   }
  //   this.setState({customs,visible2: false, addNewValue: ""});
  // };
  // modalCancel2 = e => {
  //   this.setState({ visible2: false, addNewValue: "" });
  // };

  customInput = (index,custom) => e => {
    let customs = this.state.customs;
    customs[index]['value'] = e.target.value;
    this.setState({customs});
  }

  saveInputRef = input => (this.input = input);

  render() {
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.photoLoading ? "loading" : "plus"} />
        <div>上传照片</div>
      </div>
    );
    return (
      <Form className="addPerson-form" onSubmit={this.handleSubmit}  autoComplete="off" >
        <HGroup style={{ marginBottom: "10px" }}>
          <VGroup className="form-div" gap="10px">
            <Row className="addperson-form-row">
              <Col span={7}>
                <Form.Item label="姓名">
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "姓名不能为空"
                      }
                    ]
                  })(
                    <Input
                      disabled={this.state.editable}
                      style={{ width: "150px" }}
                      onChange={this.changeHandler("name")}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="性别">
                  {getFieldDecorator("sex", {
                    rules: [
                      {
                        required: false,
                        message: "性别不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Select
                      style={{ width: "80px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("sex")}
                    >
                      {optionGenerate(personDirctStore.xb)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="军职">
                  {getFieldDecorator("militaryAppointment", {
                    rules: [
                      {
                        required: false,
                        message: "军职不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Select
                      style={{ width: "120px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("militaryAppointment")}
                    >
                    {optionGenerate(personDirctStore.jz)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="军衔">
                  {getFieldDecorator("militaryRank", {
                    rules: [
                      {
                        required: false,
                        message: "军衔不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Select
                      style={{ width: "100px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("militaryRank")}
                    >
                    {optionGenerate(personDirctStore.jx)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className="addperson-form-row">
              <Col span={7}>
                <Form.Item label="人员编号">
                  {getFieldDecorator("personId", {
                    rules: [
                      {
                        required: true,
                        message: "人员编号不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Input
                      disabled={this.state.editable}
                      onChange={this.changeHandler("personId")}
                      style={{ width: "150px" }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="民族">
                  {getFieldDecorator("nation", {
                    rules: [
                      {
                        required: false,
                        message: "民族不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Select
                      style={{ width: "80px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("nation")}
                    >
                    {optionGenerate(personDirctStore.mz32r)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="宗教信仰">
                  {getFieldDecorator("religious", {
                    rules: [
                      {
                        required: false,
                        message: "宗教信仰不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Select
                      style={{ width: "120px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("religious")}
                    >
                    {optionGenerate(personDirctStore.zjxy)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="心理素质">
                  {getFieldDecorator("psychological", {
                    rules: [
                      {
                        required: false,
                        message: "心理素质不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Select
                      style={{ width: "100px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("psychological")}
                    >
                    {optionGenerate(personDirctStore.xlsz)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className="addperson-form-row">
              <Col span={10}>
                <Form.Item label="籍贯">
                  {getFieldDecorator("jg", {
                    rules: [
                      {
                        required: false,
                        message: "籍贯不能为空"
                      }
                    ]
                  })(
                    <Input
                      disabled={this.state.editable}
                      style={{ width: "250px" }}
                      onChange={this.changeHandler("jg")}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="政治面貌">
                  {getFieldDecorator("zzmmsbm", {
                    rules: [
                      {
                        required: false,
                        message: "政治面貌不能为空"
                      }
                    ]
                  })(
                    <Select
                      style={{ width: "120px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("zzmmsbm")}
                    >
                    {optionGenerate(personDirctStore.zzmm)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="学历">
                    {getFieldDecorator("xl", {
                      rules: [
                        {
                          required: false,
                          message: "学历不能为空"
                        }
                      ]
                    })(
                      <Select
                      style={{ width: "150px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("xl")}
                    >
                    {optionGenerate(personDirctStore.xl)}
                    </Select>
                    )}
                </Form.Item>
              </Col>
            </Row>
            <Row className="addperson-form-row">
              <Col span={10}>
                <Form.Item label="隶属关系">
                  <Input
                    value={this.state.affiliation}
                    style={{ width: "250px" }}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="人员类别">
                  {getFieldDecorator("rylb", {
                    rules: [
                      {
                        required: true,
                        message: "人员类别不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Select
                      style={{ width: "120px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("rylb")}
                    >
                    {optionGenerate(personDirctStore.rylb)}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item label="出生年月">
                  {getFieldDecorator("birth", {
                    rules: [
                      {
                        required: false,
                        message: "出生年月不能为空"
                      }
                    ]
                  })(
                    <DatePicker format={dateFormat} disabled={this.state.editable} style={{ width: "150px" }} onChange={this.dateChange('birth')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className="addperson-form-row">
              <Col span={10}>
                <Form.Item label="证件号">
                  {getFieldDecorator("certificateNum", {
                    rules: [
                      {
                        required: false,
                        message: "证件号不能为空"
                      }
                    ]
                  })(
                    <Input
                      placeholder="请输入证件号"
                      disabled={this.state.editable}
                      style={{ width: "250px" }}
                      onChange={this.changeHandler("certificateNum")}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="人员类型">
                  {getFieldDecorator("personType", {
                    rules: [
                      {
                        required: true,
                        message: "人员类型不能为空"
                      }
                    ],
                    initialValue: ""
                  })(
                    <Select
                      style={{ width: "120px" }}
                      disabled={this.state.editable}
                      onChange={this.selectChange("personType")}
                    >
                    {optionGenerate(personDirctStore.rylx)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="入伍时间">
                  {getFieldDecorator("enlisted", {
                    rules: [
                      {
                        required: false,
                        message: "入伍时间不能为空"
                      }
                    ]
                  })(
                    <DatePicker format={dateFormat} disabled={this.state.editable} style={{ width: "150px" }} onChange={this.dateChange('enlisted')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </VGroup>

          <div className="photoBox">
            <Upload
                accept=".jpg,.jpeg,.png"
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                disabled={this.state.editable}
                showUploadList={false}
                action="/api/enemy/personnelinfo/fileUpload"
                data={{rybhnvh:this.state.personId,xm2er:this.state.name,isbatch:false}}
                beforeUpload={this.beforeUpload}
                onChange={this.photoChange}
              >
                {this.state.photo ? (
                  <img src={this.state.photo} style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
            </Upload>
          </div>
        </HGroup>

        <Row className="addperson-form-row">
          <Form.Item label="特长">
            {this.state.specialSkills.length>0 && this.state.specialSkills.map((skill, index) => (
              <Tag key={index}  closable={!this.state.editable} onClose={() => this.removeSkill(skill)}>{skill}</Tag>
            ))}
            {
              !this.state.editable && (!this.state.inputSkillStatu ?  <Tag onClick={() => this.setState({inputSkillStatu:true})} style={{ background: "#04987f",borderStyle: "dashed",borderColor: "#04987f",color:"#fff"}}><Icon type="plus" /> 添加特长</Tag> :
                <Input ref={this.saveInputRef} type="text" size="small" style={{ width: 78 }} value={this.state.addSkillTxt} onChange={this.changeHandler("addSkillTxt")} onBlur={this.addSkillHandle} onPressEnter={this.addSkillHandle}/>
              )
            }

          </Form.Item>
        </Row>
        <Row className="addperson-form-row">
          <Form.Item label="个人履历">
            <TextArea rows={3} onChange={this.changeHandler("resume")} disabled={this.state.editable} value={this.state.resume}/>
          </Form.Item>
        </Row>
        <Row className="addperson-form-row">
          <Form.Item label="家庭背景">
            <TextArea rows={3} onChange={this.changeHandler("family")} disabled={this.state.editable} value={this.state.family} />
          </Form.Item>
        </Row>
        <Row className="addperson-form-row">
          <Form.Item label="社会关系">
            <TextArea rows={3} onChange={this.changeHandler("social")} disabled={this.state.editable} value={this.state.social} />
          </Form.Item>
        </Row>
       {/* {
        !this.state.editable && (<Row className="addperson-form-row">
          <Form.Item label="自定义列">
            <Row>
              <HGroup verticalAlign="center" horizontalAlign="space-between" style={{ height: "100%", padding: "0px 20px" }}>
                <HGroup gap="20px" verticalAlign="center" horizontalAlign="space-between">
                  <Select style={{ width: "100px" }} value={this.state.customType} onChange={this.selectChange('customType')}>
                    <Option value="自定义1">自定义1</Option>
                  </Select>
                  <Button type="primary" icon="plus" size="small" onClick={this.addCustom}/>
                </HGroup>
                <Button type="link" size="small">添加自定义项</Button>
              </HGroup>
            </Row>
          </Form.Item>
        </Row>)
       } */}
        <Row>
          <VGroup gap="10px">
              {this.state.customs.map((custom,index) => (
                <HGroup key={index} verticalAlign="center" gap="5px">
                  <span style={{width:'100px'}}>{custom.name}</span>
                  <Input value={custom.value} disabled={this.state.editable} style={{width:'400px'}} onChange={this.customInput(index,custom)}/>
                </HGroup>
              ))}
          </VGroup>
        </Row>
        {
          !this.state.editable ? (
            <Row style={{marginTop:"10px"}}>
              <Col span={24} style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit" >提交</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}  >取消</Button>
              </Col>
            </Row>) : (
            <Row style={{marginTop:"10px"}}>
              <Col span={24} style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit" onClick={this.handleReset}>关闭</Button>
              </Col>
            </Row>)
        }


        {/* <Modal title="添加自定义" visible={this.state.visible2} onOk={this.modalOk2} onCancel={this.modalCancel2} width={380} okText="添加" cancelText="取消">
            <VGroup gap="20px">
                <HGroup horizontalAlign="center" verticalAlign="center" gap="10px">
                    <span className="label-span">自定义内容:</span>
                    <Input style={{ width: "200px" }} value={this.state.addNewValue} onChange={this.changeHandler("addNewValue")} />
                </HGroup>
            </VGroup>
        </Modal> */}
      </Form>
    );
  }
}
const WrappedAddForm = Form.create({ name: "addperson" })(AddPersonForm);
export default AddPerson;
export const AddPersonRoute = (
  <Route exact path="/entryInfo/personInfo/addPerson" component={AddPerson} />
);
