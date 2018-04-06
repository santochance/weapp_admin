import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Popconfirm } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import Ellipsis from '../../components/Ellipsis';
import RegionModalForm from './RegionModalForm';

import styles from './Region.less';

@connect(({ region, loading }) => ({
  region,
  loading: loading.models.region,
}))
export default class Region extends PureComponent {
  state = {
    modalVisible: false,
    modalTitle: '',
    modalData: undefined,
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'region/fetch',
    });
  }

  handleModalVisible = (flag, data) => {
    this.setState({
      modalVisible: !!flag,
      modalTitle: flag ? data ? '修改赛区' : '新建赛区' : '',
      modalData: data,
    });
    // 清空用于跟踪ModalForm内发生过变化的属性键的列表
    this.modalChangedKeys = [];
  }

  handleModalDataChange = (key) => {
    if (this.state.modalData) {
      const { modalChangedKeys = [] } = this;
      if (modalChangedKeys.indexOf(key) < 0) {
        this.modalChangedKeys.push(key);
      }
    }
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
      type: 'region/add',
      payload: {
        objectId: this.state.modalData && this.state.modalData.objectId,
        entry,
      },
    });

    this.handleModalVisible(false);
  }

  handleRemove = ({ objectId }) => {
    this.props.dispatch({
      type: 'region/remove',
      payload: {
        objectId,
      },
    });
  }

  render() {
    const { region: { list }, loading } = this.props;
    const { modalVisible, modalTitle, modalData } = this.state;

    const content = (
      <div className={styles.pageHeaderContent}>
        <div>
          <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
            新建
          </Button>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img alt="这是一个标题" src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" />
      </div>
    );

    return (
      <PageHeaderLayout
        title="赛区管理"
        content={content}
        extraContent={extraContent}
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, xl: 6, lg: 6, md: 4, sm: 4, xs: 2 }}
            dataSource={list}
            renderItem={item => (item ? (
              <List.Item key={item.objectId}>
                <Card
                  hoverable
                  className={styles.card}
                  cover={<img alt="" src={item.pic} />}
                  actions={[
                    <a onClick={() => this.handleModalVisible(true, item)}>编辑</a>,
                    <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleRemove(item)}>
                      <a>删除</a>
                    </Popconfirm>
                  ]}
                >
                  <Card.Meta
                    title={<a href="#">{item.title}</a>}
                    description={(
                      <div>
                        <div><span>{item.city}</span></div>
                        <div>排序：<span>{item.order}</span></div>
                      </div>
                    )}
                  />
                </Card>
              </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 新增赛区
                  </Button>
                </List.Item>
              )
            )}
          />
          <RegionModalForm
            modalTitle={modalTitle}
            modalVisible={modalVisible}
            onModalOk={this.handleModalOk}
            onModalCancel={() => this.handleModalVisible(false)}
            data={modalData}
            onModalDataChange={this.handleModalDataChange}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
