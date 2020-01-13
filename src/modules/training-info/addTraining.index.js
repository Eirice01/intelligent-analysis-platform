import './addTraining.less';
import React, { Component } from 'react';
import { HGroup,VGroup } from "v-block.lite/layout";
import { Row, Col, Input, Select, Card, Button, InputNumber , DatePicker,message,TreeSelect,Tag } from 'antd';
import moment from 'moment';
import { observer } from 'mobx-react'
import {Route,withRouter} from 'react-router-dom';
import trainingDirctStore from './trainingDirct.store'
import { getBdNameById,trainSave,getTrainInfo,getAllCountById,getTroopsinfoTree,getRootNodeById } from './trainingInfo.service'

const {Option} = Select;
const { TextArea } = Input;
const { SHOW_PARENT } = TreeSelect;
const { TreeNode } = TreeSelect;

function optionGenerate(options){
    if(!options) return null;
    let arr = [];
    options.forEach((v,i) => arr.push(<Option key={i} value={v.value}>{v.name}</Option>));
    return arr;
}
function customsToStr(customs){
    let arr = customs.map(v => `${v.name},${v.value}`);
    let str = arr.join(';');
    return str;
}

function customsToArr(customs) {
    let customsArr = [];
    let arr = customs.split(';').filter(v => v != ',');
    if(arr.length>0) {
        arr.forEach(v => {
            let temp = v.split(',')
            customsArr.push({name:temp[0],value:temp[1]})
        })
    } else {
        customsArr.push({name:"",value:""});
    }
    return customsArr;
}
@withRouter
@observer
class AddTraining extends Component {
    state = {
        id:null,
        bdbh:"",
        value:undefined,
        treeData:[],
        editable:false,
        treeKey:null,
        affiliation:"",
        xlkm:"", //训练科目
        jtkm:[], //训练小项,
        xldd:"", //地点
        xlsj:null, //日期
        xlsd:"",//训练时段
        xlts:null, //天数
        cxbds:"",//参训部队
        cxbdLabels:"",//参训部队名称
        cxrys:[],//参训人员姓名数组
        xlry:"", //训练人员,
        xlnr:"", //训练内容
        xlxg:"", //训练效果,
        rwcj:"",//任务场景
        xljd:0,//训练进度
        bjgl:0, //不及格率
        yxl:0, //优秀率
        lhl:0,//良好率
        khwcl:0, //考核完成率
        xljf:[{name:"",value:""}], //训练经费
        dyxh:[{name:"",value:""}], //弹药消耗
        ylxh:[{name:"",value:""}], //油料消耗
        mtxs:[{name:"",value:""}], //摩托小时
        fxxs:[{name:"",value:""}], //飞行小时
        validateObj:{
          xlkm:true,
          jtkm:true,
          xldd:true,
          xlsj:true,
          cxbd:true
        }
    }

    componentDidMount() {
        const { location } = this.props;
        let recvParam;
        if(location.state){ //如果路由有参数
            recvParam = location.state;
            sessionStorage.setItem('data',JSON.stringify(recvParam));
        } else {
        recvParam = JSON.parse(sessionStorage.getItem('data'));
        }
        this.firstQueryTreeData(recvParam.treeKey);
        this.queryTrainingInfo(recvParam);
    }
    componentWillUnmount(){
        if(sessionStorage.getItem('data')){
          sessionStorage.removeItem('data');
        }
        this.setState = (state,callback) => {return}
    }

