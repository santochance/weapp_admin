import React from 'react';
import { Upload, Icon, Modal } from 'antd';

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage } = this.state;
    const { action, name, fileList, listType, onChange, limit } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          listType={listType || 'picture-card'}
          name={name}
          action={action}
          fileList={fileList}
          onChange={onChange}
          onPreview={this.handlePreview}
          multiple
        >
          {limit && fileList && fileList.length >= limit ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
