import React, { Component } from 'react'
import { HGroup, VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'
import { classnames } from 'v-block.lite/common'
import { Pagination } from 'antd'
import  { reaction } from 'mobx'

const paddingLeft = {  paddingLeft: '10px' };
const isBigScreen = window.screen.width > 1920 ? true : false;

@observer
class RenderPerson extends Component {
  render() {
    const {item, selected, selectedFn} = this.props;
    const { ryzp1dr, xm2er, zw75d, xb6h6, csnyfme } = item;
    let imageSrc = ryzp1dr ? ryzp1dr.split(',')[1] : '';
    return (
    <HGroup className={classnames('content', selected ? 'person_active' : null)} horizontalAlign="flex-start" width="220px" margin="5px 0 0 0" onClick={ (e) => selectedFn(e, item) }>
      <HGroup className="imgBox">
        <img with="100%" height="100%" src={ imageSrc }/>
      </HGroup>
      <VGroup className="describe" verticalAlign="space-around" padding="0 0 0 20px">
        <HGroup><b>{xm2er}</b><b style={paddingLeft}>{zw75d}</b></HGroup>
        <HGroup>{xb6h6}</HGroup>
        <HGroup>{csnyfme}</HGroup>
      </VGroup>
    </HGroup>
    )
  }
}

@observer
class PersonItem extends Component {
  state = {
    selected: false,
    pagination: { current: 1, pageSize: isBigScreen ? 40 : 10, total: 0, showSizeChanger: true, showTotal: (total) => `共${total}条` },
    sourceData: []
  }
  selectedFn = async (context, item) => {
    const { store } = this.props;
    await store.setPeopleDetails(item)
    store.personDetailModalChange(true);
  }

  fetchDataSource = (xm2er='') => {
    const { store } = this.props;
    const { key } = store.treeNodeInfo;
    let params = {
      page: this.state.pagination.current,
      size: this.state.pagination.pageSize,
      bdid: key || '',
      params: { xm2er }
    }
    store.fetchPersonList(params).then(res => {
      const { sourceData, total } = res;
      this.setState({
        sourceData,
        pagination: {...this.state.pagination, total}
      })
    })
  }

  pageChange = async (page) => {
    await this.setState({ pagination: {...this.state.pagination, current: page}});
    this.fetchDataSource();
  }

  componentDidMount() {
    const { store } = this.props;
    reaction(() => [store.treeNodeInfo], (arr) => this.fetchDataSource())
  }

  componentWillUnmount(){
    this.setState = (state,callback) => { return }
  }
  render() {
    const { selected, sourceData, pagination } = this.state;
    const { current, total} = pagination;
    return (
      <div className="personItem-info">
        {
          sourceData && sourceData.map(((item,idx) => {
              return item ? <RenderPerson item={item} selected={selected} key={idx} selectedFn={this.selectedFn}/> : null;
          }))
        }
        <Pagination showTotal={(total) => `共${total}条`} current={current} onChange={this.pageChange} total={total} style={{position: 'absolute', right: '20px', bottom: '20px'}}/>
      </div>
    )
  }
}

export default PersonItem;

