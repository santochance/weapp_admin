import React, { PureComponent, /* Fragment */ } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, /* Modal, message, Badge, Divider, Popconfirm */ } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModalForm from '../../components/ModalForm';

import styles from './Registration.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const sortNameToSortIdMap = {
  articles: '5a797cf4e696c90027d78a4b',
  tutors: '5a797cf4e696c90027d78a4c',
  investors: '5a797cf4e696c90027d78a4d',
  photos: '5a797cf4e696c90027d78a4e',
  enterprises: '5a797cf4e696c90027d78a4f',
  organizations: '5a797cf4e696c90027d78a50',
  news: '5a797cf4e696c90027d78a51',
  banners: '5a87acd317d00900353c76c7',
};

@connect(({ rule, content, global, loading }) => ({
  rule,
  content,
  sortsList: global.sortsList,
  loading: loading.models.rule,
}))
@Form.create()
export default class Registration extends PureComponent {
  state = {
    modalVisible: false,
    modalTitle: '',
    modalData: undefined,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const [sortName] = this.props.location.pathname.split('/').slice(-1);
    console.log('TableList mounted with sortName:', sortName);
    this.sortName = sortName;
    this.sortId = sortNameToSortIdMap[sortName];
    const { dispatch } = this.props;
    dispatch({
      type: 'content/fetch',
      payload: { sortName },
    });
  }

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      className: styles.colName,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      className: styles.colPhone,
    },
    {
      title: '身份',
      dataIndex: 'ident',
      className: styles.colIdent,
    },
    {
      title: '公司',
      dataIndex: 'company',
      className: styles.colCompany,
    },
    {
      title: '职位',
      dataIndex: 'job',
      className: styles.colJob,
    },
    {
      title: '参与人数',
      dataIndex: 'ptcpNum',
      className: styles.colPtcpNum,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      className: styles.colRemarks,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      className: styles.colUpdatedAt,
      // sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    /* {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleRemove(record)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    }, */
  ];


  handleRemove = ({ objectId }) => {
    this.props.dispatch({
      type: 'content/remove',
      payload: {
        sortName: this.sortName,
        objectId,
      },
    });
  }

  handleModalOk = (formData) => {
    // 提取新增或更新内容
    let entry;
    if (this.state.modalData) {
      entry = this.modalChangedKeys.reduce((u, key) => ({ ...u, [key]: formData[key] }), {});
    } else {
      entry = { ...formData };
    }

    entry = this.normFormData(entry);

    /* 填充分类数据 */
    if (entry.sort !== undefined) {
      const sortObj = this.props.sortsList.find(s => (s.id === entry.sort));
      if (sortObj) {
        entry.sname = sortObj.title;
      }
    }
    console.log('submitting entry:', entry);

    this.props.dispatch({
      type: 'content/add',
      payload: {
        sortName: this.sortName,
        objectId: this.state.modalData && this.state.modalData.objectId,
        entry,
      },
    });

    this.handleModalVisible(false);
  }

  normFormData = (data) => {
    /* 文件字段的转换处理 */
    const { pics } = data;
    /* sort字段后端要求Number, 前端要求String的转换处理 */
    const updates = {};
    if ('sort' in data) {
      updates.sort = Number(data.sort);
    }
    if (pics && pics.length > 0) {
      // 提取文件列表
      const newPics = pics.reduce((rst, file) => {
        if (file.url) {
          rst.push({ url: file.url, uid: file.uid });
        } else if (file.status === 'done' && file.response) {
          rst.push({ url: file.response.url, uid: file.response.uid });
        }
        return rst;
      }, []);
      updates.pics = newPics;
    }
    return { ...data, ...updates };
  }

  handleModalVisible = (flag, data) => {
    this.setState({
      modalVisible: !!flag,
      modalTitle: flag ? data ? '修改' : '新建' : '',
      modalData: data,
    });
    this.modalChangedKeys = [];
  }

  handleModalDataChange = (key) => {
    if (this.state.modalData) {
      const { modalChangedKeys = [] } = this;
      if (modalChangedKeys.indexOf(key) < 0) {
        // this.setState({
        //   modalChangedKeys: [...modalChangedKeys, key],
        // });
        this.modalChangedKeys.push(key);
      }
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    // const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    // dispatch({
    //   type: 'rule/fetch',
    //   payload: params,
    // });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { sortName } = this;
    const { content: { [sortName]: data = {} }, loading } = this.props;
    const { selectedRows, modalVisible, modalTitle, modalData } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{ display: 'none' }}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator} style={{ display: 'none' }}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <ModalForm
          modalTitle={modalTitle}
          modalVisible={modalVisible}
          onModalOk={this.handleModalOk}
          onModalCancel={() => this.handleModalVisible(false)}
          data={modalData}
          onModalDataChange={this.handleModalDataChange}
          sortId={this.sortId}
        />
      </PageHeaderLayout>
    );
  }
}
