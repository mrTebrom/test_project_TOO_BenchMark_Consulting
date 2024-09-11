import { Col, Row, Typography, Image, Tag, Space, Button, Form, Input } from 'antd';
import { useParams } from 'react-router-dom';
import { CloseOutlined, LikeOutlined } from '@ant-design/icons';
import { useFindOneNewQuery, useLikeMutation, useUnLikeMutation } from '../service/news';
import {
  IComment,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
} from '../service/comment';

export const News = () => {
  const { id } = useParams();
  const [mutateLike] = useLikeMutation();
  const [mutateUnlike] = useUnLikeMutation();

  // Загружаем данные новости
  const { data, error, isLoading } = useFindOneNewQuery(Number(id));

  // Обрабатываем состояние загрузки и ошибки
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки новостей.</div>;
  }

  // Проверяем, что data определено
  if (!data) {
    return <div>Нет доступных данных</div>;
  }

  // Проверяем, поставлен ли лайк
  const isLiked = () => {
    const likesStore = JSON.parse(localStorage.getItem('likes') || '[]') as number[];
    return likesStore.includes(Number(id));
  };

  const handleLike = () => {
    if (isLiked()) {
      // Убираем лайк
      mutateUnlike(Number(id)).then(() => {
        const likesStore = JSON.parse(localStorage.getItem('likes') || '[]') as number[];
        const updatedLikes = likesStore.filter((likeId) => likeId !== Number(id));
        localStorage.setItem('likes', JSON.stringify(updatedLikes));
      });
    } else {
      // Ставим лайк
      mutateLike(Number(id)).then(() => {
        const likesStore = JSON.parse(localStorage.getItem('likes') || '[]') as number[];
        likesStore.push(Number(id));
        localStorage.setItem('likes', JSON.stringify(likesStore));
      });
    }
  };

  return (
    <>
      <Row justify="center" style={{ gap: '20px' }}>
        <Col span={24}>
          <Typography.Title level={1} style={{ textAlign: 'center' }}>
            {data.title}
          </Typography.Title>
        </Col>
        <Col span={20}>
          <Image src={'/' + data.image} alt={data.title} width="100%" height="400px" />
        </Col>
        <Col span={18} dangerouslySetInnerHTML={{ __html: data.content || '' }}></Col>
        <Col span={18}>
          <Row>
            <Col span={12}>
              <Typography.Paragraph>
                Автор: <Tag color="blue"> {data.author}</Tag>
              </Typography.Paragraph>
            </Col>
            <Col span={12}>
              <Typography.Paragraph style={{ textAlign: 'end' }}>
                Дата: <Tag color="blue"> {data.created_at.split(' ')[0]}</Tag>
              </Typography.Paragraph>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Typography.Paragraph>
                Просмотров: <Tag color="red"> {data.views}</Tag>
              </Typography.Paragraph>
            </Col>
            <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space align="center">
                <Button
                  icon={<LikeOutlined />}
                  onClick={handleLike}
                  type={isLiked() ? 'primary' : 'default'}
                >
                  {isLiked() ? 'Убрать лайк' : 'Поставить лайк'}
                </Button>
                <Typography.Paragraph style={{ textAlign: 'end', margin: 0 }}>
                  Лайки: <Tag color="blue"> {data.likes}</Tag>
                </Typography.Paragraph>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={18}>
          <Typography.Title level={2}>Комментарии</Typography.Title>
        </Col>
        <Col span={18}>
          <Comment />
        </Col>
      </Row>
    </>
  );
};

const Comment = () => {
  const { id } = useParams<{ id: string }>();
  const [createComment] = useAddCommentMutation();
  const { data: comments } = useGetCommentsQuery(Number(id));

  const onFinish = async (values: any) => {
    // @ts-ignore
    await createComment({ news_id: Number(id), content: values.comment });
  };

  return (
    <>
      <Form onFinish={onFinish}>
        <Form.Item name="comment" rules={[{ required: true, message: 'Введите комментарий' }]}>
          <Input.TextArea placeholder="Введите комментарий" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Отправить
          </Button>
        </Form.Item>
        {comments?.map((comment: IComment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </Form>
    </>
  );
};

export const CommentItem = ({ comment }: { comment: IComment }) => {
  const [deleteComment] = useDeleteCommentMutation();

  const handleDelete = () => {
    deleteComment(comment.id);
  };

  return (
    <div
      style={{
        marginBottom: '10px',
        border: '1px solid black',
        borderRadius: 8,
        padding: 10,
        position: 'relative',
      }}
    >
      <Typography.Paragraph>{comment.content}</Typography.Paragraph>

      <button
        onClick={handleDelete}
        style={{ background: 'none', border: 'none', position: 'absolute', top: 0, right: 0 }}
      >
        <CloseOutlined />
      </button>
    </div>
  );
};
