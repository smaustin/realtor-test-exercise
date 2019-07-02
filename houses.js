const faker = require('faker');
faker.seed(1234)

function generateHouses () {
  let houses = [];

  for (let id = 10; id < 60; id++) {
    let street1 = faker.address.streetAddress();
    let street2 = faker.address.streetAddress();
    let city = faker.random.arrayElement(['West Bend','East Bend','South Bend','North Bend']);
    let state = faker.random.arrayElement(['OR','CA','WA']);
    let zip = faker.random.arrayElement([97702,97701,97703]);
    let neighborhood = faker.random.arrayElement(['North','South','East','West']);
    let salePrice = faker.commerce.price(200000,2000000);
    let DateListed = faker.date.past();
    let bedrooms = faker.random.arrayElement([1,2,3,4,5,6,7]);
    let photos = faker.image.business();
    let bathrooms = faker.random.arrayElement([1,2,3,4,5]);
    let garageSize = faker.random.number();
    let squareFeet = faker.random.number();
    let lotSize = faker.random.number();
    let description = faker.lorem.paragraph();

    houses.push({
      "mls": id,
      "street1": street1,
      "street2": street2,
      "city": city,
      "state": state,
      "zip": zip,
      "neighborhood": neighborhood,
      "sale_price": salePrice,
      "date_listed": DateListed,
      "bedrooms": bedrooms,
      "photos": photos,
      "bathrooms": bathrooms,
      "garage_size": garageSize,
      "square_feet": squareFeet,
      "lot_size": lotSize,
      "description": description
    });
  }

  return { "houses": houses }
}

module.exports = generateHouses