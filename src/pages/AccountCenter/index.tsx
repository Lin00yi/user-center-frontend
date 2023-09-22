import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import styles from './index.less';

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView: React.FC = () => {
  const { data: currentUser, loading } = useRequest(queryCurrentUser);

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatarUrl) {
        return currentUser.avatarUrl;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };

  const handleFinish = async () => {
    message.success('更新基本信息成功');
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{
                ...currentUser,
                phone: currentUser?.phone.split('-'),
              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="userAccount"
                label="账号"
                rules={[
                  {
                    required: true,
                    message: '请输入您的账号!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="username"
                label="用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的用户名!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="userPassword"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入您的密码!',
                  },
                  {
                    min: 8,
                    message: '密码长度不能小于8位!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="planetCode"
                label="星球编号"
                rules={[
                  {
                    required: true,
                    message: '请输入您的星球编号!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="phone"
                label="手机号"
                rules={[
                  {
                    required: true,
                    message: '请输入您的手机号!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
              <ProFormSelect
                width="sm"
                name="gender"
                label="性别"
                rules={[
                  {
                    required: true,
                    message: '请输入您的性别!',
                  },
                ]}
                options={[
                  {
                    label: '男',
                    value: 0,
                  },
                  {
                    label: '女',
                    value: 1,
                  },
                ]}
              />
              {/* <ProFormTextArea
                name="profile"
                label="个人简介"
                rules={[
                  {
                    required: true,
                    message: '请输入个人简介!',
                  },
                ]}
                placeholder="个人简介"
              /> */}

              {/* <ProFormFieldSet
                name="phone"
                label="联系电话"
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                  { validator: validatorPhone },
                ]}
              >
                <Input className={styles.area_code} />
                <Input className={styles.phone_number} />
              </ProFormFieldSet> */}
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
