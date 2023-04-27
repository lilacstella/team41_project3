import './MenuView.css'
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data);

export default function MenuView() {
    const { data, error, isLoading } = useSWR('http://localhost:5000/menu', fetcher);
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
                {
                    ['Sauce', 'Cheese', 'Topping', 'Drizzle'].map(category => {
                        return (
                            <div>
                                <h2>{category}</h2>
                                <div className='menu-view-row'>
                                    {data[category.toLowerCase()].map(item => <p>{item[category.toLowerCase() + '-name']}</p>)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className="menu-view-boxed">
                <p>Original Cheese Pizza - {data['cheese-pizza-price'].price}</p>
                <p>1 Topping Pizza - {data['one-topping-pizza-price'].price}</p>
                <p>2-4 Topping Pizza - {data['multi-topping-pizza-price'].price}</p>
                {menuList.map(item => <p>{item}</p>)}
            </div>
        </div>
    )
}