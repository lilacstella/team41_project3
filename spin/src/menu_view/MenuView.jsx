import './MenuView.css'
import useSWR from 'swr';
import axios from 'axios';
import { HOST } from '..';

const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

export default function MenuView() {
    const { data, error, isLoading } = useSWR('menu', fetcher);
    if (error || isLoading)
        return (
            <div className="menu-view-frame">
                <div className="menu-view-boxed">
                    <h1 style={{ "fontFamily": "'Alfa Slab One', sans" }}>Build Your Own Pizza</h1>
                </div>

                <div className="menu-view-boxed" />
            </div>
        )
    // console.log(data);
    var menuList = [];
    Object.keys(data).map(key => {
        if (data[key] !== undefined && Array.isArray(data[key])) {
            data[key].map(item => {
                if (item.price !== undefined)
                    menuList.push(item[key + '-name'] + " " + item.price);
                return null;
            });
        }
        return null;
    })
    return (
        <div className="menu-view-frame">
            <div className="menu-view-boxed">
                <h1 className="menu-view-title">Build Your Own Pizza</h1>
                <div className="menu-view-boxed-row">
                    {
                        ['Sauce', 'Topping', 'Cheese', 'Drizzle'].map(category => {
                            return (
                                <div className="menu-view-boxed-row-item">
                                    <h2>{category}</h2>
                                    <div>
                                        {data[category.toLowerCase()].map(item => <p>{item[category.toLowerCase() + '-name']}</p>)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="menu-view-boxed additionals">
                <p>Original Cheese Pizza - {data['cheese-pizza-price'].price}</p>
                <p>1 Topping Pizza - {data['one-topping-pizza-price'].price}</p>
                <p>2-4 Topping Pizza - {data['multi-topping-pizza-price'].price}</p>
                {menuList.map(item => <p>{item}</p>)}
            </div>
        </div>
    )
}