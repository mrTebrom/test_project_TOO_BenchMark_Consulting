import { Button, Drawer, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Form, Input, Upload } from 'antd';
import { UploadOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import TextEdition from '../component/textEdition';
import {
  useCreateNewMutation,
  useDeleteNewMutation,
  useFindAllNewsQuery,
  useFindOneNewQuery,
  useUpdateNewMutation,
} from '../service/news';
import { NewCard } from '../component/newCard';

interface ICreate {
  open: boolean;
  close: () => void;
}
interface IEdit extends ICreate {
  id: number | null;
}
export const Admin = () => {
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [destroy] = useDeleteNewMutation();
  const { data } = useFindAllNewsQuery();
  const [id, setId] = useState<number | null>(null);
  const handleEdit = (id: number) => {
    setId(id);
    setEdit(true);
  };
  return (
    <div style={{ padding: 30 }}>
      <Space>
        <Button onClick={() => setCreate(true)}>Создать новость</Button>
      </Space>
      <br />
      <Space wrap>
        {data?.map((item) => (
          <div key={item.id}>
            <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
              <Button
                size="small"
                icon={<CloseOutlined />}
                type="primary"
                danger
                onClick={() => destroy(item.id)}
              ></Button>
              <Button
                size="small"
                icon={<EditOutlined />}
                type="primary"
                onClick={() => handleEdit(item.id)}
              ></Button>
            </Space>
            <NewCard
              image={item.image}
              title={item.cardTitle}
              description={item.cardDescription}
              author={item.author}
            />
          </div>
        ))}
      </Space>
      <Create open={create} close={() => setCreate(false)} />
      <Update open={edit} close={() => setEdit(false)} id={id} />
    </div>
  );
};

const Create = ({ open, close }: ICreate) => {
  const [form] = Form.useForm();
  const [mutation] = useCreateNewMutation();
  const handleSubmit = async (values: any) => {
    try {
      const newsData = {
        title: values.title,
        author: values.author,
        content: values.content,
        image: values.image[0].response.path, // Путь к загруженному изображению
        cardTitle: values.cardTitle,
        cardDescription: values.cardDescription,
      };

      await mutation(newsData);
      form.resetFields();
      close();
      console.log('Новость создана');
    } catch (error) {
      console.error('Error uploading file or creating news:', error);
    }
  };

  const handleChangeContent = (str: string) => {
    form.setFieldsValue({ content: str });
  };

  return (
    <Drawer open={open} onClose={close} width={700}>
      <Form layout="vertical" form={form} name="control-hooks" onFinish={handleSubmit}>
        <Form.Item
          name="image"
          label="Изображение"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload action="/upload.php" listType="picture" accept="image/*" name="image">
            <Button icon={<UploadOutlined />}>Выберите файл</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="title" label="Заголовок" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="author" label="Автор" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="cardTitle" label="Загаловок для карточки" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="cardDescription"
          label="Описание для карточки"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Статья">
          <TextEdition onChange={handleChangeContent} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Создать
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
const Update = ({ open, close, id }: IEdit) => {
  const { data } = useFindOneNewQuery(id || 0);
  const [form] = Form.useForm();
  const [update] = useUpdateNewMutation();
  const handleSubmit = async (values: any) => {
    try {
      const newsData = {
        title: values.title,
        author: values.author,
        content: values.content,
        image: values.image[0].response.path, // Путь к загруженному изображению
        cardTitle: values.cardTitle,
        cardDescription: values.cardDescription,
      };

      await update({ news: { ...newsData }, id: data!.id });
      form.resetFields();
      close();
    } catch (error) {
      console.error('Error uploading file or creating news:', error);
    }
  };

  const handleChangeContent = (str: string) => {
    form.setFieldsValue({ content: str });
  };
  useEffect(() => {
    if (open && id) {
      form.setFieldsValue({
        ...data,
        image: [
          {
            uid: '-1',
            name: data?.title,
            status: 'done',
            url: data?.image,
            response: { path: data?.image },
          },
        ],
      });
    }
    console.log(data);
  }, [open, form, data, id]);
  return (
    <Drawer open={open} onClose={close} width={700}>
      <Form layout="vertical" form={form} name="control-hooks" onFinish={handleSubmit}>
        <Form.Item
          name="image"
          label="Изображение"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload action="/upload.php" listType="picture" accept="image/*" name="image">
            <Button icon={<UploadOutlined />}>Выберите файл</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="title" label="Заголовок" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="author" label="Автор" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="cardTitle" label="Загаловок для карточки" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="cardDescription"
          label="Описание для карточки"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Статья">
          <TextEdition onChange={handleChangeContent} value={form.getFieldValue('content')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Создать
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
