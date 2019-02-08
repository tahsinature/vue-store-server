const faker = require('faker');
const mongoose = require('mongoose');
const db = require('./models');

// const productController = require('./controller/product');

const categoryList = [
  'mobile',
  'electronic',
  'vehicle',
  'property',
  'job',
  'service',
  'home-living',
  'fashion-health-beauty',
  'hobby-sport-kid',
  'business',
  'education',
  'pets',
  'food'
];
// console.log(categoryList);
const product = {};

product.price = faker.commerce.price();
product.title = faker.commerce.productName();
product.description = faker.lorem.words(19);
product.images = [];
product.category = categoryList[Math.round(Math.random() * categoryList.length)];
product.location = 'asia';

for (let i = 0; i < Math.round(Math.random() * 4 + 1); i++) {
  const imgData = {};
  imgData.public_id = Math.random() * 12;
  imgData.url = faker.image.abstract();
  product.images.push(imgData);
}

async function seed() {
  await mongoose
    .connect('mongodb://localhost/e-market')
    .then(() => console.log('Connted to DB via seeder'));
  await db.Product.create(product)
    .then(x => console.log(x))
    .catch(err => console.log(err));
}

for (i = 0; i < 5; i++) {
  seed();
}
