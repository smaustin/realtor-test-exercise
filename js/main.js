let houses;

/**
 * Fetch houses as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    fetchHouses();
  });

/**
 * Fetch all houses and set their HTML.
 */
fetchHouses = () => {
    DBHelper.fetchAllHouses((error, houses) => {
      if (error) { // Got an error
        console.error(error);
      } else {
        self.houses = houses;
        fillHousesHTML();
        fetchFilterOptions(['city','state','zip']);
      }
    });
}

/**
 * Create all houses HTML and add them to the webpage.
 */
fillHousesHTML = (houses = self.houses) => {
    const list = document.getElementById('houses-list');
    houses.forEach(house => {
      list.append(createHouseHTML(house));
    });
}

/**
 * Create house HTML.
 */
createHouseHTML = (house) => {
    const item = document.createElement('div');
    item.className = 'col-lg-3 col-md-6 mb-4';

    const card = document.createElement('div');
    card.className = 'card h-100';
    item.append(card);
  
    // // const image = document.createElement('img');
    // // image.className = 'card-img-top';
    // // // const imageURL = DBHelper.imageUrlForhouse(house);
    // // // image.src = imageURL;
    // // image.alt =  'promotional image';
    // // card.append(image);
  
    const div = document.createElement('div');
    div.className = 'card-body';
    card.append(div);

    const title = document.createElement('h4');
    title.innerHTML = house.street1;
    div.append(title);
  
    const address = document.createElement('p');
    address.innerHTML = `$ ${house.sale_price}`;
    div.append(address);
    
    const description = document.createElement('p');
    description.innerHTML = house.description;
    div.append(description);

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    card.append(footer);
  
    const more = document.createElement('a');
    more.className = 'btn btn-primary';
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForHouse(house);
    more.setAttribute('aria-label', `${more.innerHTML} ${house.mls}`);
    more.setAttribute('role', 'button');
    footer.append(more);
   
    return item;
}

/**
 * Update page for current houses.
 */
updateHouses = () => {
    const cSelect = document.getElementById('city-select');
    const sSelect = document.getElementById('state-select');
    const zSelect = document.getElementById('zip-select');
    const bdSelect = document.getElementById('bedrooms-select');
    const btSelect = document.getElementById('bathrooms-select');
  
    const cIndex = cSelect.selectedIndex;
    const sIndex = sSelect.selectedIndex;
    const zIndex = zSelect.selectedIndex;
    const bdIndex = bdSelect.selectedIndex;
    const btIndex = btSelect.selectedIndex;
  
    const filters = {
        'city': cSelect[cIndex].value,
        'state': sSelect[sIndex].value,
        'zip': zSelect[zIndex].value,
        'bathrooms': bdSelect[bdIndex].value,
        'bedrooms': btSelect[btIndex].value
    }
  
    DBHelper.fetchHousesByFilter(filters, (error, houses) => {
      if (error) { // Got an error!
        console.error(error);
      } else {
        resetHouses(houses);
        fillHousesHTML();
      }
    })
  }

/**
 * Clear current houses HTML.
 */
resetHouses = (houses) => {
    // Remove all houses
    self.houses = [];
    const list = document.getElementById('houses-list');
    list.innerHTML = '';
    self.houses = houses;
  }

  /**
 * Fetch all house filter options.
 */
fetchFilterOptions = (filters) => {
    // check for houses
    if(!self.houses || self.houses.length == 0) {
        fetchHouses(); 
    }
    filters.forEach(filter => {
        // Get all filter items from houses
        const items = self.houses.map((v, i) => self.houses[i][filter]);
        // Remove duplicates 
        const uniqueItems = items.filter((v, i) => items.indexOf(v) == i);
        fillFilterOption(filter, uniqueItems);
    })
  }

  /**
 * Set fitler selects.
 */
fillFilterOption = (filter, uniqueItems) => {
    const select = document.getElementById(`${filter}-select`);
    uniqueItems.forEach(item => {
      const option = document.createElement('option');
      option.innerHTML = item;
      option.value = item;
      select.append(option);
    });
  }