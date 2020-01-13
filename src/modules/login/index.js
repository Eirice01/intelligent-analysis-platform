import './index.less';
import React, { Component } from 'react';
import { HGroup, VGroup } from 'v-block.lite/layout'
import {Row,Col,Form,Input,Button,message} from 'antd'
import Store from './login.store'
import Bed from '@assets/images/bed.png';
import Logo from '@assets/images/logo.png';
import Angle1 from '@assets/images/angle1.png';
import Angle2 from '@assets/images/angle2.png';
import Angle3 from '@assets/images/angle3.png';
import Angle4 from '@assets/images/angle4.png';
import LobinBox from '@assets/images/login-box.png';
import Satellite from '@assets/images/satellite.png';


import showEarth from './miniature.earth.core'

class Login extends Component{
  handleAddSubmit = e => {
    e.preventDefault();
    //  this.props.form.validateFields((err,values)=>{
    //     if(!err){
    //         Store.userLogin({...values}).then(res => {
    //           if(res.success){
    //               message.success(`登录成功`);
    //               window.sessionStorage.setItem("userInfo",JSON.stringify(res.data));
    //             window.sessionStorage.setItem("userInfo",JSON.stringify(res.data));
    //               this.props.isUserLogin(true);
    //           }else{
    //               message.error(res.errorMsg);
    //           }
    //         })
    //     }
    // })
    this.props.form.validateFields((err)=>{
      if(!err){
        window.sessionStorage.setItem("userInfo",true);
        message.success(`登录成功`);
      }
    })
  }
  softwareDownload = () => {
     window.open(`${window.__private_URL.softwareUrl}`)
  }
  componentDidMount() {
    showEarth();
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    return(
        <HGroup className="login-contaniner" width="100%" height="100%">
                <VGroup className="left-part"  height="100%" verticalAlign="flex-end" >
                  <div id="myearth">
                    <img className="satellite" src={ Satellite }  />
                    <div id="glow"></div>
                  </div>
                  <img className="bed" src={ Bed } width={700} height={330} />
                </VGroup>
                <VGroup  className="login-info"  horizontalAlign="center" >
                   <VGroup horizontalAlign="center" className="logo-title">
                      <img className="logo" src={ Logo } width="110" height="110" />
                      <div style={{fontFamily:"myFontName",fontSize:"30px",color:'#00cccf',marginBottom:"20px",marginLeft:"-20px"}}>
                        陆军特种部队大数据智能分析平台
                      </div>
                   </VGroup>
                  <HGroup className="form-container">
                      <img className="login-box" src= {LobinBox}  />
                      <Form className="login-form" layout='inline' onSubmit={this.handleAddSubmit}>
                        <Row>
                          <Col>
                              <Form.Item style={{position:"relative",marginTop:"50px"}}>
                                {
                                getFieldDecorator('username',{
                                  rules:[{required:true,message:"账号不能为空"}]
                                })(<Input placeholder="请输入账号" autoComplete="off" />)
                              }
                              <img className="angle angle1" src={Angle1} width="20" height="12" />
                              <img className="angle angle2" src={Angle2} width="20" height="12" />
                              <img className="angle angle3" src={Angle3} width="20" height="12" />
                              <img className="angle angle4" src={Angle4} width="20" height="12" />
                              <span style={{position:"absolute",left:"8px",top:"-6px"}}>
                                  <svg className="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1">
                                    <path fill="#00e6fc" d="M663.648 1000.576l-303.328 0c-100.512 0-181.984-82.016-181.984-183.2l0-122.144c0-80.224 51.52-147.648 122.816-172.448-38.816-52.736-62.176-120.32-62.176-193.952 0-168.64 122.208-305.344 272.992-305.344s272.992 136.704 272.992 305.344c0 73.664-23.328 141.216-62.176 193.952 71.296 24.8 122.816 92.256 122.816 172.448l0 122.144C845.664 918.56 764.16 1000.576 663.648 1000.576zM724.32 328.8c0-134.912-95.072-244.288-212.32-244.288-117.28 0-212.32 109.376-212.32 244.288s95.072 244.288 212.32 244.288C629.28 573.056 724.32 463.712 724.32 328.8zM784.992 710.496c0-64.928-48.928-119.008-114.528-133.376-44.704 35.776-99.296 57.024-158.464 57.024s-113.76-21.28-158.464-57.024c-65.6 14.368-114.528 68.448-114.528 133.376l0 91.616c0 75.904 66.656 137.408 148.896 137.408l248.16 0c82.24 0 148.896-61.504 148.896-137.408L784.96 710.496z" />
                                  </svg>
                              </span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                              <Form.Item style={{position:"relative"}}>
                                {
                                getFieldDecorator('password',{rules:[{required:true,message:"密码不能为空"}]})(<Input.Password placeholder="请输入密码" style={{}} />)
                              }
                              <img className="angle angle1" src={Angle1} width="20" height="12" />
                              <img className="angle angle2" src={Angle2} width="20" height="12" />
                              <img className="angle angle3" src={Angle3} width="20" height="12" />
                              <img className="angle angle4" src={Angle4} width="20" height="12" />
                              <span style={{position:"absolute",left:"8px",top:"-6px"}}>
                                  <svg className="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1" >
                                    <path fill="#00e6fc" d="M733.184 400.896c0-1.536 1.024-3.072 1.024-4.608V283.136c0-125.952-99.84-228.352-222.208-228.352s-222.208 102.4-222.208 228.352v113.152c0 1.536 0.512 3.072 1.024 4.608-69.12 61.44-112.64 150.528-112.64 249.856 0 184.32 150.016 334.336 334.336 334.336s334.336-150.016 334.336-334.336c-0.512-99.328-44.544-188.416-113.664-249.856z m-375.296-117.76c0-88.064 69.12-160.256 154.112-160.256s154.112 71.68 154.112 160.256v71.168c-46.08-24.064-98.304-37.888-154.112-37.888-55.808 0-108.032 13.824-154.112 37.888v-71.168zM512 916.48c-146.432 0-265.728-119.296-265.728-266.24S365.568 384 512 384s266.24 119.296 266.24 266.24S658.432 916.48 512 916.48z m34.304-311.296v95.744a34.304 34.304 0 0 1-68.608 0v-95.744a34.304 34.304 0 0 1 68.608 0z" />
                                  </svg>
                              </span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row style={{marginTop:'5px',textAlign:"center"}}>
                            <Col>
                                <Form.Item>
                                  <Button type="primary" htmlType="submit" style={{width:"330px",background:"#00b9ca",border:0,height:"44px"}}>登录</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                  </HGroup>
            </VGroup>
            <VGroup style={{position:"fixed",bottom:"10px",right:"10px",cursor:"pointer",backgroundImage:"linear-gradient(#88f8e9,#0086a2,#00282e)",padding:"2px 5px",borderRadius:"3px"}}>
                <span onClick={this.softwareDownload}>
                  软件下载
                </span>
            </VGroup>
        </HGroup>
    )
  }
}
export const WrappedLogin = Form.create({name:'add'})(Login)
