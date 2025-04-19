const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
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
    console.log(`Processing ${supermarketName}...`);
    await processCSV(supermarketName, filePath);
  }

  await mongoose.disconnect();
  console.log('Done processing all CSV files');
}

function processCSV(supermarketName, filePath) {
  return new Promise((resolve, reject) => {
    // Dynamically create model
    const modelName = `${supermarketName}Item`;
    
    // Cleanup existing model if present
    if (mongoose.models[modelName]) {
      mongoose.deleteModel(modelName);
    }

    // Define schema
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

    // Create model with collection name {supermarket}_items
    const ItemModel = mongoose.model(modelName, itemSchema, `${supermarketName}`);

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
          // Clear existing data
          await ItemModel.deleteMany({});
          // Insert new data
          await ItemModel.insertMany(items);
          console.log(`Inserted ${items.length} items into ${supermarketName}_items collection`);
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