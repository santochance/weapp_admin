import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach((column) => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

function populateSname(list, source) {
  if (!list) return;
  const cache = {};
  // 添加sname
  return list.map((v) => {
    /* sid 是分类 id, 改为使用 objectId 后是从 entry.parent 获取*/
    const sid = v.parent;
    let sname;
    if (sid in cache) {
      sname = cache[sid];
    } else {
      // console.log('caculating for sort:', sid);
      sname = (source.find(s => s.objectId === sid) || {}).title;
      cache[sid] = sname;
    }
    return Object.assign({}, v, { sname });
  });
}

@connect(({ sort }) => ({
  sortsList: sort.data.list,
}))
class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map((item) => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data: { data, list, pagination }, loading, columns, sortsList } = this.props;
    const dataSource = populateSname(data, sortsList);

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
      defaultPageSize: 20,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };


    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {
                  needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>{item.title}总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                    )
                  )
                }
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          className={styles.tableView}
          loading={loading}
          rowKey={record => record.id || record.objectId}
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          defaultExpandAllRows
        />
      </div>
    );
  }
}

export default StandardTable;
