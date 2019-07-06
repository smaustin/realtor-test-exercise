let house;

document.addEventListener('DOMContentLoaded', (event) => {
    fetchHouseFromURL();
});
 
/**
 * Get current house from page URL.
 */
fetchHouseFromURL = () => {
    const id = getParameterByName('mls');

    if (!id) { // no id found in URL
      console.log('No house id in URL');
    } else {
      DBHelper.fetchHouseById(id, (error, house) => {
        self.house = house;
        if (!house) {
          console.error(error);
          return;
        }
        fillHouseHTML();
      });
    }
  }

fillHouseHTML = (house = self.house) => {
    const houseDetails = document.getElementById('house-details');
    // loop over each house detial item
    for (let [key, value] of Object.entries(house)) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${key}</strong> : ${value}`;
        houseDetails.append(p);
    }
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