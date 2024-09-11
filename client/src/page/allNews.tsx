import { Space } from 'antd';
import { useFindAllNewsQuery } from '../service/news';
import { NewCard } from '../component/newCard';
import { Link } from 'react-router-dom';
export const AllNews = () => {
  const { data } = useFindAllNewsQuery();
  return (
    <>
      <main>
        <Space wrap>
          {data?.map((item) => (
            <Link to={'/news/' + item.id}>
              <NewCard
                image={item.image}
                title={item.cardTitle}
                description={item.cardDescription}
                author={item.author}
              />
            </Link>
          ))}
        </Space>
      </main>
    </>
  );
};
