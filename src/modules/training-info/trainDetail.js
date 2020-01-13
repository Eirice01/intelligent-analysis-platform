import './addTraining.less';
import React, { Component } from 'react';
import { HGroup,VGroup } from "v-block.lite/layout";
import { Row, Col, Card, Button ,Tag } from 'antd';
import { observer } from 'mobx-react'
import {Route,withRouter} from 'react-router-dom';
import trainingDirctStore from './trainingDirct.store'
import { getBdNameById,getTrainInfo,getAllCountById,getDicByKeys } from './trainingInfo.service'

function customsToArr(customs) {
    let customsArr = [];
    let arr = customs.split(';').filter(v => v != ',');
    if(arr.length>0) {
        arr.forEach(v => {
            let temp = v.split(',')
            customsArr.push({name:temp[0],value:temp[1]})
        })
    }
    return customsArr;
}
 async function transformXlkm(key) {
  let res = await getDicByKeys('129-1');
  let list = res.data;
  let value;
  for(let i = 0;i < list.length;i++){
    if(list[i]['value'] == key) {
      value = list[i]['name'];
      break;
    }
  }
  return value;
}
 async function transformJtkm(xlkm,keys) {
  let temp = [];
  let res = await getDicByKeys(xlkm);
  let list = res.data;
  keys.split(',').map(v => {
    list.forEach(k => {
      if(k.value == v){
        temp.push(k.name);
      }
    })
  })
  return temp.join(',');
}

async function transformXlsd(key){
  if(!key) return "";
  let res = await getDicByKeys('129-2');
  let list = res.data;
  let value;
  for(let i = 0;i < list.length;i++){
    if(list[i]['value'] == key) {
      value = list[i]['name'];
      break;
    }
  }
  return value;
}

