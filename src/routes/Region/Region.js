import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Popconfirm, message, Modal } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import Ellipsis from '../../components/Ellipsis';
import RegionModalForm from './RegionModalForm';
import DelPrompt from './DelPrompt';

import styles from './Region.less';


const flags = {};

@connect(({ region, loading }) => ({
  region,
  loading: loading.models.region,
}))
export default class Region extends PureComponent {
  state = {
    modalVisible: false,
    modalTitle: '',
    modalData: undefined,
    delPromptVisible: false,
    delPromptData: undefined,
  }

  componentDidMount() {
    console.log('mouted');
    this.props.dispatch({
      type: 'region/fetch',
      callback: (regions) => {
        console.log('regions:', regions);
        if (!regions) {
          Modal.warn({
            content: '没有查询到赛区信息，请稍候重试!',
          });
        // 如果regions为空，弹出提示框
        } else if (!regions.length && !flags.emptyListModal) {
          console.log('list empty');
          flags.emptyListModal = Modal.info({
            content: '当前还没有任何赛区，请首先添加一个赛区。',
            onOk: () => { flags.emptyListModal = null; },
          });
        }
      },
    });
  }

  componentWillUnmount() {
    console.log('unmounted');
    if (!this.props.region.currentRegion.objectId && !flags.noCurrentRegion && !flags.emptyListModal) {
      flags.noCurrentRegion = Modal.warning({
        content: '当前未选择任何赛区！\n请先点击赛区卡片的“图片”或“标题文字”选择一个赛区。',
        onOk: () => { flags.noCurrentRegion = null },
      });
    }
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

  handleRemove = (data) => {
    this.handleDelPromptVisible(true, data);
  }

  handleDelPromptVisible = (flag, data) => {
    this.setState({
      delPromptVisible: !!flag,
      delPromptData: data,
    });
  }
  handleDelPromptOk = ({ objectId }) => {
    this.handleDelPromptVisible(false);
    this.props.dispatch({
      type: 'region/remove',
      payload: {
        objectId,
      },
    });
  }


  handleSelect = (item) => {
    this.props.dispatch({
      type: 'region/saveCurrent',
      payload: item,
      callback: (current) => {
        message.success(`成功切换赛区为：${current.title}`);
      },
    });
  }

  render() {
    const { region: { list, currentRegion }, loading } = this.props;
    const { modalVisible, modalTitle, modalData, delPromptVisible, delPromptData } = this.state;

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
                  className={item.objectId === currentRegion.objectId
                    ? styles.activeCard : styles.card}
                  cover={<img alt="" src={typeof item.pic === 'object' ? item.pic.url : item.pic} onClick={() => this.handleSelect(item)} />}
                  actions={[
                    <a onClick={() => this.handleModalVisible(true, item)}>编辑</a>,
                    <Popconfirm title="是否要删除此项？" onConfirm={() => this.handleRemove(item)}>
                      <a>删除</a>
                    </Popconfirm>,
                  ]}
                >
                  <Card.Meta
                    title={<a onClick={() => this.handleSelect(item)}>{item.title}</a>}
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
          <Modal
            visible={delPromptVisible}
            closable={false}
            okType="danger"
            onOk={this.formRef && this.formRef.onSubmit}
            onCancel={() => this.handleDelPromptVisible(false)}
          >
            <DelPrompt
              data={delPromptData}
              wrappedComponentRef={(inst) => { this.formRef = inst; }}
              onSubmit={this.handleDelPromptOk}
            />
          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}
