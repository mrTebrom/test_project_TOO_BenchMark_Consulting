import {Card, Image} from 'antd';
interface IProps{
    image: string;
    title: string;
    description: string;
    author: string;
}

const {Meta} = Card;
export const NewCard = ({image, title, description, author}: IProps) => {
    return <Card
        hoverable
        style={{ width: 240 }}
        cover={<Image alt={title} src={image} />}>
        <Meta title={title} description={description} />
    </Card>



}