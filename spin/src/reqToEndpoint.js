// sending request to endpoint
// make API requests for receiving the information from the back-end
// fetch is able to talk to the front-end

// weather, inventory, menu
  function retrieveExampleData() {
    return fetch('/example')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => console.error(error));
  }
  function retrieveMenuData() {
    return fetch('/menu')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => console.error(error));
  }
  function retrieveInventoryData() {
    return fetch('/inventory')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => console.error(error));
  }

  function retrieveWeatherData() {
    return fetch('/weather')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => console.error(error));
  }
