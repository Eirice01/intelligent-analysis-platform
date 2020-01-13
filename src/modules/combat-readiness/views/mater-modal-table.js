import React, { Component } from 'react'
import comabtStore from '../combat.store'
import {Table,Modal} from 'antd'
import { observer } from 'mobx-react';
@observer
class ModalTable extends Component{
     constructor(props){
       super(props)
       this.state={
         tables1:[],
         columns1:[],
         loading:false,
         pagination: {
           total:"",
           pageSize:10,
           current:1,
         },
       }
     }

  OnCancelMater=()=>{
      comabtStore.changeModals(false)
  }
 async componentDidMount() {

  }

  render(){
    return(<Modal
      title="物资信息"
      visible={comabtStore.isVisible}
      onCancel={this.OnCancelMater}
      footer={null}
      width={800}
      style={{top:100}}
      destroyOnClose={true}
      forceRender={true}
           >
      <div style={{width:"700px",height:"450px",overflow:"auto"}}>
          <Table
            columns={this.props.column1}
            dataSource={this.props.tables1}
            loading={this.props.loading}
            pagination={{
              ...this.props.pagination,
              showTotal: total => `共 ${total} 条`
            }}
            onChange={this.handleTableChange}
            style={{width:"100%"}}
          />
      </div>
    </Modal>)
  }
}
export default ModalTable
