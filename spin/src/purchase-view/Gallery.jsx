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
        <div className="tabs" style={{ backgroundColor: props.color }} onClick={props.switchTab}>
            <h2>{props.name}</h2>
        </div>
    );
}

// can be hidden in server view
function Navigation() {
    // handling the click for each
    const handleClick = (param) => {
        if (param === 'sauce') {
            console.log('sauce');
        } else if (param === 'cheese') {
            console.log('cheese');
        } else if (param === 'topping') {
            console.log('topping');
        } else if (param === 'drizzle') {
            console.log('drizzle');
        } else if (param === 'drink') {
            console.log('drink');
        } else if (param === 'dough') {
            console.log('dough');
        } else if (param === 'seasonal') {
            console.log('seasonal');
        } else {
            console.log('welcome, customer!');
        }
    }
    return (
        <div className='tabs'>
            <div className="tab-box">
                <Tab name="Sauce" switchTab={() => handleClick('sauce')}/>
                <Tab name="Cheese" switchTab={() => handleClick('cheese')}/>
                <Tab name="Topping" switchTab={() => handleClick('topping')}/>
                <Tab name="Drizzle" switchTab={() => handleClick('drizzle')}/>
                <Tab name="Drink" switchTab={() => handleClick('drink')}/>
                <Tab name="Dough" switchTab={() => handleClick('dough')}/>
                <Tab name="Seasonal" switchTab={() => handleClick('seasonal')}/>
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

