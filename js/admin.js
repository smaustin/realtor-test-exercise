'use strict'
// TODO: add authentication
let houses;
let house;

/**
 * Fetch houses as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded');
    fetchHouses();
    const houseForm = document.getElementById('house-form');
    houseForm.addEventListener('submit', processHouseForm, false);
});

/**
 * Get current house from page URL.
 */
fetchHouseFromURL = () => {
    const id = getParameterByName('mls');

    if (!id) { // no id found in URL
      console.log('No house id in URL');
    } else {
        const house = self.houses.find(r => r.id == id);
        self.house = house;
        document.getElementById('submit-button').innerHTML = 'Edit House';
        fillHouseForm();
    }
  }

fillHouseForm = (house = self.house) => {
    // loop over each house detail item
    for (let key in house) {
        if (document.getElementById(key) && key !== 'photos' && key !== 'date_listed') {
            document.getElementById(key).value = house[key];
        } else if (key === 'date_listed') {
            let d = new Date(house[key]);
            let listDate = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
            document.getElementById(key).value = listDate;
        }
    }
}

clearHouseForm = () => {
    document.getElementById('house-form').reset();
}

/**
 * Fetch all houses and set their HTML.
 */
fetchHouses = () => {
    DBHelper.fetchAllHouses((error, houses) => {
      if (error) { // Got an error
        console.error(error);
      } else {
        self.houses = houses;
        fillHousesTable();
        fetchHouseFromURL(); //check for house to edit
      }
    });
}

/**
 * Delete house and redisplay.
 */
deleteHouse = (id) => {
    DBHelper.deleteHouseById(id, (error, response) => {
      if (error) { // Got an error
        console.error(error);
      } else {
            clearHousesTable();
            fetchHouses();
      }
    });
}

addHouse = (formData) => {
    const method = 'POST';
    DBHelper.processHouse(method, formData, (error, response) => {
        if (error) {
            console.log(error);
        } else {
            window.location.replace('./admin.html')
            // clearHouseForm();
            // fetchHouses();
        }
    });
}

editHouse = (formData) => {
    const method = 'PUT';
    DBHelper.processHouse(method, formData, (error, response) => {
        if (error) {
            console.log(error);
        } else {
            window.location.replace('./admin.html')
            // clearHouseForm();
            // fetchHouses();
        }
    });
}

/**
 * Function to determine if this is add or edit.
 * TODO: Add validation
 */
processHouseForm = (event) => {
    event.preventDefault();
    // TODO validation
    let form = document.getElementById('house-form');
    // FormData API requires use of name attr on form fields
    let formData = new FormData(form);
    // Need to convert to json object for use on json-server
    let jsonData = {};
    for (let [key, value] of formData.entries()) {
        jsonData[key] = value;
    }

    if (formData.has('id')) {
        if (formData.get('id')) {
            editHouse(jsonData);
        } else {
            addHouse(jsonData);
        }
    } else {
        console.log('Form error no id passed');
    }
}

/**
 * Create all houses HTML and add them to the webpage.
 */
fillHousesTable = (houses = self.houses) => {
    const tbody = document.querySelector('#houses-table > table > tbody');
    houses.forEach(house => {
        const row = document.createElement('tr');
        tbody.append(createHouseRow(house));
    });
}

/**
 * Clear all houses HTML.
 */
clearHousesTable = () => {
    const tbody = document.querySelector('#houses-table > table > tbody');
    tbody.innerHTML = '';
}

/**
 * Create house row HTML.
 */
createHouseRow = (house) => {
    const row = document.createElement('tr');
    
    const id = document.createElement('td');
    id.innerHTML = house.id;
    row.appendChild(id);

    const street1 = document.createElement('td');
    street1.innerHTML = house.street1;
    row.appendChild(street1);

    const city = document.createElement('td');
    city.innerHTML = house.city;
    row.appendChild(city);

    const state = document.createElement('td');
    state.innerHTML = house.state;
    row.appendChild(state);

    const zip = document.createElement('td');
    zip.innerHTML = house.zip;
    row.appendChild(zip);

    const options = document.createElement('td');
    const delHouse = document.createElement('button');
    const editHouse = document.createElement('a');

    delHouse.className = 'delHouse btn btn-primary mx-2';
    delHouse.innerHTML = 'Delete';
    delHouse.addEventListener('click', (event) => {
        event.preventDefault();
        deleteHouse(house.id);
    });
    options.append(delHouse);

    editHouse.className = 'editHouse btn btn-primary';
    editHouse.innerHTML = 'Edit';
    editHouse.href = `./admin.html?mls=${house.id}`;
    editHouse.setAttribute('aria-label', `${editHouse.innerHTML} ${house.id}`);
    editHouse.setAttribute('role', 'button');
    options.append(editHouse);

    row.appendChild(options);

    return row;
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url) {
      url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
      results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
