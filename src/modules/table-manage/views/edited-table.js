
import React, { Component } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Select, Radio, Button, message, TreeSelect } from 'antd';
import { HGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'

const { Option } = Select;
const { TreeNode } = TreeSelect;

const warning = (content) => {
  message.warning(content, { duration: 2 });
};

const EditableContext = React.createContext();

@observer
class EditableCell extends Component {

  validataClnComments = (e, store) => {
    let current = e.target.value,
        bool = store.editableColumns.some(v => v.clnComments === current);
    bool && warning('列名重复，请重新输入')
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

  selectChange = (e, changeTreeSelectStatus) => {
    let bool = (e === '字典' ? false : true);
    changeTreeSelectStatus(bool)
  }

  getInput = (contextValue) => {
    const { store, changeTreeSelectStatus, disabledTreeSelect, canEditClnComments } = contextValue;
    const { columnTypes, dictionTree } = store;
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }else if(this.props.inputType === 'treeSelect') {
      return (
        <TreeSelect
          style={{ width: 150 }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择字典值"
          allowClear
          disabled={disabledTreeSelect}
          treeNodeFilterProp="title"
        >
        { this.renderTreeNodes(dictionTree) }
      </TreeSelect>
      )
    }else if(this.props.inputType === 'select') {
      return (
        <Select showSearch style={{ width: '100px'}} placeholder="请选择列属性" onChange={(e) => this.selectChange(e, changeTreeSelectStatus)}>
          {
            columnTypes.map(item => <Option key={item.name}>{item.name}</Option>)
          }
        </Select>
      )
    }else if(this.props.inputType === 'radio') {
      return (
        <Radio.Group>
          <Radio value="否">否</Radio>
          <Radio value="是">是</Radio>
        </Radio.Group>
      )
    }
    return <Input disabled={canEditClnComments} onBlur={(e) => this.validataClnComments(e, store)}/>;
  };

  renderCell = (contextValue) => {
    const { form } = contextValue;
    const { getFieldDecorator } = form;
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [{ required: false, message: `请输入 ${title}！`}],
              initialValue: record[dataIndex],
            })(this.getInput(contextValue))}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
  }
}

@observer
class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { editingKey: '', pageNation: false, disabledTreeSelect: true, canEditClnComments: false };

    this.columns = [
      { title: '列名', dataIndex: 'clnComments', width: '200px', editable: true },
      { title: '列类型', dataIndex: 'columnType', width: '100px', editable: true},
      { title: '字典值', dataIndex: 'dictionKey', width: '200px', editable: true },
      { title: '是否搜索', dataIndex: 'isSearch', width: '150px', editable: true },
      { title: '是否显示', dataIndex: 'isShow', width: '150px', editable: true },
      { title: '操作', dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a onClick={() => this.comfirm(form, record.key)} style={{ marginRight: 8 }}>确定</a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="是否取消编辑？" cancelText="取消" okText="确定" onConfirm={() => this.cancel(record.key)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <HGroup verticalAlign="center" horizontalAlign="flex-start">
              <a disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => this.edit(record)}>编辑</a>
              <a disabled={editingKey !== ''} onClick={() => this.remove(record.key)}>删除</a>
            </HGroup>
          );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  changeTreeSelectStatus = (bool) => this.setState({ disabledTreeSelect: bool })

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  comfirm({ form }, key) {
    const { store } = this.props;
    form.validateFields((error, row) => {
      if (error) return;
      const newData = [...store.editableColumns];
      const index = newData.findIndex(item => (key === item.key));
      if (index > -1) {
        const item = newData[index];
        item.isUpd = item.id ? 1 : 0;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ editingKey: '' }, () => store.setEditedColumns(newData));
      } else {
        newData.push(row);
        this.setState({ editingKey: '' }, () => store.setEditedColumns(newData));
      }
    });
  }

  edit(record) { this.setState({ editingKey: record.key }) }
  // 列名修改启用
  // edit(record) { this.setState({ editingKey: record.key, canEditClnComments: (record.id && record.isUpd === 0) ? true : false }) }

  remove(key) {
    const { store } = this.props;
    const newData = [...store.editableColumns];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      newData.splice(index, 1);
      this.setState({ editingKey: '' }, () => store.setEditedColumns(newData));
    }
  }

  handleAdd = () => {
    const { store } = this.props;
    const { editableColumns } = store;
    let len = editableColumns.length;
    const newData = { key: len+1, clnComments: '', columnName:'', columnType: '',dictionKey: '', isSearch: '否', isShow: '否', dontDelete: 1, isUpd: 0, tableId: '' };
    this.setState({ editingKey: newData.key, canEditClnComments: false }, () => store.setEditedColumns([...editableColumns, newData]));
  };



  render() {
    const { store } = this.props;
    const components = { body: { cell: EditableCell } };
    const columns = this.columns.map(col => {
      if (!col.editable) { return col; }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'columnType' ? 'select' : (['isSearch', 'isShow'].includes(col.dataIndex)) ? 'radio' : col.dataIndex === 'dictionKey' ?  'treeSelect' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    let editableContextValue = {
      form: this.props.form,
      store: this.props.store,
      changeTreeSelectStatus: this.changeTreeSelectStatus,
      disabledTreeSelect: this.state.disabledTreeSelect,
      canEditClnComments: this.state.canEditClnComments
    };

    return (
      <EditableContext.Provider value={editableContextValue} >
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, width: '80px' }} ghost>添加列</Button>
        <Table
          style={{color: '#fff' }}
          components={ components }
          bordered
          dataSource={ store.editableColumns }
          columns={ columns }
          rowClassName="editable-row"
          pagination={this.state.pageNation}
        />
      </EditableContext.Provider>
    );
  }
}

export const EditableFormTable = Form.create()(EditableTable);
