const faker = require('faker');
const fs = require('fs');
faker.seed(1234)

generateHouses = () => {
  let houses = [];

  // set a id start and end for number of houses to generate
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
      "id": id,
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

  return houses;
}

generateUsers = () => {
  let users = [];

  // set master user for testing
  users.push({
    "id": 1,
    "user_email": 'myemail@testing.com',
    "user_password": 'password'
  });

  // set a id start and end for number of users to generate
  for (let id = 2; id < 10; id++) {
    let email = faker.internet.email();
    let password = faker.internet.password();

    users.push({
      "id": id,
      "user_email": email,
      "user_password": password
    });
  }

  return users;
}

generateData = () => {
  return { "houses": generateHouses(), "users": generateUsers() };
}

let data = JSON.stringify(generateData(), null, 2);

// module.export = generatedData;
fs.writeFileSync('api_server/db.json', data, error => {
  if (error) console.log('File creation failed.');
  console.log('File created successfully.');
});