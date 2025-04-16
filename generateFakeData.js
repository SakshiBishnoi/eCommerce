// generateFakeData.js
const { faker } = require('@faker-js/faker');
const fs = require('fs');

const NUM_CATEGORIES = 32;
const NUM_PRODUCTS = 10000;

// Generate categories
const categories = Array.from({ length: NUM_CATEGORIES }, (_, i) => ({
  id: faker.string.uuid(),
  name: faker.commerce.department() + ' ' + (i + 1),
}));

// Generate products
const products = Array.from({ length: NUM_PRODUCTS }, (_, i) => {
  const category = faker.helpers.arrayElement(categories);
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price({ min: 5, max: 2000 })),
    categoryId: category.id,
    categoryName: category.name,
    description: faker.commerce.productDescription(),
    image: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
    stock: faker.number.int({ min: 0, max: 1000 }),
    createdAt: faker.date.past(),
  };
});

// Save to JSON files
fs.writeFileSync('categories.json', JSON.stringify(categories, null, 2));
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

console.log('Fake data generated: categories.json and products.json');