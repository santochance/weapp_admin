import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from './TableList';

import styles from './Tutor.less';

const columns = [
  {
    title: '导师名称',
    dataIndex: 'title',
    className: styles.colTitle,
  },
  {
    title: '分类',
    dataIndex: 'sort',
    render: (text, record) => <a href={record.slink}>{record.sname || text}</a>,
  },
  {
    title: '描述',
    dataIndex: 'desc',
    className: styles.colDesc,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    className: styles.colUpdatedAt,
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
];

export default class Tutor extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} />
    );
  }
}
