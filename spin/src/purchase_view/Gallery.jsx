import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import './Gallery.css';

const fetcher = (url) => axios.get(url).then(res => res.data);


// maintaining aspect ratio of the image
const AspectRatio = (props) => {
    const { ratio = 1 / 1, ...otherProps } = props;

    return (
        <div
            className="aspect-ratio"
            style={{ paddingTop: `${100 / ratio}%` }}
            {...otherProps}
        />
    );
};

const Image = (props) => {
    // using props for url in the future
    return (
        <div
            style={{
                backgroundImage: `url('ivan-torres-MQUqbmszGGM-unsplash.jpg')`,
                backgroundSize: "cover",
            }}
        />
    );
};

const ItemBox = (props) => {
    const {itemName, order, setOrder} = props;
    const select = () => {
        setOrder([...order, itemName]);
    }


    return (
        <figure className="menu-item-box" onClick={select}>
            <AspectRatio>
                <Image {...props} />
            </AspectRatio>
            <figcaption className="menu-item-box-caption">
                {itemName}
            </figcaption>
        </figure>
    );
};

const ItemBoxes = (props) => {
    const { itemNames, category, order, setOrder } = props;

    return (
        <div className="menu-item-box-frame">
            {
                // itemName is Object{"category-name": }
                itemNames.map((itemName) => (
                    <ItemBox itemName={itemName[category + "-name"]} order={order} setOrder={setOrder}/>
                ))
            }
        </div>
    );
};

const Grid = (props) => {
    return <div className="grid" {...props} />;
};


// can be changed to be list view or grid view
function MenuItems(props) {
    const { itemNames, category, order, setOrder } = props;

    return (
        <div className="gallery">
            <Grid>
                <ItemBoxes itemNames={itemNames} category={category} order={order} setOrder={setOrder}/>
            </Grid>
        </div>
    );
}

export default function MenuGallery(props) {
    // sauce, topping, cheese, drizzle, drink, dough, seasonal
    const { view, order, setOrder } = props;
    const { data, error, isLoading } = useSWR('http://localhost:5000/menu', fetcher);
    if (error || isLoading)
        return;

    console.log(view);
    
    return (
        <div className="order-box">
            <MenuItems itemNames={data[view]} category={view} order={order} setOrder={setOrder}/>
        </div>
    );
};