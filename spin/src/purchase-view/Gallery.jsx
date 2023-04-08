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
    const testFunction = () => {
        // console.log(props.itemName);

    }


    return (
        <figure className="item-box" onClick={testFunction}>
            <AspectRatio>
                <Image {...props} />
            </AspectRatio>
            <figcaption className="item-box-caption">
                {props.itemName}
            </figcaption>
        </figure>
    );
};

const ItemBoxes = (props) => {
    const { itemNames, category } = props;
    // console.log(itemNames);
    return (
        <div className="item-boxes">
            {
                // itemName is Object{"category-name": }
                itemNames.map((itemName) => (
                    <ItemBox itemName={itemName[category + "-name"]} />
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
    const { itemNames, category } = props;
    // console.log(category);
    return (
        <div className="gallery">
            <Grid>
                <ItemBoxes itemNames={itemNames} category={category} />
            </Grid>
        </div>
    );
}

export default function MenuView() {
    const { data, error, isLoading } = useSWR('http://localhost:5000/menu', fetcher);
    var select = 'topping';
    if (error || isLoading)
        return;

    const handleClick = (param) => {
        select = param;
    };

    return (
        <div className="order-box">
            <Navigation handleClick={handleClick} />
            <MenuItems itemNames={data[select]} category={select} />
        </div>
    );
};

/* styling tabs on the left hand side */
function Tab(props) {
    return (
        <div className="tabs" style={{ backgroundColor: props.color }} onClick={props.switchTab}>
            <h2>{props.name}</h2>
        </div>
    );
}

// can be hidden in server view
function Navigation(props) {
    // handling the click for each

    return (
        <div className='tabs'>
            <div className="tab-box">
                <Tab name="Sauce" switchTab={() => props.handleClick('sauce')} />
                <Tab name="Cheese" switchTab={() => props.handleClick('cheese')} />
                <Tab name="Topping" switchTab={() => props.handleClick('topping')} />
                <Tab name="Drizzle" switchTab={() => props.handleClick('drizzle')} />
                <Tab name="Drink" switchTab={() => props.handleClick('drink')} />
                <Tab name="Dough" switchTab={() => props.handleClick('dough')} />
                <Tab name="Seasonal" switchTab={() => props.handleClick('seasonal')} />
            </div>
        </div>
    );
}
