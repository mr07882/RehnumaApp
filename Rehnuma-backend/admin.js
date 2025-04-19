const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function sanitizeModelName(name) {
  return `${name.replace(/[^a-zA-Z0-9]/g, '')}Item`;
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    processCSVFiles();
  })
  .catch(err => console.error('Connection error', err));

async function processCSVFiles() {
  const csvDir = path.join(__dirname, 'CSV');
  const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));

  for (const file of files) {
    const supermarketName = path.basename(file, '.csv');
    const filePath = path.join(csvDir, file);
    await processCSV(supermarketName, filePath);
  }

  await mongoose.disconnect();
  console.log('Done processing all CSV files');
}

function processCSV(supermarketName, filePath) {
  return new Promise((resolve, reject) => {
    const modelName = sanitizeModelName(supermarketName);
    
    if (mongoose.models[modelName]) {
      console.log(`Model ${modelName} already exists, skipping creation`);
      return resolve();
    }

    const itemSchema = new mongoose.Schema({
      itemName: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    });

    const ItemModel = mongoose.model(modelName, itemSchema, supermarketName);
    const items = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        items.push({
          itemName: row.name,
          price: parseFloat(row.price) 
        });
      })
      .on('end', async () => {
        try {
          await ItemModel.deleteMany({});
          await ItemModel.insertMany(items);
          console.log(`Inserted ${items.length} items into ${supermarketName} collection`);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}