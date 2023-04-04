// sending request to endpoint
// make API requests for receiving the information from the back-end
// fetch is able to talk to the front-end

// weather, inventory, menu

function retrieveExampleData() {
    const url = '/example';
    
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error(error);
      });
  }

function getMenu() {
    const url = '/menu';
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return fetch(url, options)
      .then(response => response.json())
      .then(data => {
        return data.ex;
      });
  }

  function getInventory() {
    const url = '/inventory';
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return fetch(url, options)
      .then(response => response.json())
      .then(data => {
        return data.ex;
      });
  }
  