@withRouter
@observer
class TrainDetail extends Component {
    state = {
        id:null,
        bdbh:"",
        value:undefined,
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
                jtkm:await transformJtkm(complete.xlkm5ap,complete.jtkmqgg),
                khwcl:complete.khwcle0j,
                lhl:complete.lhlbis,
                rwcj:complete.rwcjarv,
                xldd:complete.xlddsai,
                xljd:complete.xljdals,
                xlkm:await transformXlkm(complete.xlkm5ap),
                xlnr:complete.xlnrevk,
                cxbds:complete.xlbdv7o,
                xlry:complete.xlry7q2.split(','),
                xlsd:await transformXlsd(complete.xlsd7qn),
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
    //取消提交
    cancleSubmit = () => {
        this.props.history.goBack();
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
    render(){
        return (
            <VGroup id="add-training" gap="20px">
                <HGroup horizontalAlign="center">
                  <h2 style={{color:"#fff"}}>训练信息详情</h2>
                </HGroup>
                <VGroup gap="20px">
                    <Row type="flex" align="middle">
                        <Col span={9}>
                            <HGroup verticalAlign="center">
                                <span className="label-span">所属部队:</span>
                                <span className="detail-info">{this.state.affiliation}</span>
                            </HGroup>
                        </Col>
                        <Col span={6}>
                            <HGroup verticalAlign="center">
                                <span className="label-span">训练科目:</span>
                                <span className="detail-info">{this.state.xlkm}</span>
                            </HGroup>
                        </Col>
                        <Col span={9}>
                            <HGroup verticalAlign="center">
                                <span className="label-span">训练小项:</span>
                                <span className="detail-info">{this.state.jtkm}</span>
                            </HGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9}>
                            <HGroup verticalAlign="center">
                                <span className="label-span">训练地点:</span>
                                <span className="detail-info">{this.state.xldd}</span>
                            </HGroup>
                        </Col>
                        <Col span={6}>
                            <HGroup verticalAlign="center">
                                <span className="label-span">训练日期:</span>
                                <span className="detail-info">{this.state.xlsj}</span>
                            </HGroup>
                        </Col>
                        <Col span={9}>
                            <HGroup gap="20px">
                                <HGroup verticalAlign="center">
                                    <span className="label-span">训练时段:</span>
                                    <span className="detail-info">{this.state.xlsd}</span>
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="label-span">训练天数:</span>
                                    <span className="detail-info">{this.state.xlts}</span>
                                </HGroup>
                            </HGroup>

                        </Col>
                    </Row>
                    <Row>
                         <HGroup verticalAlign="center">
                            <span className="label-span">参训部队:</span>
                            <span className="detail-info">{this.state.cxbds}</span>
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
                            <span className="detail-info">{this.state.xlnr}</span>
                        </HGroup>
                    </Row>
                    <Row>
                        <HGroup verticalAlign="center">
                            <span className="label-span">训练效果:</span>
                            <span className="detail-info">{this.state.xlxg}</span>
                        </HGroup>
                    </Row>
                    <Row>
                        <HGroup verticalAlign="center">
                            <span className="label-span">任务场景:</span>
                            <span className="detail-info">{this.state.rwcj}</span>
                        </HGroup>
                    </Row>
                    <Row type="flex" align="middle">
                        <Col span={2}><span className="label-span">训练质量:</span></Col>
                        <Col span={22}>
                            <HGroup verticalAlign="center" gap="20px" style={{flexWrap:"wrap"}}>
                                <HGroup gap="5px" verticalAlign="center">
                                    <span className="xlzl-span">训练进度:</span><span className="detail-info">{this.state.xljd}%</span>
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="xlzl-span">不及格率:</span><span className="detail-info">{this.state.bjgl}%</span>
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="xlzl-span">优秀率:</span><span className="detail-info">{this.state.yxl}%</span>
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="xlzl-span">考核完成率:</span><span className="detail-info">{this.state.lhl}%</span>
                                </HGroup>
                                <HGroup verticalAlign="center">
                                    <span className="xlzl-span">良好率:</span><span className="detail-info">{this.state.khwcl}%</span>
                                </HGroup>
                            </HGroup>
                        </Col>
                    </Row>
                </VGroup>
                <HGroup>
                    <span className="label-span">训练消耗:</span>
                    <VGroup gap="20px" style={{flex:1}}>

                        {this.state.xljf.length > 0 && (
                          <Card title="训练经费 (单位:万元)">
                              <Row>
                                  {this.state.xljf.map((item,index) => (
                                      <Col span={12} key={index}>
                                          <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                              <HGroup gap="5px" verticalAlign="center">
                                                  <span>名称:</span><span className="detail-info">{item.name}</span>
                                              </HGroup>
                                              <HGroup gap="5px" verticalAlign="center">
                                                  <span>万元:</span><span className="detail-info">{item.value}</span>
                                              </HGroup>
                                          </HGroup>
                                      </Col>
                                  ))}
                              </Row>
                          </Card>
                        )}

                        {this.state.dyxh.length > 0 && (
                          <Card title="弹药消耗 (单位:枚)">
                              <Row>
                                  {this.state.dyxh.map((item,index) => (
                                      <Col span={12} key={index}>
                                          <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                              <HGroup gap="5px" verticalAlign="center">
                                                  <span>名称:</span><span className="detail-info">{item.name}</span>
                                              </HGroup>
                                              <HGroup gap="5px" verticalAlign="center">
                                                  <span>枚:</span><span className="detail-info">{item.value}</span>
                                              </HGroup>
                                          </HGroup>
                                      </Col>
                                  ))}
                              </Row>
                          </Card>
                        )}

                        {this.state.ylxh.length > 0 && (
                          <Card title="油料消耗 (单位:升)">
                              <Row>
                                  {this.state.ylxh.map((item,index) => (
                                      <Col span={12} key={index}>
                                          <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                              <HGroup gap="5px" verticalAlign="center">
                                                  <span>名称:</span><span className="detail-info">{item.name}</span>
                                              </HGroup>
                                              <HGroup gap="5px" verticalAlign="center">
                                                  <span>升:</span><span className="detail-info">{item.value}</span>
                                              </HGroup>
                                          </HGroup>
                                      </Col>
                                  ))}
                              </Row>
                          </Card>
                        )}

                         {this.state.mtxs.length > 0 && (
                           <Card title="摩托小时 (单位:小时)">
                               <Row>
                                   {this.state.mtxs.map((item,index) => (
                                       <Col span={12} key={index}>
                                           <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                               <HGroup gap="5px" verticalAlign="center">
                                                   <span>名称:</span><span className="detail-info">{item.name}</span>
                                               </HGroup>
                                               <HGroup gap="5px" verticalAlign="center">
                                                   <span>小时:</span><span className="detail-info">{item.value}</span>
                                               </HGroup>
                                           </HGroup>
                                       </Col>
                                   ))}
                               </Row>
                           </Card>
                         )}

                        {this.state.fxxs.length > 0 && (
                          <Card title="飞行小时 (单位:小时)">
                              <Row>
                                  {this.state.fxxs.map((item,index) => (
                                      <Col span={12} key={index}>
                                          <HGroup gap="20px" style={{marginBottom:'10px'}}>
                                              <HGroup gap="5px" verticalAlign="center">
                                                  <span>名称:</span><span className="detail-info">{item.name}</span>
                                              </HGroup>
                                              <HGroup gap="5px" verticalAlign="center">
                                                  <span>小时:</span><span className="detail-info">{item.value}</span>
                                              </HGroup>
                                          </HGroup>
                                      </Col>
                                  ))}
                              </Row>
                          </Card>
                        )}

                    </VGroup>
                </HGroup>

                <HGroup gap="20px" horizontalAlign="center" style={{width:'100%',marginTop:"10px"}}>
                    <Button type="primary" onClick={this.cancleSubmit}>关闭</Button>
                </HGroup>
            </VGroup>
        );
    }
}

export default TrainDetail;
export const TrainDetailRoute = <Route exact path="/entryInfo/trainingInfo/trainDetail" component={TrainDetail} />
