import React from 'react';
import {
  Form, Input, Modal, /* Button, Upload, Icon, Popconfirm */
} from 'antd';
import PicturesWall from '../PicturesWall';
// import MyEditor from './MyEditor'

const { TextArea } = Input;
const FormItem = Form.Item;

class ModalForm extends React.Component {
  state = {
    // editorContent: '',
    // modalVisible: false,
  }
  updateEditorContent = (content) => {
    this.editorContent = content;
  }

  handleOk = () => {
    const { onModalOk, form } = this.props;
    if (onModalOk) {
      onModalOk(form.getFieldsValue());
    }
  }
  handleCancel = () => {
    Modal.confirm({
      title: '关闭编辑框',
      content: '正在关闭当前编辑框，未保存的内容将会丢失。确定要关闭？',
      maskClosable: true,
      cancelText: '返回编辑',
      okText: '确定关闭',
      okType: 'danger',
      onOk: () => {
        if (this.props.onModalCancel) {
          this.props.onModalCancel();
        }
      },
    });
  }
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
    // const formItemLayoutWithOutLabel = {
    //   wrapperCol: {
    //    xs: { span: 24, offset: 0 },
    //    sm: { span: 20, offset: 4 },
    //   },
    // };

    const { modalTitle, modalVisible } = this.props;
    // const data = { ...this.props.data };

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
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          <FormItem {...formItemLayout} label="标题">
            {getFieldDecorator('title', {
              // initialValue: data.title,
            })(
              <Input placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="副标题">
            {getFieldDecorator('subtitle', {
              // initialValue: data.subtitle,
            })(
              <Input placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述">
            {getFieldDecorator('desc', {
              // initialValue: data.desc,
            })(
              <TextArea placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="内容">
            {getFieldDecorator('content', {
              // initialValue: data.content,
            })(
              <TextArea placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="图片">{getFieldDecorator('pics', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <PicturesWall
                name="pics"
                action="https://vc-weapp.leanapp.cn/upload"
              />
            )}
          </FormItem>
          {/*
          <div>
            <div>编辑器内容</div>
            <MyEditor ueditorPath="/vendor/ueditor" value="Default value"
              onChange={this.updateEditorContent} />
          </div>
          */}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({
  onValuesChange: (props, values) => {
    // console.log('form values changed:', values);
    if (props.onModalDataChange) {
      const key = Object.keys(values)[0];
      props.onModalDataChange(key, values[key]);
    }
  },
  mapPropsToFields: (props) => {
    if (props.data) {
      return {
        title: Form.createFormField({ value: props.data.title }),
        subtitle: Form.createFormField({ value: props.data.subtitle }),
        desc: Form.createFormField({ value: props.data.desc }),
        pics: Form.createFormField({ value: props.data.pics }),
        content: Form.createFormField({ value: props.data.content }),
      };
    }
  },
})(ModalForm);
