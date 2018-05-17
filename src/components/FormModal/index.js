import React from 'react';
import { Modal } from 'antd';
import QuickForm from '../../components/QuickForm';

export default class FormModal extends React.Component {
  state = {}

  handleOk = () => {
    const { onModalOk } = this.props;
    const { formRef: { props: { form } } } = this;
    form.validateFieldsAndScroll((err) => {
      if (!err) {
        if (onModalOk) {
          onModalOk(form.getFieldsValue());
        }
      }
    });
  }

  handleCancel = () => {
    const { formRef: { props: { form } } } = this;
    const { onModalCancel = () => {} } = this.props;
    if (form.isFieldsTouched()) {
      return Modal.confirm({
        title: '关闭编辑框',
        content: '正在关闭当前编辑框，未保存的内容将会丢失。确定要关闭？',
        maskClosable: true,
        cancelText: '返回编辑',
        okText: '确定关闭',
        okType: 'danger',
        onOk: () => onModalCancel(),
      });
    }
    return onModalCancel();
  }

  render() {
    const { modalTitle, modalVisible, data, onModalDataChange, controls } = this.props;

    return (
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        okText="保存"
        cancelText="取消"
        width={760}
      >
        <QuickForm
          wrappedComponentRef={(inst) => { this.formRef = inst; }}
          data={data}
          controls={controls}
          onValuesChange={onModalDataChange}
        />
      </Modal>
    );
  }
}
