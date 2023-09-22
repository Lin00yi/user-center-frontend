import { SearchUsers ,deleteUser,updateUser} from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Image, message ,Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {  useRef,useState } from 'react';
import request from 'umi-request';
import { register } from '@/services/ant-design-pro/api';
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};


export const handleDelete = async (key, record) => {
  console.log('handleDelete');
  const res=await deleteUser({id:record.id});
  return res
} 

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
    ellipsis: true,
    tip: '用户名过长会自动收缩',
    search: {
      transform: (value) => ({ username: value }),
    },
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    copyable: true,
    search: {
      transform: (value) => ({ userAccount: value }),
    },
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    render: (_, record) => <Image key="avatar" src={record.avatarUrl} width={64} />,
    search: {
      transform: (value) => ({ avatarUrl: value }),
    },
  },

  {
    title: '性别',
    dataIndex: 'gender',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '男',
      },
      1: {
        text: '女',
      },
    },
    search: {
      transform: (value) => ({ gender: value }),
    },
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
    search: {
      transform: (value) => ({ phone: value }),
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    copyable: true,
    search: {
      transform: (value) => ({ email: value }),
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'date',
    search: {
      transform: (value) => ({ createTime: value }),
    },
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    copyable: true,
    search: {
      transform: (value) => ({ userStatus: value }),
    },
  },
  {
    disable: true,
    title: '角色',
    dataIndex: 'userRole',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '普通用户',
        status: 'default',
      },
      1: {
        text: '管理员',
        status: 'Success',
      },
    },
    search: {
      transform: (value) => ({ userRole: value }),
    },
  },
  {
    title: '星球编号',
    dataIndex: 'planetCode',
    copyable: true,
    search: {
      transform: (value) => ({ planetCode: value }),
    },
  },
  // {
  //   disable: true,
  //   title: '标签',
  //   dataIndex: 'labels',
  //   search: false,
  //   renderFormItem: (_, { defaultRender }) => {
  //     return defaultRender(_);
  //   },
  //   render: (_, record) => (
  //     <Space>
  //       {record.labels.map(({ name, color }) => (
  //         <Tag color={color} key={name}>
  //           {name}
  //         </Tag>
  //       ))}
  //     </Space>
  //   ),
  // },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.avatarUrl} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={
          (key) => {operateFunc(key,record,action)}
        }
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

const operateFunc =(key:string, record:any,action:any) => {
  const handle=async ()=>{
    if(key=='copy'){
      record={
        ...record,
        id: (Math.random() * 1000000).toFixed(0),
        //默认密码
        userPassword: '12345678',
      }
      //添加到列表下方
      action?.addEditRecord(record);
    }else if(key=='delete'){
      const res=await deleteUser({id:record.id});
      if(res){
        message.success('删除成功');
        // 重新加载数据
        action?.reload()
      }else{
        message.error('删除失败');
      }
    }
  }
  handle();
}




export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); //控制表单显示
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleSave = async (key, record, origin) => {
    console.log('handleSave'+key);
    const res=await updateUser({id:origin.id, ...record});
    if(res){
      message.success('保存成功');
      actionRef.current?.reload();
    }else{
      message.error('保存失败');
    }
  }
  const addUser = async (values: API.RegisterParams) => {
    const res = await register({ ...values });
    if (res) {
      message.success('添加成功');
      actionRef.current?.reload();
    } else {
      message.error('添加失败');
    }
    setIsModalVisible(false);
  }
  const handleOk = () => {
    form
    .validateFields()  // 文件校验
    .then(values => {
      form.resetFields();
      console.log(values);  // 这里是获取到的输入值
      addUser(values);
    })
    .catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        await waitTime(2000);
        const userList = await SearchUsers(params);
        return { data: userList };
        return request<{
          data: API.CurrentUser[];
        }>('https://proapi.azurewebsites.net/github/issues', {
          params,
        });
      }}
      editable={{
        form,
        type: 'multiple',
        onSave: async(key, record, origin)=>{
          handleSave(key, record, origin);
        },
        onDelete: async (key, record) => {
          const res=await handleDelete(key, record)
          if(res){
            message.success('删除成功');
            actionRef.current?.reload();
          }else{
            message.error('删除失败');
          }
        },
        onChange: ()=>{
          console.log('onChange');
        },

      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              // created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            // actionRef.current?.reload();
            showModal()
          }}
          type="primary"
        >
          新建
        </Button>,
        <Modal title="新建" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form form={form} name="control-hooks">
            <Form.Item
              label="账号"
              name="userAccount"
              rules={[
                {
                  required: true,
                  message: "请输入账号！"
                },
                {
                  min: 6,
                  type: 'string',
                  message: '账号最少6位数',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="密码"
              name="userPassword"
              rules={[
                {
                  required: true,
                  message: "请输入密码！"
                },
                {
                  min: 8,
                  type: 'string',
                  message: '密码最少8位数',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="密码"
              name="checkPassword"
              rules={[
                {
                  required: true,
                  message: "请再次输入密码！"
                },
                {
                  min: 8,
                  type: 'string',
                  message: '密码最少8位数',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="星球编号"
              name="planetCode"
              rules={[
                {
                  required: true,
                  message: "请输入星球编号！"
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      ]}
      
    />
  );
};