    async queryTrainingInfo(recvParam)  {
        //获得所属部队
        let res = await getBdNameById({id:recvParam.treeKey});
        this.setState({
            affiliation:res.data,
            bdbh:recvParam.bdbh,
            treeKey:recvParam.treeKey
        })
        if(recvParam.id){//如果是查看或编辑
             let res = await getTrainInfo(recvParam.id);
             let {complete,consume} = res.data;
            //请求具体科目下拉数据
            await trainingDirctStore.fetchJtkmList(complete.xlkm5ap);
            if(complete.cxbda2e){
              this.queryTrainPersons(complete.cxbda2e);
            }
            await this.setState({
                id:recvParam.id,
                editable:recvParam.editable,
                bjgl:complete.bjgljnc,
                jtkm:complete.jtkmqgg.split(','),
                khwcl:complete.khwcle0j,
                lhl:complete.lhlbis,
                rwcj:complete.rwcjarv,
                xldd:complete.xlddsai,
                xljd:complete.xljdals,
                xlkm:complete.xlkm5ap,
                xlnr:complete.xlnrevk,
                cxbds:complete.cxbda2e,
                value:complete.cxbda2e.split(','),
                xlry:complete.xlry7q2.split(','),
                xlsd:complete.xlsd7qn,
                xlsj:complete.xlsj6tp,
                xlts:complete.xlts537,
                xlxg:complete.xlxg1dq,
                yxl:complete.yxle7u,
                xljf:customsToArr(consume.xljf2cc),
                dyxh:customsToArr(consume.dyxhlpd),
                ylxh:customsToArr(consume.ylxhqke),
                mtxs:customsToArr(consume.mtxs3ug),
                fxxs:customsToArr(consume.fxxs5jm)
            })
        }
    }
    inputChange = type => e => {
        this.setState({[type]:e.target.value});
        if(type == "xldd" && e.target.value){
          this.setState({
            validateObj:{
              ...this.state.validateObj,
              xldd:true
            }
          })
        }
    }
    selectChange = type => (val) => {
        this.setState({[type]:val});
        switch (type) {
          case 'xlkm':
            trainingDirctStore.fetchJtkmList(val);
            this.setState({
                jtkm:[]
            })
            val && this.setState({
              validateObj:{
                ...this.state.validateObj,
                xlkm:true
              }
            })
            break;
          case 'jtkm':
            val && this.setState({
              validateObj:{
                ...this.state.validateObj,
                jtkm:true
              }
            })
            break;
          default:
            break;
        }
    }
    dateChange = (date,dateStr) => {
        this.setState({
            xlsj:dateStr,
            validateObj:{
              ...this.state.validateObj,
              xlsj:Boolean(dateStr)
            }
        })
    }
    inputNumHandle = type => value => {
        this.setState({
            [type]:value
        })
    }

    addItem = type => () => {
        this.setState({
            [type]:[...this.state[type],{name:"",value:""}]
        })
    }

