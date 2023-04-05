// sending request to endpoint
// make API requests for receiving the information from the back-end
// fetch is able to talk to the front-end

// weather, inventory, menu
export async function retrieveMenuData() {
    try {
        const response = await fetch('http://localhost:5000/menu');
        console.log(response);
        const data = await response.json();
        console.log(data);
        console.log('hi');
        return data;
    } catch (error) {
        return console.error(error);
    }
}

export async function retrieveInventoryData() {
    try {
        const response = await fetch('http://localhost:5000/inventory');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return console.error(error);
    }
}

export async function retrieveWeatherData() {
    try {
        const response = await fetch('http://localhost:5000/weather');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return console.error(error);
    }
}
