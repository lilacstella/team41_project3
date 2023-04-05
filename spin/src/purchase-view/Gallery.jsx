import React from 'react';
import './Gallery.css';
import { retrieveMenuData } from '../requests';

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
        console.log(props.itemName);
        retrieveMenuData();
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
    const { itemNames } = props;

    return (
        <div className="item-boxes">
            {itemNames.map((itemName) => (
                <ItemBox itemName={itemName} />
            ))}
        </div>
    );
};

const Grid = (props) => {
    return <div className="grid" {...props} />;
};

/* styling tabs on the left hand side */
function Tab(props) {
    return (
        <div className="tabs" style={{ backgroundColor: props.color }}>
            <h2>{props.name}</h2>
        </div>
    );
}

// can be hidden in server view
function Navigation() {
    return (
        <div className='tabs'>
            <div className="tab-box">
                <Tab name="Sauce" />
                <Tab name="Cheese" />
                <Tab name="Topping" />
                <Tab name="Drizzle" />
                <Tab name="Drink" />
                <Tab name="Dough" />
                <Tab name="Seasonal" />
            </div>
        </div>
    );
}

// can be changed to be list view or grid view
function MenuItems() {
    const itemNames = ["Original Cheese Pizza", "One Topping Pizza", "Two to Four Topping Pizza"]; 

    return (
        <div className="gallery">
            <Grid>
                <ItemBoxes itemNames={itemNames} />
            </Grid>
        </div>
    );
}

export default function MenuView() {
    return (
        <div className="order-box">
            <Navigation />
            <MenuItems />
        </div>
    );
};