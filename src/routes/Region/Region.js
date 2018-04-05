import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from './Region.less';

@connect(({ region, loading }) => ({
  region,
  loading: loading.models.region,
}))
export default class CardList extends PureComponent {
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'list/fetch',
    //   payload: {
    //     count: 8,
    //   },
    // });
  }

  render() {
    const { region: { list }, loading } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <div>
          <Button icon="plus" type="primary">
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
                  actions={[<a>编辑</a>, <a>删除</a>]}
                >
                  <Card.Meta
                    title={<a href="javascript:(0)">{item.title}</a>}
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
                    <Icon type="plus" /> 新增产品
                  </Button>
                </List.Item>
              )
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
