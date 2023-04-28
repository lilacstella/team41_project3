import { useState, useEffect } from 'react';
import Nav from './Nav';
import ManagerView from './manager_view/ManagerView';
import PurchaseView from './purchase_view/PurchaseView';
import MenuView from './menu_view/MenuView';
import LoginModal from './login_view/Login';

function App() {
    const perms = localStorage.getItem('employee_permission');
    if (!perms)
        localStorage.setItem('employee_permission', 'customer');

    const [showLogin, setShowLogin] = useState(false);
    const [view, setView] = useState(perms);

    const backToCustomer = () => {
        localStorage.setItem('employee_permission', 'customer');
        localStorage.setItem('employee_id', 0);
        setView('customer');
    }

    const views = {
        // should be login in customer direct 
        // react component, display text, button directs to, button text
        'customer': [<PurchaseView />, "Spin N' Stone", () => {perms === 'customer' ? setShowLogin(true) : setView(perms) }, 'Login'],
        'server': [<PurchaseView />, "Server View", backToCustomer, 'Sign Out'],
        'manager': [<ManagerView setMenuView={() => (<MenuView />)} />, 'Manager View', backToCustomer, 'Sign Out']
    };
    
    useEffect(() => {
        setView(perms);
    }, [perms]);

    const [currView, displayText, directTo, buttonText] = views[view];
    return (
        <div>
            <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
            <Nav direct={directTo} displayText={displayText} buttonText={buttonText} />
            <div>
                {currView}
            </div>
        </div>
    );
}

export default App;