    //训练消耗名称输入
    customInput = (type,index) => (e) => {
        let customs = [...this.state[type]];
        customs[index]['name'] = e.target.value;
        this.setState({
            [type]:customs
        })
    }
    //训练消耗数量输入
    customInputNum = (type,index) => (val) => {
        let customs = this.state[type];
        customs[index]['value'] = val;
        this.setState({
            [type]:customs
        })
    }
    firstQueryTreeData = async (id) => {
        try {
              let res = await getRootNodeById(id);
              this.setState({treeData:[res.data]})
        } catch(err) {
            console.log(err)
        }
    }
    renderTreeNodes = data => {
      return data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} value={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} value={item.key} {...item} dataRef={item} />;
      });
    }
    onLoadData = treeNode => {
      const { key } = treeNode.props.dataRef;
      return new Promise(resolve => {
        if (treeNode.props.children && treeNode.props.children.length > 0) {
          resolve();
          return;
        }
        getTroopsinfoTree(key).then(res => {
          treeNode.props.dataRef.children = [...res.data];
          this.setState({ treeData: [...this.state.treeData] });
          resolve();
        })
      });
    }
    //树结构选中部队
    treeChange = (value,label) => {
      this.setState({value,cxbdLabels:label.join(',')})
      let ids = value.join(',');
      this.setState({
        cxbds:ids,
        validateObj:{
          ...this.state.validateObj,
          cxbd:Boolean(ids)
        }
      })
      if(ids) {
        this.queryTrainPersons(ids);
      } else {
        this.setState({
          xlry:"",cxrys:[]
        })
      }
    }
    //根据部队id查询下级所有的人员
    async queryTrainPersons(id){
        let res = await getAllCountById({bdid:id});
        let list = res.data;
        let names = [], rybhs = [];
        list.map(item => {
          names.push(item.name);
          rybhs.push(item.value);
        })
        this.setState({xlry:rybhs.join(','),cxrys:names});
    }

    //提交
    submitInfo = async (e) => {
        await this.setState({
          validateObj:{
            xlkm:Boolean(this.state.xlkm),
            jtkm:Boolean(this.state.jtkm.length),
            xldd:Boolean(this.state.xldd),
            xlsj:Boolean(this.state.xlsj),
            cxbd:Boolean(this.state.cxbds)
          }
        })
        let validateFlag = Object.values(this.state.validateObj).every(item => item);
        if(validateFlag){
          let params = {
              "complete": {
                  id:this.state.id,
                  ssbdbh884:this.state.bdbh,
                  xlkm5ap:this.state.xlkm,
                  jtkmqgg:this.state.jtkm.join(','),
                  xlsj6tp:this.state.xlsj,
                  xlsd7qn:this.state.xlsd,
                  xlddsai:this.state.xldd,
                  cxbda2e:this.state.cxbds,
                  xlbdv7o:this.state.cxbdLabels,
                  xlry7q2:this.state.xlry,
                  xlnrevk:this.state.xlnr,
                  xlxg1dq:this.state.xlxg,
                  rwcjarv:this.state.rwcj,
                  xlts537:this.state.xlts,
                  xljdals:this.state.xljd,
                  bjgljnc:this.state.bjgl,
                  yxle7u:this.state.yxl,
                  khwcle0j:this.state.khwcl,
                  lhlbis:this.state.lhl,
              },
              "consume": {
                  xljf2cc:customsToStr(this.state.xljf),
                  dyxhlpd:customsToStr(this.state.dyxh),
                  ylxhqke:customsToStr(this.state.ylxh),
                  mtxs3ug:customsToStr(this.state.mtxs),
                  fxxs5jm:customsToStr(this.state.fxxs),
              }
          }
          let res = await trainSave(params);
          if(res.statusCode === 200){
              message.success(res.message);
              this.props.history.push({pathname:"/entryInfo/trainingInfo"});
          } else {
              message.error(res.message);
          }
        }
    }
    //取消提交
    cancleSubmit = () => {
        this.props.history.push({pathname:'/entryInfo/trainingInfo'});
    }
    render(){
        const { treeData,value } = this.state;
        return (
            <VGroup id="add-training" gap="20px">
                <VGroup gap="20px">
                    <Row type="flex" align="middle">
                        <Col span={9}>
                            <HGroup verticalAlign="center">
                                <span className="label-span">所属部队:</span>
                                <Input disabled={true} value={this.state.affiliation} style={{width:'250px'}}/>
                            </HGroup>
                        </Col>
                        <Col span={6}>

                            <HGroup verticalAlign="center" className="form-required">
                                <span className="label-span">训练科目:</span>
                                <Select className={this.state.validateObj.xlkm ? "" : "err-item"} disabled={this.state.editable} value={this.state.xlkm} style={{width:"150px"}} onChange={this.selectChange('xlkm')}>
                                    {optionGenerate(trainingDirctStore.xlkm)}
                                </Select>
                                {!this.state.validateObj.xlkm && <span className="err-txt">训练科目必选!</span>}
                            </HGroup>
                        </Col>
                        <Col span={9}>
                            <HGroup verticalAlign="center" className="form-required">
                                <span className="label-span">训练小项:</span>
                                <Select className={this.state.validateObj.jtkm ? "" : "err-item"} disabled={this.state.editable} value={this.state.jtkm} style={{width:"290px"}} mode="multiple" onChange={this.selectChange('jtkm')}>
                                    {optionGenerate(trainingDirctStore.jtkm)}
                                </Select>
                                {!this.state.validateObj.jtkm && <span className="err-txt">训练小项必选!</span>}
                            </HGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9} className={this.state.validateObj.xldd ? "" : "err-item"}>
                            <HGroup verticalAlign="center" className="form-required">
                                <span className="label-span">训练地点:</span>
                                <Input disabled={this.state.editable} value={this.state.xldd} style={{width:'250px'}} onChange={this.inputChange('xldd')}/>
                                {!this.state.validateObj.xldd && <span className="err-txt">训练地点必填!</span>}
                            </HGroup>
                        </Col>
                        <Col span={6}>
                            <HGroup verticalAlign="center" className="form-required">
                                <span className="label-span">训练日期:</span>
                                <DatePicker className={this.state.validateObj.xlsj ? "" : "err-item"} disabled={this.state.editable} format={"YYYY-MM-DD"} value={this.state.xlsj ? moment(this.state.xlsj,"YYYY-MM-DD") : null} onChange={this.dateChange} style={{width:"150px"}}/>
                                {!this.state.validateObj.xlsj && <span className="err-txt">训练日期必选!</span>}
                            </HGroup>
                        </Col>
                        <Col span={9}>
                            <HGroup gap="20px">
                                <HGroup verticalAlign="center">
                                    <span className="label-span">训练时段:</span>
                                    <Select  disabled={this.state.editable} value={this.state.xlsd} style={{width:"80px"}} onChange={this.selectChange('xlsd')}>
                                        {optionGenerate(trainingDirctStore.xlsd)}
                                    </Select>
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="label-span">训练天数:</span>
                                    <InputNumber disabled={this.state.editable} min={1}  value={this.state.xlts} onChange={this.inputNumHandle("xlts")} style={{width:'70px'}}/>
                                </HGroup>
                            </HGroup>

                        </Col>
                    </Row>
                    <Row>
                         <HGroup verticalAlign="center" className="form-required">
                            <span className="label-span">参训部队:</span>
                            <TreeSelect
                              disabled={this.state.editable}
                              className={this.state.validateObj.cxbd ? "" : "err-item"}
                              style={{ width: '100%' }}
                              value={value}
                              treeCheckable={true}
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              treeNodeFilterProp="title"
                              loadData={(e) => this.onLoadData(e) }
                              showCheckedStrateg={SHOW_PARENT}
                              onChange={this.treeChange}
                            >
                            { this.renderTreeNodes(treeData) }
                            </TreeSelect>
                            {!this.state.validateObj.cxbd && <span className="err-txt">参训部队必选!</span>}
                        </HGroup>
                    </Row>
                    <Row>
                         <HGroup verticalAlign="center">
                            <span className="label-span">训练人员:</span>
                             <HGroup className="xlry-box" verticalAlign="center">
                                {this.state.cxrys.length > 0 && this.state.cxrys.map((item,index) => {
                                  return (<Tag color="#108ee9" key={index} style={{height:"24px",margin:"2px"}}>{item}</Tag>)
                                })}
                             </HGroup>
                        </HGroup>
                    </Row>
                    <Row>
                        <HGroup verticalAlign="center">
                            <span className="label-span">训练内容:</span>
                            <TextArea disabled={this.state.editable} value={this.state.xlnr} onChange={this.inputChange('xlnr')}/>
                        </HGroup>
                    </Row>
                    <Row>
                        <HGroup verticalAlign="center">
                            <span className="label-span">训练效果:</span>
                            <TextArea disabled={this.state.editable} value={this.state.xlxg} onChange={this.inputChange('xlxg')}/>
                        </HGroup>
                    </Row>
                    <Row>
                        <HGroup verticalAlign="center">
                            <span className="label-span">任务场景:</span>
                            <TextArea disabled={this.state.editable} value={this.state.rwcj} onChange={this.inputChange('rwcj')}/>
                        </HGroup>
                    </Row>
                    <Row type="flex" align="middle">
                        <Col span={2}><span className="label-span">训练质量:</span></Col>
                        <Col span={22}>
                            <HGroup verticalAlign="center" gap="20px" style={{flexWrap:"wrap"}}>
                                <HGroup gap="5px" verticalAlign="center">
                                    <span className="xlzl-span">训练进度:</span><InputNumber disabled={this.state.editable} defaultValue={0} min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} value={this.state.xljd} onChange={this.inputNumHandle("xljd")} />
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="xlzl-span">不及格率:</span><InputNumber disabled={this.state.editable} defaultValue={0} min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} value={this.state.bjgl} onChange={this.inputNumHandle("bjgl")} />
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="xlzl-span">优秀率:</span><InputNumber disabled={this.state.editable} defaultValue={0} min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} value={this.state.yxl} onChange={this.inputNumHandle("yxl")} />
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="xlzl-span">考核完成率:</span><InputNumber disabled={this.state.editable} defaultValue={0} min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} value={this.state.lhl} onChange={this.inputNumHandle("lhl")} />
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="xlzl-span">良好率:</span><InputNumber disabled={this.state.editable} defaultValue={0} min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} value={this.state.khwcl} onChange={this.inputNumHandle("khwcl")} />
                                </HGroup>
                            </HGroup>
                        </Col>
                    </Row>
                </VGroup>
                <HGroup>
                    <span className="label-span">训练消耗:</span>
                    <VGroup gap="20px" style={{flex:1}}>

                        <Card title="训练经费 (单位:万元)" extra={!this.state.editable && <Button type="primary" icon="plus" size="small" onClick={this.addItem("xljf")}/>} style={{ }}>
                            <Row>
                                {this.state.xljf.map((item,index) => (
                                    <Col span={12} key={index}>
                                        <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>名称:</span><Input style={{width:"170px"}} disabled={this.state.editable} value={item.name} onChange={this.customInput("xljf",index)}/>
                                            </HGroup>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>万元:</span><InputNumber disabled={this.state.editable}  onChange={this.customInputNum("xljf",index)} value={item.value}  style={{width:"150px"}} />
                                            </HGroup>
                                        </HGroup>
                                    </Col>
                                ))}
                            </Row>
                        </Card>

                        <Card title="弹药消耗 (单位:枚)" extra={!this.state.editable && <Button type="primary" icon="plus" size="small" onClick={this.addItem("dyxh")}/>} style={{ }}>
                            <Row>
                                {this.state.dyxh.map((item,index) => (
                                    <Col span={12} key={index}>
                                        <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>名称:</span><Input style={{width:"170px"}} disabled={this.state.editable} value={item.name} onChange={this.customInput("dyxh",index)}/>
                                            </HGroup>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>枚:</span><InputNumber  disabled={this.state.editable} onChange={this.customInputNum("dyxh",index)} value={item.value}  style={{width:"150px"}} />
                                            </HGroup>
                                        </HGroup>
                                    </Col>
                                ))}
                            </Row>
                        </Card>

                        <Card title="油料消耗 (单位:升)" extra={!this.state.editable && <Button type="primary" icon="plus" size="small" onClick={this.addItem("ylxh")}/>} style={{ }}>
                            <Row>
                                {this.state.ylxh.map((item,index) => (
                                    <Col span={12} key={index}>
                                        <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>名称:</span><Input style={{width:"170px"}} disabled={this.state.editable} value={item.name} onChange={this.customInput("ylxh",index)}/>
                                            </HGroup>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>升:</span><InputNumber  disabled={this.state.editable} onChange={this.customInputNum("ylxh",index)} value={item.value}  style={{width:"150px"}} />
                                            </HGroup>
                                        </HGroup>
                                    </Col>
                                ))}
                            </Row>
                        </Card>

                        <Card title="摩托小时 (单位:小时)" extra={!this.state.editable && <Button type="primary" icon="plus" size="small" onClick={this.addItem("mtxs")}/>} style={{ }}>
                            <Row>
                                {this.state.mtxs.map((item,index) => (
                                    <Col span={12} key={index}>
                                        <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>名称:</span><Input style={{width:"170px"}} disabled={this.state.editable} value={item.name} onChange={this.customInput("mtxs",index)}/>
                                            </HGroup>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>小时:</span><InputNumber disabled={this.state.editable} onChange={this.customInputNum("mtxs",index)} value={item.value}  style={{width:"150px"}} />
                                            </HGroup>
                                        </HGroup>
                                    </Col>
                                ))}
                            </Row>
                        </Card>

                        <Card title="飞行小时 (单位:小时)" extra={!this.state.editable && <Button type="primary" icon="plus" size="small" onClick={this.addItem("fxxs")}/>} style={{ }}>
                            <Row>
                                {this.state.fxxs.map((item,index) => (
                                    <Col span={12} key={index}>
                                        <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>名称:</span><Input style={{width:"170px"}} disabled={this.state.editable} value={item.name} onChange={this.customInput("fxxs",index)}/>
                                            </HGroup>
                                            <HGroup gap="5px" verticalAlign="center">
                                                <span>小时:</span><InputNumber disabled={this.state.editable} onChange={this.customInputNum("fxxs",index)} value={item.value}  style={{width:"150px"}} />
                                            </HGroup>
                                        </HGroup>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </VGroup>
                </HGroup>


                {
                    this.state.editable ? (
                        <HGroup gap="20px" horizontalAlign="center" style={{width:'100%',marginTop:"10px"}}>
                            <Button type="primary" onClick={this.cancleSubmit}>关闭</Button>
                        </HGroup>
                    ) : (
                        <HGroup gap="20px" horizontalAlign="center" style={{width:'100%',marginTop:"10px"}}>
                            <Button type="primary" onClick={this.submitInfo}>提交</Button>
                            <Button type="default" onClick={this.cancleSubmit}>取消</Button>
                        </HGroup>
                    )
                }


            </VGroup>
        );
    }
}

export default AddTraining;
export const AddTrainingRoute = <Route exact path="/entryInfo/trainingInfo/addTraining" component={AddTraining} />
