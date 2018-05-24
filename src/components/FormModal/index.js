import React from 'react';
import { Modal } from 'antd';
import QuickForm from '../../components/QuickForm';

export default class FormModal extends React.Component {
  state = {}

  getDirtyFieldValues = (form) => {
    const { controls } = this.props;
    // 遍历controls
    // 筛选出dirty control的值
    return controls.reduce((rst, control) => {
      const { name } = control;
      return form.isFieldTouched(name)
        ? { ...rst, [name]: form.getFieldValue(name) }
        : rst;
    }, {});
  }

  handleUploadType = (files) => {
    if (!files) return [];
    return files.map((file) => {
      if (!file.response || !file.status) {
        return file;
      } else if (file.status === 'done') {
        const { url, uid, thumbnailUrl } = file.response;
        return { url, uid, thumbnailUrl };
      }
      return undefined;
    });
  }

  handleOk = () => {
    const { formRef: { props: { form } } } = this;
    form.validateFieldsAndScroll((err) => {
      if (!err) {
        const { onModalOk = () => {}, data, controls } = this.props;
        const outputData = data ? this.getDirtyFieldValues(form)
          : form.getFieldsValue();

        controls.forEach((control) => {
          const key = control.name;
          if (!(key in outputData)) return;

          let value = outputData[key];
          // 注意Upload组件中fileList的对象结构
          if (control.type === 'upload') {
            value = this.handleUploadType(value);
          }
          if (control.outputTransform) {
            value = control.outputTransform(value);
          }
          outputData[key] = value;
        });
        onModalOk(outputData);
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
