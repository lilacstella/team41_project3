import React, { StrictMode } from 'react';
import './Gallery.css';

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

const Palette = (props) => {
    return (
        <figure className="palette">
            <AspectRatio>
                <Image angle={135} {...props} />
            </AspectRatio>
            <figcaption className="palette__caption">
                props.name
            </figcaption>
        </figure>
    );
};

const Palettes = (props) => {
    const { palettes } = props;

    return (
        <div className="palettes">
            {palettes.map((palette) => (
                <Palette key={palette.toString()} {...palette} />
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
    const palettes = ["Zesty Red", "Alfredo", "Spicy Red"]; 

    return (
        <div className="gallery">
            <Grid>
                <Palettes palettes={palettes} />
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
    )
}