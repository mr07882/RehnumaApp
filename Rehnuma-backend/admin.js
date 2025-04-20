const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function sanitizeModelName(name) {
  return `${name.replace(/[^a-zA-Z0-9]/g, '')}Item`;
}

function normalizePrice(priceString) {
  // Convert to string and clean the value
  const cleaned = String(priceString)
    .replace(/[^\d.,]/g, '') // Remove non-numeric characters except dots and commas
    .replace(/,/g, m => (/(\.\d+)$/.test(cleaned) ? '' : '.')) // Handle comma as thousand separator or decimal
    .replace(/(\..*)\./g, '$1'); // Remove extra decimal points

  // Parse to float and validate
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
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
        required: true,
        trim: true
      },
      price: {
        type: Number,
        required: true,
        min: 0,
        validate: {
          validator: Number.isFinite,
          message: 'Price must be a finite number'
        }
      }
    });

    const ItemModel = mongoose.model(modelName, itemSchema, supermarketName);
    const items = [];
    let invalidCount = 0;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const price = normalizePrice(row.price);
          
          if (!price) {
            invalidCount++;
            console.log(`Invalid price in row: ${JSON.stringify(row)}`);
            return;
          }

          items.push({
            itemName: String(row.name).trim(),
            price: price
          });
        } catch (error) {
          invalidCount++;
          console.error(`Error processing row: ${error.message}`);
        }
      })
      .on('end', async () => {
        try {
          console.log(`Processing ${supermarketName}:`);
          console.log(`- Valid items: ${items.length}`);
          console.log(`- Invalid items: ${invalidCount}`);

          await ItemModel.deleteMany({});
          if (items.length > 0) {
            await ItemModel.insertMany(items);
          }
          console.log(`Successfully inserted ${items.length} items into ${supermarketName} collection\n`);
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