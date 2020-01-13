import './index.less'
import { Route } from 'react-router-dom'
import React, { Component } from 'react'
import { HGroup,VGroup } from 'v-block.lite/layout'
import moment from 'moment'
import {DatePicker} from 'antd'
import { observer } from 'mobx-react'
import store from './ability-analysis.store'
import AbilityTree from '@modules/tree'
import AbilityScore from './views/ability-score'
import Ratio from './views/ratio'
import Variety from './views/variety'
const yearList = {
   // '2019':[moment(moment().startOf('year')-365*24*60*60*1000),moment().endOf('year')]
}
for (let i = 0;i<3;i++){
    yearList[new Date().getFullYear()-i+'年'] = [moment(moment().startOf('year')-i*365*24*60*60*1000),moment(moment().endOf('year')-i*366*24*60*60*1000)];
}
 @observer class Ability extends Component{
    constructor(props){
        super(props)
        this.state={
            scoreEchartsData:{},
            ratioEchartsData:{},
            varietyEchartsData:{},
            treeData:[],
            selectedKeys: [],
            title:"",
            chartParams:{
                armyno:"",
                time:"",
                code:"1" //0:树 ，1:图表
            }
        }
    }
    onSelect = async (key, nodeInfo,rootNode) => {
        const node = nodeInfo.node ? nodeInfo.node.props.dataRef : nodeInfo;
        const selectedKeys = rootNode ? rootNode.key : node.key;
        if(rootNode){
             await this.setState({selectedKeys:[selectedKeys],title:rootNode.title,chartParams:{
                ...this.state.chartParams,
                armyno:rootNode.troopsnum,
                time:`${store.defaultTime()[0]},${store.defaultTime()[1]}`,
                code:"1"
            } }, () => store.setTreeNodeInfo(rootNode))
        }else{
             if(!this.state.chartParams.time){
                await this.setState({selectedKeys:key,title:node.title,chartParams:{
                    ...this.state.chartParams,
                    armyno:node.troopsnum,
                    time:`${store.defaultTime()[0]},${store.defaultTime()[1]}`,
                    code:"1"
                } }, () => store.setTreeNodeInfo(node))
            }else{
                await this.setState({ selectedKeys:key,title:node.title,chartParams:{
                    ...this.state.chartParams,
                    armyno:node.troopsnum,
                    code:"1"
                } }, () => store.setTreeNodeInfo(node))
            }
        }
       this.allChartData();
    };
    allChartData = async () => {
        let {armyno,time,code} = this.state.chartParams;
        await store.UnitOverall({armyno,time}).then(res => {
            if(res.statusCode == 200){
                // let a  = {
                //     xLabel:["陆军一旅,09","陆军二旅,08","陆军三旅,05","陆军四旅,06","陆军五旅,07","陆军六旅,01","陆军七旅,02","陆军八旅,03","陆军九旅,11","陆军十旅,12",],
                //     yValue:[10, 52, 200, 334, 390, 330,550,230,960,880]
                // }
                 this.setState({
                   scoreEchartsData:res.data
                  //scoreEchartsData:a
                 })
            }
        })
        await store.UnitRatio({armyno,time,code}).then(res => {
            if(res.statusCode == 200){
                 this.setState({
                   ratioEchartsData:res.data,
                 })
            }
        })
        await store.UnitTrend({armyno,time,code}).then(res => {
            if(res.statusCode == 200){
                this.setState({
                   varietyEchartsData:res.data
                   //varietyEchartsData:a
                 })
            }
        })
    }
    onChange = async (date,dateString) => {
       //store.abilityScoreFn({time:"2018"});
        await this.setState({
            chartParams:{
                ...this.state.chartParams,
                time:dateString.join(",")
            }
        })
        this.allChartData();
    }
    scoreClick = async () => {
        let chartObj = await store.chartData;
        let data =  await store.chartData;
        await this.setState({
            title:chartObj.name.split(",")[0],
            chartParams:{
                    ...this.state.chartParams,
                    armyno:data.name.split(",")[1],
                    code:"1"
                }
        })
        let {armyno,time,code} = this.state.chartParams;
        await store.UnitRatio({armyno,time,code}).then(res => {
                if(res.statusCode == 200){
                    this.setState({
                    ratioEchartsData:res.data,
                    })
                }
            })
            await store.UnitTrend({armyno,time,code}).then(res => {
                if(res.statusCode == 200){
                    this.setState({
                    varietyEchartsData:res.data,
                    })
                }
            })
    }
    componentDidMount() {
       //store.abilityScoreFn({time:"2019"});
    }
    render(){
        const { selectedKeys,title } = this.state;
        return(
            <HGroup className="ability-analysis" >
                <HGroup className="ability-left" >
                    <AbilityTree selectedKeys={selectedKeys} onSelect = {this.onSelect} />
                </HGroup>
                <HGroup className="ability-right">
                    <VGroup width="100%">
                        <HGroup horizontalAlign="flex-end" padding="10px 50px" >
                            <DatePicker.RangePicker className="date-range" ranges ={yearList} onChange={this.onChange} defaultValue={[moment(store.defaultTime()[0],'YYYY-MM-DD'),moment(store.defaultTime()[1],'YYYY-MM-DD')]} />
                        </HGroup>
                        {
                            !!Object.keys(this.state.scoreEchartsData).length&&!!Object.keys(this.state.ratioEchartsData).length&&Object.keys(this.state.varietyEchartsData).length?
                            <>
                                <HGroup className="all-ability-container">
                                   <AbilityScore scoreEchartsData={this.state.scoreEchartsData} onClick={this.scoreClick} />
                                </HGroup>
                                <HGroup className="ratio-trend-container" width="100%" >
                                    <Ratio ratioEchartsData={this.state.ratioEchartsData} title={title} />
                                    <Variety varietyEchartsData={this.state.varietyEchartsData} title={title}  />
                                </HGroup>
                            </> : null
                        }
                    </VGroup>
                </HGroup>
            </HGroup>
        )
    }
}
export default Ability
export const AbilityRoute = <Route path="/ability" component={Ability} exact />;
