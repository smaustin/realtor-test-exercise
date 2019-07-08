/**
 * Common database helper functions.
 */
class DBHelper {
  
  /**
   * Remote Database URL.
   */
  static get DATABASE_URL() {
    const port = 4001 // Change this to your server port
    return `http://localhost:${port}`;
  }

  /**
   * Fetch all houses.
   * Primary request for data
   */
  static fetchAllHouses(callback) {    
        
    const houseData = fetch(`${DBHelper.DATABASE_URL}/houses/`)
        .then(fetchResponse => fetchResponse.json())
        .then(arrayOfHouses => {
            return arrayOfHouses;
        }).catch(err => callback(`Remote Request failed. Returned status of ${err.statusText}`, null));

    houseData.then(finalData => {
      callback(null, finalData);
    }).catch(err => callback(`Request failed. Returned status of ${err.statusText}`, null));
  }

    /**
   * Fetch house by filter.
   */
  static fetchHousesByFilter(filters, callback) {
    // Fetch all houses
    DBHelper.fetchAllHouses((error, houses) => {
      if (error) {
        callback(error, null);
      } else {
        let results = houses;
        for (let [key, value] of Object.entries(filters)) {
            if (value != 'all') {
                results = results.filter(r => r[key] == value);
            }
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch a house by its ID.
   */
  static fetchHouseById(id, callback) {
    // fetch all houses with proper error handling.
    DBHelper.fetchAllHouses((error, houses) => {
      if (error) {
        callback(error, null);
      } else {
        const house = houses.find(r => r.mls == id);
        if (house) { // Got the house
          callback(null, house);
        } else { // house does not exist in the database
          callback('House does not exist', null);
        }
      }
    });
  }

  /**
   * Delete a house by its ID.
   */
  static deleteHouseById(id, callback) {
    return fetch(`${DBHelper.DATABASE_URL}/houses/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(finalData => {
      callback(null, finalData);
    })
    .catch(err => callback(`Delete Request failed. Returned status of ${err.statusText}`));
  }
  /**
   * Add or Update a house .
   */
  static processHouse(method, formData, callback) {
    const baseURL = `${DBHelper.DATABASE_URL}/houses/`;
    const fetchURL = (method === 'PUT') ? `${baseURL}/${formData.mls}`: baseURL;
    return fetch(fetchURL, {
      method: method,
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(finalData => {
      callback(null, finalData);
    })
    .catch(err => callback(`Delete Request failed. Returned status of ${err.statusText}`));
  }

  /**
   * House image URL.
   */
  static imageUrlForHouse(house) {
    if (!house.photos) {
      return ('http://placehold.it/500x325');
    }
    return (house.photos);
  }

  /**
   * House page URL.
   */
  static urlForHouse(house) {
    return (`./house.html?mls=${house.mls}`);
  }
}
